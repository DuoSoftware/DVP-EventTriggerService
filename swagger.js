var swaggerJsdoc = require("swagger-jsdoc");
var config = require("config");
var path = require("path");
var fs = require("fs");

var port = config.Host.Port || 3645;
var host = config.Host.Ip || "localhost";

var swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "DVP-EventTriggerService API",
    version: "1.0.0",
    description: "3rd party event integration service",
    contact: {
      name: "Facetone Dev Team",
    },
  },
  servers: [
    {
      url: "http://" + host + ":" + port,
      description: "Local development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          IsSuccess: { type: "boolean", example: false },
          Message: { type: "string", example: "Error message" },
          Exception: { type: "string" },
          Result: {},
        },
      },
      SuccessResponse: {
        type: "object",
        properties: {
          IsSuccess: { type: "boolean", example: true },
          Message: { type: "string", example: "Operation successful" },
          Result: {},
        },
      },
      SubscribeRequest: {
        type: "object",
        required: ["eventType", "hookUrl"],
        properties: {
          eventType: {
            type: "string",
            enum: ["CALL", "AGENT", "TICKET"],
            example: "CALL",
          },
          hookUrl: {
            type: "string",
            example: "https://hooks.zapier.com/hooks/catch/123/abc/",
          },
        },
      },
      SubscribeResponse: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "550e8400-e29b-41d4-a716-446655440000",
          },
          url: {
            type: "string",
            example: "https://hooks.zapier.com/hooks/catch/123/abc/",
          },
        },
      },
    },
  },
};

var options = {
  swaggerDefinition: swaggerDefinition,
  apis: ["./swagger-docs.yaml"],
};

var swaggerSpec = swaggerJsdoc(options);

var mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json",
};

function setupSwagger(server) {
  var swaggerUiPath = path.dirname(
    require.resolve("swagger-ui-dist/index.html"),
  );

  server.get("/api-docs.json", function (req, res, next) {
    res.setHeader("Content-Type", "application/json");
    res.send(200, swaggerSpec);
    next();
  });

  server.get("/api-docs", function (req, res, next) {
    res.writeHead(302, { Location: "/api-docs/index.html" });
    res.end();
    next(false);
  });

  server.get("/api-docs/swagger-initializer.js", function (req, res, next) {
    var body = [
      "window.onload = function() {",
      "  window.ui = SwaggerUIBundle({",
      "    url: '/api-docs.json',",
      "    dom_id: '#swagger-ui',",
      "    deepLinking: true,",
      "    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],",
      "    plugins: [SwaggerUIBundle.plugins.DownloadUrl],",
      "    layout: 'StandaloneLayout'",
      "  });",
      "};",
    ].join("\n");
    res.writeHead(200, {
      "Content-Type": "application/javascript",
      "Content-Length": Buffer.byteLength(body),
    });
    res.end(body);
    next(false);
  });

  server.get(/^\/api-docs\/(.*)$/, function (req, res, next) {
    var requestedFile = req.params[0] || "index.html";
    var filePath = path.join(swaggerUiPath, requestedFile);

    if (!filePath.startsWith(swaggerUiPath)) {
      res.send(403, { error: "Forbidden" });
      return next(false);
    }

    fs.readFile(filePath, function (err, data) {
      if (err) {
        res.send(404, { error: "File not found" });
        return next(false);
      }
      var ext = path.extname(filePath).toLowerCase();
      var contentType = mimeTypes[ext] || "application/octet-stream";
      res.writeHead(200, {
        "Content-Type": contentType,
        "Content-Length": data.length,
      });
      res.end(data);
      next(false);
    });
  });
}

module.exports = {
  swaggerSpec: swaggerSpec,
  setupSwagger: setupSwagger,
};
