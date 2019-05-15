let restify = require('restify');
let config = require('config');
let async = require('async');
let messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
let nodeUuid = require('node-uuid');
let logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
let jwt = require('restify-jwt');
let externalApi = require('./ExternalApiHandler.js');

console.log('Host : ' + JSON.stringify(config));

let secret = require('dvp-common/Authentication/Secret.js');
let authorization = require('dvp-common/Authentication/Authorization.js');
let redisHandler = require('./RedisHandler.js');

let hostIp = config.Host.Ip;
let hostPort = config.Host.Port;
let hostVersion = config.Host.Version;


let server = restify.createServer({
    name: 'localhost',
    version: '1.0.0'
});



restify.CORS.ALLOW_HEADERS.push('authorization');
server.use(restify.CORS());
server.use(restify.fullResponse());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
//server.use(restify.urlEncodedBodyParser());

server.use(jwt({secret: secret.Secret,
    getToken: function fromHeaderOrQuerystring (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0].toLowerCase() === 'bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.params && req.params.Authorization) {
            return req.params.Authorization;
        }
        return null;
    }}));


server.post('/DVP/API/:version/EventTrigger/Trigger', authorization({resource:"cdr", action:"read"}), function(req, res, next)
{
    try
    {
        logger.debug('[DVP-EventTriggerService.Trigger] - METHOD CALL - Body : %s', JSON.stringify(req.body));
        let companyId = req.user.company;
        let tenantId = req.user.tenant;

        let emptyList = [];

        if(req.query && req.query.eventType)
        {
            let evtType = req.query.eventType;

            if (evtType === 'CALL' || evtType === 'AGENT' || evtType === 'TICKET')
            {
                let hashName = 'EventTrigger:' + tenantId + ':' + companyId + ':' + evtType;

                redisHandler.HashGetAll(hashName, function(err, hashObj){
                    if(err){
                        logger.error('[DVP-EventTriggerService.Trigger] - ERROR : ', err);
                        let jsonString = messageFormatter.FormatMessage(err, "API RESPONSE", false, emptyList);
                        res.end(jsonString)
                    }else{
                        if(hashObj)
                        {
                            let arr = [];
                            for(let key in hashObj)
                            {
                                arr.push(externalApi.CallExternalAPI.bind(this, hashObj[key], req.body));
                            }

                            async.parallel(arr, function (err, urlList)
                            {
                                let jsonString = messageFormatter.FormatMessage(err, "API RESPONSE", !err, urlList);
                                res.end(jsonString)
                            })
                        }
                        else
                        {
                            logger.debug('[DVP-EventTriggerService.Trigger] - Hash Not Found');
                            let jsonString = messageFormatter.FormatMessage(null, "API RESPONSE", true, emptyList);
                            res.end(jsonString)
                        }

                    }
                });
            }
            else
            {
                logger.error('[DVP-EventTriggerService.Subscribe] - ERROR : ', new Error('Unsupported event type'));
                let jsonString = messageFormatter.FormatMessage(new Error('Unsupported event type'), "API RESPONSE", false, emptyList);
                res.end(jsonString)
            }

        }
        else{
            logger.error('[DVP-EventTriggerService.Subscribe] - ERROR : ', new Error('Empty Body'));
            let jsonString = messageFormatter.FormatMessage(new Error('Empty Body'), "API RESPONSE", false, emptyList);
            res.end(jsonString)
        }



    }
    catch(ex)
    {
        logger.error('[DVP-EventTriggerService.Subscribe] - ERROR : ', ex);
        let jsonString = messageFormatter.FormatMessage(ex, "API RESPONSE", false, emptyList);
        res.end(jsonString)
    }

    return next();
});


server.post('/DVP/API/:version/EventTrigger/Subscribe', authorization({resource:"eventtrigger", action:"write"}), function(req, res, next)
{
    try
    {
        logger.debug('[DVP-EventTriggerService.Subscribe] - METHOD CALL - Body : %s', JSON.stringify(req.body));
        let subId = nodeUuid.v1();
        let companyId = req.user.company;
        let tenantId = req.user.tenant;

        if(req.body && req.body.eventType)
        {
            let evtType = req.body.eventType;

            if (evtType === 'CALL' || evtType === 'AGENT' || evtType === 'TICKET')
            {
                let hashName = 'EventTrigger:' + tenantId + ':' + companyId + ':' + evtType;

                redisHandler.AddToHash(hashName, subId, req.body.hookUrl, function(err, result){
                    if(err){
                        logger.error('[DVP-EventTriggerService.Subscribe] - ERROR : ', err);
                        res.end('{}');
                    }else{
                        let respToZapier = {id: subId, url: req.body.hookUrl};

                        let apiResp = JSON.stringify(respToZapier);

                        logger.info('[DVP-EventTriggerService.Subscribe] - API RESPONSE : %s', apiResp);

                        res.end(apiResp);
                    }
                });
            }
            else
            {
                logger.error('[DVP-EventTriggerService.Subscribe] - ERROR : ', new Error('Unsupported event type'));
                res.end('{}');
            }

        }
        else{
            logger.error('[DVP-EventTriggerService.Subscribe] - ERROR : ', new Error('Empty Body'));
            res.end('{}');
        }



    }
    catch(ex)
    {
        logger.error('[DVP-EventTriggerService.Subscribe] - ERROR : ', ex);
        res.end('{}');
    }

    return next();
});

