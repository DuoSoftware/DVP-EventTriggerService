let restify = require('restify');
let config = require('config');
let messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
let nodeUuid = require('node-uuid');
let logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
let jwt = require('restify-jwt');

console.log('Host : ' + JSON.stringify(config));
/*
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



server.post('/DVP/API/:version/EventTrigger/Zapier/Call/Subscribe', authorization({resource:"sysmonitoring", action:"write"}), function(req, res, next)
{
    try
    {
        logger.debug('[DVP-EventTriggerService.ZapierCallSubscribe] - METHOD CALL - Body : %s', JSON.stringify(req.body));
        let subId = nodeUuid.v1();
        let companyId = req.user.company;
        let tenantId = req.user.tenant;
        let hashName = 'Zapier:' + tenantId + ':' + companyId + ':CALL';

        redisHandler.AddToHash(hashName, subId, req.body.hookUrl, function(err, result){
            if(err){
                logger.error('[DVP-EventTriggerService.ZapierCallSubscribe] - ERROR : ', err);
                res.end('{}');
            }else{
                let respToZapier = {id: subId, url: req.body.hookUrl};

                let apiResp = JSON.stringify(respToZapier);

                logger.info('[DVP-EventTriggerService.ZapierCallSubscribe] - API RESPONSE : %s', apiResp);

                res.end(apiResp);
            }
        });

    }
    catch(ex)
    {
        logger.error('[DVP-MonitorRestAPI.GetConferenceUsers] - ERROR : ', ex);
        res.end('{}');
    }

    return next();
});

server.del('/DVP/API/:version/EventTrigger/Zapier/Call/UnSubscribe/:id', authorization({resource:"sysmonitoring", action:"write"}), function(req, res, next)
{
    try
    {
        let subId = req.params.id;
        logger.debug('[DVP-EventTriggerService.ZapierCallUnSubscribe] - METHOD CALL - id : %s', subId);

        let companyId = req.user.company;
        let tenantId = req.user.tenant;
        let hashName = 'Zapier:' + tenantId + ':' + companyId + ':CALL';

        redisHandler.RemoveItemFromHash(hashName, subId, function(err, result){
            if(err){
                logger.error('[DVP-EventTriggerService.ZapierCallUnSubscribe] - ERROR : ', err);
                res.end('{}');
            }else{
                let respToZapier = {subscribeData: subId};

                let apiResp = JSON.stringify(respToZapier);

                logger.info('[DVP-EventTriggerService.ZapierCallUnSubscribe] - API RESPONSE : %s', apiResp);

                res.end(apiResp);
            }
        });

    }
    catch(ex)
    {
        logger.error('[DVP-MonitorRestAPI.GetConferenceUsers] - ERROR : ', ex);
        res.end('{}');
    }

    return next();
});

server.post('/DVP/API/:version/EventTrigger/Zapier/Call/PerformList', authorization({resource:"sysmonitoring", action:"write"}), function(req, res, next)
{
    try
    {
        logger.debug('[DVP-EventTriggerService.ZapierCallPerformList] - METHOD CALL');
        let plTestData = [{EventType: 'CREATE', SessionId: '123', Direction: 'inbound', From: 'FromNumber', To: 'ToNumber'}];

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
});*/
