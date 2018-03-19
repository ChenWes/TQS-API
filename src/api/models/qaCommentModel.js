'use strict';
import mongoose from './db';
const bcryptjs = require('bcryptjs');

let Schema = mongoose.Schema;

let qaCommentSchema = new Schema({    
    commentType: {
        type: String,
        trim: true,
        required: [true, 'Kindly enter the comment type']
    },
    commentDesc: {
        type: String,
        trim: true,
        required: [true, 'Kindly enter the comment desc']
    },    
    CreateAt: {
        type: Date,
        default: Date.now
    },
    CreateBy: {
        type: String
    },
    LastUpdateAt: {
        type: Date,
        default: Date.now
    },
    LastUpdateBy: {
        type: String
    },
});

qaCommentSchema.set('collection', 'QAComment');
const qaCommentModel = mongoose.model('qaComment', qaCommentSchema);

export default qaCommentModel;
