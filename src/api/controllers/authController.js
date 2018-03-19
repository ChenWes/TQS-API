'use strict';
import md5 from 'md5';
import jwt from 'jsonwebtoken';
import moment from 'moment';
const bcryptjs = require('bcryptjs');

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
import jwtEncode from '../common/jwtBasicSetting';
import { logger } from '../common/logger';

//检查token
exports.loginRequired = (req, res, next) => {
    if (req.user) {
        let user = req.user;
        getUserByCode(user.employeeID)
            .then(getUser => {
                if (getUser) {
                    next();
                } else {
                    return res.status(401).json(responseFormat(new Error('Unauthorized user'), null));
                }
            })
            .catch(err => {
                return res.status(401).json(responseFormat(err, null, 'Unauthorized user'));
            });

    } else {
        return res.status(401).json(responseFormat(new Error('Unauthorized user'), null));
    }
}

exports.getToken = (req, res) => {
    try {
        let { employeeID, password } = req.body;

        if (!employeeID) {
            return res.status(401).json(responseFormat(new Error('Sign Error:employeeID Is Empty'), null));
        } else if (!password) {
            return res.status(401).json(responseFormat(new Error('Sign Error:password Is Empty'), null));
        }

        var getUser;

        getUserByCode(employeeID)
            .then((user) => {
                if (!user) {
                    return res.status(401).json(responseFormat(new Error('Sign Error:employeeID Incorrect'), null));
                } else {
                    getUser = user;
                    return true;
                }
            }).then((flag) => {
                if (bcryptjs.compareSync(password, getUser.password)) {
                    let data = {
                        user: {
                            employeeID: getUser.employeeID,
                            username: getUser.username,
                            department: getUser.department
                        },
                        token: jwt.sign({
                            employeeID: getUser.employeeID,
                            username: getUser.username,
                            department: getUser.department
                        }, jwtEncode.encode)
                    }

                    return res.status(200).json(responseFormat(null, data));
                } else {
                    return res.status(401).json(responseFormat(new Error('Sign Error:password Incorrect'), null));
                }
            })
            .catch((err) => {
                return res.status(401).json(responseFormat(err, null));
            });
    }
    catch (error) {
        return res.status(401).json(responseFormat(error, null));
    }
}

exports.refreshToken = (req, res) => {
    try {
        if (req.user) {
            let user = req.user;
            let expries = moment().add('days', jwtEncode.expDay).valueOf();
            updateAUser(user.id, { exp: expries })
                .then(userData => {
                    return res.status(200).json({
                        token: jwt.sign({
                            id: userData._id,
                            userCode: userData.code,
                            userName: userData.name,
                            userDisplayName: userData.displayname,
                            email: userData.email,
                            exp: userData.exp
                        }, jwtEncode.encode)
                    });
                })
                .catch(err => {
                    return res.status(401).json(responseFormat(err, null, 'Refresh Token Err'));
                });

        } else {
            throw new Error('No User Info');
        }
    }
    catch (error) {
        return res.status(401).json(responseFormat(error, null, 'Refresh Token Error'));
    }
}

exports.userLogin = (req, res) => {

}