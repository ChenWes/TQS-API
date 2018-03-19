'use strict';
import jwt from 'jsonwebtoken';
const bcryptjs = require('bcryptjs');

import { logger } from '../common/logger';
import userModel from '../models/userModel';

import { responseFormat } from '../common/responseFormat';

import {
    getUserList,
    getUserPageList,
    getUserByID,
    getUserByCode,
    createUser,
    updateUser,
    removeUser
} from '../bll/user';

/* get user */

exports.ListAllUser = (req, res) => {
    try {
        getUserList()
            .then(users => {
                return res.status(200).json(responseFormat(null, users));
            })
            .catch(err => {
                return res.status(400).json(responseFormat(err, null));
            })
    }
    catch (error) {
        return res.status(400).json(responseFormat(error, null));
    }
};

exports.GetSingleUser = (req, res) => {
    try {
        getUserSingleData(req.params.id)
            .then(user => {
                return res.status(200).json(responseFormat(null, user));
            })
            .catch(err => {
                return res.status(400).json(responseFormat(err, null));
            })
    }
    catch (error) {
        return res.status(400).json(responseFormat(error, null));
    }
};

exports.GetUserListPage = (req, res) => {
    try {
        let pageSize = 20;
        let pageIndex = 1;

        if (req.params.size) {
            pageSize = parseInt(req.params.size, 10);
        }
        if (req.params.index) {
            pageIndex = parseInt(req.params.index, 10);
        }

        getUserListWithPage(pageSize, pageIndex)
            .then(users => {
                return res.status(200).json(responseFormat(null, users));
            })
            .catch(err => {
                return res.status(400).json(responseFormat(err, null));
            })
    }
    catch (error) {
        return res.status(400).json(responseFormat(error, null));
    }
}

/* user operation */

exports.CreateUser = (req, res) => {
    try {
        let { employeeID, password, department, username } = req.body;
        let user = new userModel({
            employeeID,
            password,
            department,
            username,
        });

        //为空性检查
        const err = user.validateSync()
        if (err) {
            return res.status(400).json(responseFormat(err, null));
        }

        //密码
        if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,10}$/.test(password)) {
            return res.status(400).json(responseFormat(new Error('The password must include a combination of uppercase and lowercase letters and numbers. You can\'t use special characters.The length is between 6 - 10'), null));
        }

        //检查重复性，再加入至数据库
        getUserByCode(employeeID).then((checkuser) => {
            if (checkuser) {
                throw new Error('Create User Error: User Is Exist');
            } else {
                //密码加密
                const salt = bcryptjs.genSaltSync(10);
                const hash = bcryptjs.hashSync(user.password, salt);
                user.password = hash;                

                return createUser(user);
            }
        }).then((newuser) => {
            return res.status(200).json(responseFormat(null, newuser));
        }).catch((err) => {
            return res.status(400).json(responseFormat(err, null));
        });
    }
    catch (error) {
        return res.status(400).json(responseFormat(error, null));
    }
};

exports.UpdateUser = (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = md5(req.body.password);
        }
        updateAUser(req.params.id, req.body)
            .then(users => {
                return res.status(200).json(responseFormat(null, users));
            })
            .catch(err => {
                return res.status(400).json(responseFormat(err, null));
            })
    }
    catch (error) {
        return res.status(400).json(responseFormat(error, null));
    }
};

exports.DeleteUser = (req, res) => {
    try {
        removeAUser(req.params.id)
            .then(user => {
                return res.status(200).json(responseFormat(null, user));
            })
            .catch(err => {
                return res.status(400).json(responseFormat(err, null));
            })
    }
    catch (error) {
        return res.status(400).json(responseFormat(error, null));
    }
};