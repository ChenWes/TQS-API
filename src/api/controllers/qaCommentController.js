'use strict';
import jwt from 'jsonwebtoken';
const bcryptjs = require('bcryptjs');

import { logger } from '../common/logger';
import qaCommentModel from '../models/qaCommentModel';

import { responseFormat } from '../common/responseFormat';

import {
    getQACommentList,
    getQACommentPageList,
    getQACommentByID,
    getQACommentByType,

    createQAComment,
    updateQAComment,
    removeQAComment
} from '../bll/qaComment';

/* get qaComment */

exports.ListAllQAComment = (req, res) => {
    try {
        getQACommentList()
            .then(qaComments => {
                return res.status(200).json(responseFormat(null, qaComments));
            })
            .catch(err => {
                return res.status(400).json(responseFormat(err, null));
            })
    }
    catch (error) {
        return res.status(400).json(responseFormat(error, null));
    }
};

exports.GetQACommentByID = (req, res) => {
    try {
        getQACommentByID(req.params.id)
            .then(qaComments => {
                return res.status(200).json(responseFormat(null, qaComments));
            })
            .catch(err => {
                return res.status(400).json(responseFormat(err, null));
            })
    }
    catch (error) {
        return res.status(400).json(responseFormat(error, null));
    }
};

exports.GetQACommentByType = (req, res) => {
    try {
        getQACommentByType(req.params.GetQACommentByType)
            .then(qaComments => {
                return res.status(200).json(responseFormat(null, qaComments));
            })
            .catch(err => {
                return res.status(400).json(responseFormat(err, null));
            })
    }
    catch (error) {
        return res.status(400).json(responseFormat(error, null));
    }
};

exports.GetQACommentListPage = (req, res) => {
    try {
        let pageSize = 20;
        let pageIndex = 1;

        if (req.params.size) {
            pageSize = parseInt(req.params.size, 10);
        }
        if (req.params.index) {
            pageIndex = parseInt(req.params.index, 10);
        }

        getQACommentPageList(pageSize, pageIndex)
            .then(qaComments => {
                return res.status(200).json(responseFormat(null, qaComments));
            })
            .catch(err => {
                return res.status(400).json(responseFormat(err, null));
            })
    }
    catch (error) {
        return res.status(400).json(responseFormat(error, null));
    }
}

/* qaComment operation */

exports.CreateQAComment = (req, res) => {
    try {
        let { commentType, commentDesc } = req.body;
        let qaComment = new qaCommentModel({
            commentType,
            commentDesc
        });

        createQAComment(qaComment)
            .then((newQAComment) => {
                return res.status(200).json(responseFormat(null, newQAComment));
            }).catch((err) => {
                return res.status(400).json(responseFormat(err, null));
            });
    }
    catch (error) {
        return res.status(400).json(responseFormat(error, null));
    }
};

exports.UpdateQAComment = (req, res) => {
    try {        
        updateQAComment(req.params.id, req.body)
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

exports.DeleteQAComment = (req, res) => {
    try {
        removeQAComment(req.params.id)
            .then(qaComment => {
                return res.status(200).json(responseFormat(null, qaComment));
            })
            .catch(err => {
                return res.status(400).json(responseFormat(err, null));
            })
    }
    catch (error) {
        return res.status(400).json(responseFormat(error, null));
    }
};