'use strict';

import fetch from 'node-fetch';

import { logger } from '../common/logger';
import { responseFormat } from '../common/responseFormat';
import Config from 'config-lite';

//get config
let config = Config(__dirname);

/* get order */
exports.SearchOrder = (req, res) => {
    try {
        let { orderNo, cardNo } = req.query;
        logger.info('search order get parameter', { orderNo, cardNo });
        let getUrl = config.ETS_API_Server + config.productionOrderSearchApi;

        getUrl += '?' + 'zdcode=' + orderNo + '&' + 'cardcode=' + cardNo;

        fetch(getUrl, {
            method: 'GET'
        }).then((Response) => {
            return Response.json();
        }).then((json) => {
            logger.info('search order result',json);
            if (json.resultType == 'SUCCESS') {
                return res.status(200).json(responseFormat(null, json.results));
            } else {
                if (json.resultMsg) {
                    return res.status(400).json(responseFormat(new Error(json.resultMsg), null));
                } else {
                    return res.status(400).json(responseFormat(new Error('Unknow Error'), null));
                }
            }
        }).catch((err) => {
            return res.status(400).json(responseFormat(err, null));
        })

    }
    catch (error) {
        return res.status(400).json(responseFormat(error, null));
    }
};