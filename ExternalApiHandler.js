let httpReq = require('request');
let logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;


let CallExternalAPI = function(applicationUrl, payload, callback)
{
    try
    {
        logger.debug('[DVP-EventTriggerService.CallExternalAPI] - [%s] -  Creating Post Message');

        let options = {
            url: applicationUrl,
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        };

        httpReq.post(options, function (error, response, body)
        {
            if (!error && response.statusCode >= 200 && response.statusCode <= 299)
            {
                callback(null, applicationUrl);
            }
            else
            {
                logger.error('[DVP-EventTriggerService.CallExternalAPI] - [%s] -  Error calling api : %s', applicationUrl);
                callback(error, null);
            }
        })

    }
    catch(ex)
    {
        logger.error('[DVP-EventMonitor.IncrementMaxChanLimit] - [%s] - Exception occurred', reqId, ex);
        callback(ex, null);
    }
};

module.exports.CallExternalAPI = CallExternalAPI;