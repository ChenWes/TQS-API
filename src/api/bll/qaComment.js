'use strict';
import extend from 'extend';
import qaCommentModel from '../models/qaCommentModel';

/* get qaComment */

const getQACommentList = () => {
    try {
        return qaCommentModel.find().sort({ CreateAt: 'asc' });
    } catch (error) {
        return Promise.reject(error);
    }
}

const getQACommentPageList = (pageSize, pageIndex) => {
    try {
        return qaCommentModel.find().skip(pageSize * (pageIndex - 1)).limit(pageSize).sort({ CreateAt: 'asc' });
    } catch (error) {
        return Promise.reject(error);
    }
}

const getQACommentByID = (qaCommentID) => {
    try {
        return qaCommentModel.findById(userID);
    } catch (error) {
        return Promise.reject(error);
    }
}

const getQACommentByType = (commentType) => {
    try {
        return qaCommentModel.find({ commentType: commentType }).sort({ CreateAt: 'asc' });
    } catch (error) {
        return Promise.reject(error);
    }
}

/* qaComment operation */
const createQAComment = (userEntity) => {
    try {
        return qaCommentModel.create(userEntity);
    } catch (error) {
        return Promise.reject(error);
    }
}

const updateQAComment = (qaCommentID, qaCommentObject) => {
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

        return qaCommentModel.findByIdAndUpdate(
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

const removeQAComment = (qaCommentID) => {
    try {
        return qaCommentModel.findByIdAndRemove(userID)
            .then(data => {
                return data
            });
    } catch (error) {
        return Promise.reject(error);
    }
}

export {
    getQACommentList,
    getQACommentPageList,
    getQACommentByID,    
    getQACommentByType,

    createQAComment,
    updateQAComment,
    removeQAComment
}