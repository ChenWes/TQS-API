'use strict';
import mongoose from './db';
const bcryptjs = require('bcryptjs');

let Schema = mongoose.Schema;

let userSchema = new Schema({
    employeeID: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^\w{5,8}$/.test(v)
            },
            message: '\'{VALUE}\' is not a valid employeeID! Support only English letters, numbers or underscores.The length is between 5 - 8'
        },
        required: [true, 'Kindly enter the employeeID']
    },
    username: {
        type: String,
        trim: true,
        required: [true, 'Kindly enter the user name']
    },
    department: {
        type: String,
        trim: true,
        required: [true, 'Kindly enter the department']
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Kindly enter the user password']
    },
    status: {
        type: [{
            type: String,
            enum: ['enable', 'disable']
        }],
        default: ['enable']
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

userSchema.set('collection', 'user');
const userModel = mongoose.model('user', userSchema);

userSchema.methods.verify = async function (password) {
    const user = await this.model('user').findOne({ employeeID: this.employeeID })
    return user && bcryptjs.compareSync(password, user.auth.local.password)
  }

export default userModel;
