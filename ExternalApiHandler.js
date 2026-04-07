let axios = require("axios");
let logger = require("dvp-common/LogHandler/CommonLogHandler.js").logger;

let CallExternalAPI = function (applicationUrl, payload, callback) {
  try {
    logger.debug(
      "[DVP-EventTriggerService.CallExternalAPI] - [%s] -  Creating Post Message",
    );

    axios
      .post(applicationUrl, payload, {
        headers: { "content-type": "application/json" },
      })
      .then(function (response) {
        callback(null, applicationUrl);
      })
      .catch(function (error) {
        logger.error(
          "[DVP-EventTriggerService.CallExternalAPI] - [%s] -  Error calling api : %s",
          applicationUrl,
        );
        callback(error, null);
      });
  } catch (ex) {
    logger.error(
      "[DVP-EventMonitor.IncrementMaxChanLimit] - [%s] - Exception occurred",
      ex,
    );
    callback(ex, null);
  }
};

module.exports.CallExternalAPI = CallExternalAPI;
