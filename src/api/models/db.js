import mongoose from 'mongoose';
import bluebird from 'bluebird';
import Config from 'config-lite';
import { logger } from '../common/logger';

let config = Config(__dirname);
const DB_URL = process.env.DB_URL || config.DB_URL;

mongoose.Promise = global.Promise; 
// mongoose.Promise = bluebird;

let reConnectTimes = 0
const mongoDBReconnectTimes = process.env.mongoDBReconnectTimes || Number.MAX_VALUE
const mongoDBReconnectDelay = process.env.mongoDBReconnectDelay || 10000

/**
 * 尝试连接
 */
mongoose.connect(DB_URL, {
    useMongoClient: true,
    // server: {
    //     reconnectTries: Number.MAX_VALUE,
    //     reconnectInterval: mongoDBReconnectDelay,
    //     auto_reconnect: true,
    //     poolSize: 10,
    // },
})

/**
  * 连接成功
  */
mongoose.connection.on('connected', () => {
    logger.info('Mongoose Connection Open On ' + DB_URL)
})

/**
 * 连接异常
 */
mongoose.connection.on('error', (err) => {
    logger.error('Mongoose Connection Error: ' + err)
    mongoose.disconnect()
        .then(() => {
            if (reConnectTimes < mongoDBReconnectTimes) {
                setTimeout(() => {
                    reConnectTimes++
                    logger.debug(`Mongoose Reconnection Times:${reConnectTimes}`)

                    mongoose.connect(DB_URL, {
                        server: {
                            reconnectTries: Number.MAX_VALUE,
                            reconnectInterval: mongoDBReconnectDelay,
                            auto_reconnect: true,
                            poolSize: 10,
                        },
                    })
                }, mongoDBReconnectDelay)
            }
        })
})

/**
 * 连接断开
 */
mongoose.connection.on('disconnected', () => {
    logger.info('Mongoose Connection Disconnected')
})

/**
 * 重新连接
 */
mongoose.connection.on('reconnected', () => {
    logger.info('Mongoose Connection Reconnected')
})

export default mongoose;