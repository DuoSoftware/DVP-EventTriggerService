# Environment variables

Every environment variable DVP-EventTriggerService reads, with the values it accepts.

- The service maps config keys to these names in `config/custom-environment-variables.js`. The defaults are in `config/default.js`.
- **Default** is what the service uses when the variable is not set. Real hosts, URLs and secrets are never written here: `(environment-specific)` and `<secret>` stand in for them.
- **Required** is "yes" when the service has no usable default, and for every host, URL and secret.
- Names follow the Facetone naming standard. Whenever a variable is added, renamed or removed, or its meaning, values or default change, update this file in the same change. See `.claude/rules/environment-variables.md`.

## Service variables

Settings only this service reads (`HOST_EVENTTRIGGERSERVICE_*`).

| Variable | Description | Type | Possible values | Default | Required | Secret |
| --- | --- | --- | --- | --- | --- | --- |
| `HOST_EVENTTRIGGERSERVICE_PORT` | Port DVP-EventTriggerService listens on. | port | 1–65535 | 3645 | no | no |

## Shared variables

Infrastructure, other services' addresses and platform settings. Other services read them under the same names.

| Variable | Description | Type | Possible values | Default | Required | Secret |
| --- | --- | --- | --- | --- | --- | --- |
| `HOST_VERSION` | API version segment of this service's own routes (/DVP/API/\<version>/...). | version | version string, e.g. 1.0.0.0 | 1.0.0.0 | no | no |
| `SYS_REDIS_HOST` | Main Redis host. Also used for token checks (Security block). | host | host name or IP; comma-separated list in cluster mode | — | yes | no |
| `SYS_REDIS_MODE` | How to connect to the main Redis. | enum | instance \| cluster \| sentinel | instance | no | no |
| `SYS_REDIS_PASSWORD` | Main Redis password. | string | password | — | yes | yes |
| `SYS_REDIS_PORT` | Main Redis port. | port | 1–65535 | 6389 | no | no |
| `SYS_REDIS_SENTINEL_HOSTS` | Sentinel hosts, when SYS_REDIS_MODE is sentinel. | list | comma-separated host names | — | no | no |
| `SYS_REDIS_SENTINEL_NAME` | Sentinel master name, when SYS_REDIS_MODE is sentinel. | string | sentinel master name | redis-cluster | no | no |
| `SYS_REDIS_SENTINEL_PORT` | Sentinel port, when SYS_REDIS_MODE is sentinel. | port | 1–65535 | 16389 | no | no |

## Reserved variables

Read straight from the environment by the logger, node-config or the service code. These names never change.

| Variable | Description | Type | Possible values | Default | Required | Secret |
| --- | --- | --- | --- | --- | --- | --- |
| `DEPLOYMENT_ENV` | docker turns off the log file, so the logger writes to the console only. | string | docker, or unset | unset: console and file | no | no |
| `HOST_NAME` | Name of the running instance. The logger sends it to Logstash as the app name. | string | host name | — | no | no |
| `LOG_LEVEL` | Lowest level the logger writes. | enum | error \| warn \| info \| verbose \| debug \| silly | debug | no | no |
| `LOG_PATH` | Folder for logger.log. Not used when DEPLOYMENT_ENV is docker. | path | folder path, e.g. /var/log/facetone | unset: logger.log in the working folder | no | no |
| `NODE_CONFIG_DIR` | Folder node-config reads its files from. | path | path to the config folder | ./config | no | no |
| `NODE_ENV` | node-config loads config/\<NODE_ENV>.js over config/default.js. Environment variables override both. | string | name of a file in config/, e.g. production | development | no | no |
| `SYS_LOG_HOST` | Logstash host that receives the logs over UDP. Logs are sent only when SYS_LOG_HOST and SYS_LOG_PORT are both set. | host | host name or IP, e.g. logstash.internal | unset: not sent | no | no |
| `SYS_LOG_PORT` | Logstash UDP port. Used with SYS_LOG_HOST. | port | 1–65535 | unset: not sent | no | no |
