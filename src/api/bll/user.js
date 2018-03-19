'use strict';
import extend from 'extend';
import userModel from '../models/userModel';

/* get user */

const getUserList = () => {
    try {
        return userModel.find().sort({ CreateAt: 'asc' });
    } catch (error) {
        return Promise.reject(error);
    }
}

const getUserPageList = (pageSize, pageIndex) => {
    try {
        return userModel.find().skip(pageSize * (pageIndex - 1)).limit(pageSize).sort({ CreateAt: 'asc' });
    } catch (error) {
        return Promise.reject(error);
    }
}

const getUserByID = (userID) => {
    try {
        return userModel.findById(userID);
    } catch (error) {
        return Promise.reject(error);
    }
}

const getUserByCode = (employeeID) => {
    try {                
        return userModel.findOne({ employeeID });
    } catch (error) {
        return Promise.reject(error);
    }
}

/* user operation */
const createUser = (userEntity) => {
    try {
        return userModel.create(userEntity);
    } catch (error) {
        return Promise.reject(error);
    }
}

//验证重复性
// const checkUserDup = (employeeID) => {
//     try {
//         return userModel.findOne({ employeeID });
//     } catch (error) {
//         return Promise.reject(error);
//     }
// }

const updateUser = (userID, userObject) => {
    try {
        let options = extend(
            true,
            {},
            {
                // $push: {
                //     logs: userObject
                // }
            },
            {
                $set: userObject
            }
        )

        return userModel.findByIdAndUpdate(
            userID,
            options, {
                new: true
            }).then(data => {
                return data
            });

    } catch (error) {
        return Promise.reject(error);
    }
}

const removeUser = (userID) => {
    try {
        return userModel.findByIdAndRemove(userID)
            .then(data => {
                return data
            });
    } catch (error) {
        return Promise.reject(error);
    }
}

export {
    getUserList,
    getUserPageList,
    getUserByID,
    getUserByCode,
    createUser,
    updateUser,
    removeUser
}