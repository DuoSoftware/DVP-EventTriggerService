let httpReq = require('request');
let config = require('config');
let logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;

let webhookTimeout = parseInt(config.WebhookTimeout, 10) || 10000;

// Subscriptions are stored in Redis either as a JSON string
// ({url, authType, token | username, password}) or, for entries created
// before webhook auth was supported, as a bare URL string.
let toSubscription = function(value)
{
    if (value && typeof value === 'object')
    {
        return value;
    }

    if (typeof value === 'string' && value.trim().charAt(0) === '{')
    {
        try
        {
            let parsed = JSON.parse(value);
            if (parsed && parsed.url)
            {
                return parsed;
            }
        }
        catch(ex)
        {
            logger.error('[DVP-EventTriggerService.toSubscription] - Invalid subscription value in redis', ex);
        }
    }

    return {url: value};
};

// Builds the Authorization for an outbound webhook call in the same way as
// DVP-IntegrationAPI ExternalApiAccessHandler.callAppIntegration.
let applyAuth = function(options, subscription)
{
    if (subscription.authType === 'Basic' && subscription.username)
    {
        options.auth = {
            user: subscription.username,
            pass: subscription.password || '',
            sendImmediately: true
        };
    }
    else if (subscription.authType === 'Bearer' && subscription.token)
    {
        options.auth = {
            bearer: subscription.token
        };
    }
};

let CallExternalAPI = function(subscriptionValue, payload, callback)
{
    let applicationUrl;

    try
    {
        let subscription = toSubscription(subscriptionValue);
        applicationUrl = subscription.url;

        logger.debug('[DVP-EventTriggerService.CallExternalAPI] - [%s] - Creating Post Message - Auth : %s', applicationUrl, subscription.authType || 'None');

        let options = {
            url: applicationUrl,
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload),
            timeout: webhookTimeout
        };

        applyAuth(options, subscription);

        httpReq.post(options, function (error, response, body)
        {
            if (!error && response.statusCode >= 200 && response.statusCode <= 299)
            {
                callback(null, applicationUrl);
            }
            else
            {
                logger.error('[DVP-EventTriggerService.CallExternalAPI] - [%s] - Error calling api - Status : %s - Error : %s',
                    applicationUrl, response ? response.statusCode : 'N/A', error ? error.message : body);
                callback(error, null);
            }
        })

    }
    catch(ex)
    {
        logger.error('[DVP-EventTriggerService.CallExternalAPI] - [%s] - Exception occurred', applicationUrl, ex);
        callback(ex, null);
    }
};

module.exports.CallExternalAPI = CallExternalAPI;
module.exports.toSubscription = toSubscription;
