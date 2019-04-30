let redis = require("ioredis");
let config = require('config');
let logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;

let redisip = config.Redis.ip;
let redisport = config.Redis.port;
let redispass = config.Redis.password;
let redismode = config.Redis.mode;
let redisdb = config.Redis.db;



let redisSetting =  {
    port:redisport,
    host:redisip,
    family: 4,
    password: redispass,
    db: 0,
    retryStrategy: function (times) {
        let delay = Math.min(times * 50, 2000);
        return delay;
    },
    reconnectOnError: function (err) {

        return true;
    }
};

if(redismode === 'sentinel'){

    if(config.Redis.sentinels && config.Redis.sentinels.hosts && config.Redis.sentinels.port && config.Redis.sentinels.name){
        let sentinelHosts = config.Redis.sentinels.hosts.split(',');
        if(Array.isArray(sentinelHosts) && sentinelHosts.length > 2){
            let sentinelConnections = [];

            sentinelHosts.forEach(function(item){

                sentinelConnections.push({host: item, port:config.Redis.sentinels.port})

            });

            redisSetting = {
                sentinels:sentinelConnections,
                name: config.Redis.sentinels.name,
                password: redispass
            }

        }else{

            console.log("No enough sentinel servers found .........");
        }

    }
}

let client = undefined;

if(redismode !== "cluster") {
    client = new redis(redisSetting);
}else{

    let redisHosts = redisip.split(",");
    if(Array.isArray(redisHosts)){


        redisSetting = [];
        redisHosts.forEach(function(item){
            redisSetting.push({
                host: item,
                port: redisport,
                family: 4,
                password: redispass});
        });

        let client = new redis.Cluster([redisSetting]);

    }else{

        client = new redis(redisSetting);
    }


}


let SetObject = function(reqId, key, value, callback)
{
    try
    {
        logger.debug('[DVP-MonitorRestAPI.SetObject] - [%s] - Method Params - key : %s, value : %s', reqId, key, value);
        //let client = redis.createClient(redisPort, redisIp);

        client.set(key, value, function(err, response)
        {
            if(err)
            {
                logger.error('[DVP-MonitorRestAPI.SetObject] - [%s] - REDIS SET failed', reqId, err);
            }
            else
            {
                logger.debug('[DVP-MonitorRestAPI.SetObject] - [%s] - REDIS SET success', reqId);
            }
            callback(err, response);
        });

    }
    catch(ex)
    {
        logger.error('[DVP-MonitorRestAPI.SetObject] - [%s] - Exception occurred', reqId, ex);
        callback(ex, undefined);
    }

};

let GetObject = function(reqId, key, callback)
{
    try
    {
        logger.debug('[DVP-MonitorRestAPI.GetObject] - [%s] - Method Params - key : %s', reqId, key);
        //let client = redis.createClient(redisPort, redisIp);

        client.get(key, function(err, response)
        {
            if(err)
            {
                logger.error('[DVP-MonitorRestAPI.GetObject] - [%s] - REDIS SET failed', reqId, err);
            }
            else
            {
                logger.debug('[DVP-MonitorRestAPI.GetObject] - [%s] - REDIS SET success', reqId);
            }
            callback(err, response);
        });

    }
    catch(ex)
    {
        logger.error('[DVP-MonitorRestAPI.GetObject] - [%s] - Exception occurred', reqId, ex);
        callback(ex, undefined);
    }
};

let PublishToRedis = function(reqId, pattern, message, callback)
{
    try
    {
       logger.debug('[DVP-MonitorRestAPI.PublishToRedis] - [%s] - Method Params - pattern : %s, message : %s', reqId, pattern, message);
       let result = client.publish(pattern, message);
       logger.debug('[DVP-MonitorRestAPI.PublishToRedis] - [%s] - REDIS PUBLISH result : %s', reqId, result);
        callback(undefined, true);

    }
    catch(ex)
    {
        logger.error('[DVP-MonitorRestAPI.PublishToRedis] - [%s] - Exception occurred', reqId, ex);
        callback(ex, false);
    }
};

let GetFromSet = function(reqId, setName, callback)
{
    try
    {
        logger.debug('[DVP-MonitorRestAPI.GetFromSet] - [%s] - Method Params - setName : %s,', reqId, setName);
        client.smembers(setName, function (err, setValues)
            {
                if(err)
                {
                    logger.error('[DVP-MonitorRestAPI.GetFromSet] - [%s] - REDIS SMEMBERS failed', reqId, err);
                }
                else
                {
                    logger.debug('[DVP-MonitorRestAPI.GetFromSet] - [%s] - REDIS SMEMBERS success', reqId);
                }
                callback(err, setValues);
            });


    }
    catch(ex)
    {
        logger.error('[DVP-MonitorRestAPI.GetFromSet] - [%s] - Exception occurred', reqId, ex);
        callback(ex, undefined);
    }
};