server.del('/DVP/API/:version/EventTrigger/UnSubscribe/:id', authorization({resource:"eventtrigger", action:"delete"}), function(req, res, next)
{
    try
    {
        let subId = req.params.id;
        logger.debug('[DVP-EventTriggerService.UnSubscribe] - METHOD CALL - id : %s', subId);

        let companyId = req.user.company;
        let tenantId = req.user.tenant;

        if(req.query && req.query.eventType)
        {
            let evtType = req.query.eventType;

            if (evtType === 'CALL' || evtType === 'AGENT' || evtType === 'TICKET')
            {
                let hashName = 'EventTrigger:' + tenantId + ':' + companyId + ':' + evtType;

                redisHandler.RemoveItemFromHash(hashName, subId, function(err, result){
                    if(err){
                        logger.error('[DVP-EventTriggerService.UnSubscribe] - ERROR : ', err);
                        res.end('{}');
                    }else{
                        let respToZapier = {subscribeData: subId};

                        let apiResp = JSON.stringify(respToZapier);

                        logger.info('[DVP-EventTriggerService.UnSubscribe] - API RESPONSE : %s', apiResp);

                        res.end(apiResp);
                    }
                });
            }
        }
        else{
            logger.error('[DVP-EventTriggerService.UnSubscribe] - ERROR : ', new Error('Empty Query Params'));
            res.end('{}');
        }


    }
    catch(ex)
    {
        logger.error('[DVP-EventTriggerService.UnSubscribe] - ERROR : ', ex);
        res.end('{}');
    }

    return next();
});

server.post('/DVP/API/:version/EventTrigger/Zapier/Call/PerformList', authorization({resource:"eventtrigger", action:"read"}), function(req, res, next)
{
    try
    {
        logger.debug('[DVP-EventTriggerService.ZapierCallPerformList] - METHOD CALL');
        let plTestData = [{EventType: "EVTTYPE", Direction: "inbound", SessionId: "sessionid", Timestamp: "1557670909", From: "FromNumber", To: "ToNumber", Skill: "Skill", BusinessUnit: "BusinessUnit"}];

        let jsonStr = JSON.stringify(plTestData);

        logger.info('[DVP-EventTriggerService.ZapierCallPerformList] - API RESPONSE : %s', jsonStr);
        res.end(jsonStr);

    }
    catch(ex)
    {
        logger.error('[DVP-MonitorRestAPI.ZapierCallPerformList] - ERROR : ', ex);
        res.end('[]');
    }

    return next();
});

server.post('/DVP/API/:version/EventTrigger/Zapier/Ticket/PerformList', authorization({resource:"eventtrigger", action:"read"}), function(req, res, next)
{
    try
    {
        logger.debug('[DVP-EventTriggerService.ZapierTicketPerformList] - METHOD CALL');
        let plTestData = [{EventType: "EVTTYPE",
            TicketState: "STATUS",
            Subject: "Ticket Subject",
            Reference: "Ticket Reference",
            Tags: "[\"Tag1\", \"Tag2\"]",
            TicketType: "Ticket Type",
            Priority: "Priority",
            Requester: "Requester",
            Submitter: "Submitter",
            Assignee: "Assignee",
            Other: "Comments",
            BusinessUnit: "BusinessUnit",
            Timestamp: "1557670909"}];

        let jsonStr = JSON.stringify(plTestData);

        logger.info('[DVP-EventTriggerService.ZapierTicketPerformList] - API RESPONSE : %s', jsonStr);
        res.end(jsonStr);

    }
    catch(ex)
    {
        logger.error('[DVP-MonitorRestAPI.ZapierTicketPerformList] - ERROR : ', ex);
        res.end('[]');
    }

    return next();
});

server.post('/DVP/API/:version/EventTrigger/Zapier/Agent/PerformList', authorization({resource:"eventtrigger", action:"read"}), function(req, res, next)
{
    try
    {
        logger.debug('[DVP-EventTriggerService.ZapierAgentPerformList] - METHOD CALL');
        let plTestData = [{EventType: "EVTTYPE",
            Reason: "Reason",
            ResourceId: "Resource ID",
            Timestamp: "1557670909",
            BusinessUnit: "BusinessUnit"}];

        let jsonStr = JSON.stringify(plTestData);

        logger.info('[DVP-EventTriggerService.ZapierAgentPerformList] - API RESPONSE : %s', jsonStr);
        res.end(jsonStr);

    }
    catch(ex)
    {
        logger.error('[DVP-MonitorRestAPI.ZapierAgentPerformList] - ERROR : ', ex);
        res.end('[]');
    }

    return next();
});



function Crossdomain(req,res,next){


    var xml='<?xml version=""1.0""?><!DOCTYPE cross-domain-policy SYSTEM ""http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd""> <cross-domain-policy>    <allow-access-from domain=""*"" />        </cross-domain-policy>';

    var xml='<?xml version="1.0"?>\n';

    xml+= '<!DOCTYPE cross-domain-policy SYSTEM "/xml/dtds/cross-domain-policy.dtd">\n';
    xml+='';
    xml+=' \n';
    xml+='\n';
    xml+='';
    req.setEncoding('utf8');
    res.end(xml);

}

function Clientaccesspolicy(req,res,next){


    var xml='<?xml version="1.0" encoding="utf-8" ?>       <access-policy>        <cross-domain-access>        <policy>        <allow-from http-request-headers="*">        <domain uri="*"/>        </allow-from>        <grant-to>        <resource include-subpaths="true" path="/"/>        </grant-to>        </policy>        </cross-domain-access>        </access-policy>';
    req.setEncoding('utf8');
    res.end(xml);

}

server.get("/crossdomain.xml",Crossdomain);
server.get("/clientaccesspolicy.xml",Clientaccesspolicy);

server.listen(hostPort, hostIp, function () {
    console.log('%s listening at %s', server.name, server.url);
});

//process.stdin.resume();