let GetFromHash = function(reqId, hashName, callback)
{
    try
    {
        logger.debug('[DVP-MonitorRestAPI.GetFromHash] - [%s] - Method Params - hashName : %s,', reqId, hashName);
        client.hgetall(hashName, function (err, hashObj)
            {
                if(err)
                {
                    logger.error('[DVP-MonitorRestAPI.GetFromHash] - [%s] - REDIS HGETALL failed', reqId, err);
                }
                else
                {
                    logger.debug('[DVP-MonitorRestAPI.GetFromHash] - [%s] - REDIS HGETALL success', reqId);
                }
                callback(err, hashObj);
            });
    }
    catch(ex)
    {
        logger.error('[DVP-MonitorRestAPI.GetFromHash] - [%s] - Exception occurred', reqId, ex);
        callback(ex, undefined);
    }
};

let AddToHash = function(hashName, key, value, callback)
{
    try
    {
        logger.debug('[DVP-EventTriggerService.AddToHash] - [%s] - Method Params - hashName : %s, key : %s, value : %s', hashName, key, value);
        client.hset(hashName, key, value, function (err, hashObj)
        {
            callback(err, hashObj);
        });
    }
    catch(ex)
    {
        callback(ex, null);
    }
};

let RemoveItemFromHash = function(hashName, key, callback)
{
    try
    {
        logger.debug('[DVP-EventTriggerService.RemoveItemFromHash] - [%s] - Method Params - hashName : %s, key : %s', hashName, key);
        client.hset(hashName, key, value, function (err, hashObj)
        {
            callback(err, hashObj);
        });
    }
    catch(ex)
    {
        callback(ex, null);
    }
};

let MultipleHashHGetAll = function(reqId, hashKeys, callback)
{
    try
    {
        logger.debug('[DVP-MonitorRestAPI.MultipleHashHGetAll] - [%s],', reqId);
        let pipeline = client.pipeline();

        hashKeys.forEach(function(key, index){
            pipeline.hgetall(key);
        });

        pipeline.exec(function(err, result){
            callback(err, result);
        });
    }
    catch(ex)
    {
        logger.error('[DVP-MonitorRestAPI.MultipleHashHGetAll] - [%s] - Exception occurred', reqId, ex);
        callback(ex, undefined);
    }
};



let MGetObjects = function(reqId, keyArr, callback)
{
    try
    {
        logger.debug('[DVP-MonitorRestAPI.HMGetObjects] - [%s]', reqId);
        //let client = redis.createClient(redisPort, redisIp);

        client.mget(keyArr, function(err, response)
        {
            if(err)
            {
                logger.error('[DVP-MonitorRestAPI.HMGetObjects] - [%s] - REDIS MGET failed', reqId, err);
            }
            else
            {
                logger.debug('[DVP-MonitorRestAPI.HMGetObjects] - [%s] - REDIS MGET success', reqId);
            }

            callback(err, response);
        });

    }
    catch(ex)
    {
        logger.error('[DVP-MonitorRestAPI.HMGetObjects] - [%s] - Exception occurred', reqId, ex);
        callback(ex, undefined);
    }
};

let GetKeys = function(reqId, pattern, callback)
{
    logger.debug('[DVP-MonitorRestAPI.GetKeys] - [%s] - Method Params - pattern : %s,', reqId, pattern);
    client.keys(pattern, function (err, keyArr)
        {
            if(err)
            {
                logger.error('[DVP-MonitorRestAPI.GetKeys] - [%s] - REDIS MATCHKEYS failed', reqId, err);
            }
            else
            {
                logger.debug('[DVP-MonitorRestAPI.GetKeys] - [%s] - REDIS MATCHKEYS success', reqId);
            }
            callback(err, keyArr);
        });
};

client.on('error', function(msg)
{

});

module.exports.SetObject = SetObject;
module.exports.PublishToRedis = PublishToRedis;
module.exports.GetFromSet = GetFromSet;
module.exports.GetFromHash = GetFromHash;
module.exports.AddToHash = AddToHash;
module.exports.RemoveItemFromHash = RemoveItemFromHash;
module.exports.GetObject = GetObject;
module.exports.GetKeys = GetKeys;
module.exports.MGetObjects = MGetObjects;
module.exports.MultipleHashHGetAll = MultipleHashHGetAll;