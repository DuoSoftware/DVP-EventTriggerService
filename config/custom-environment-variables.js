module.exports = {
  Host: {
    Port: "HOST_EVENTTRIGGERSERVICE_PORT",
    Version: "HOST_VERSION"
  },
  Redis: {
    mode: "SYS_REDIS_MODE",
    ip: "SYS_REDIS_HOST",
    port: "SYS_REDIS_PORT",
    password: "SYS_REDIS_PASSWORD",
    sentinels: {
      hosts: "SYS_REDIS_SENTINEL_HOSTS",
      port: "SYS_REDIS_SENTINEL_PORT",
      name: "SYS_REDIS_SENTINEL_NAME"
    }
  },
  Security: {
    ip: "SYS_REDIS_HOST",
    port: "SYS_REDIS_PORT",
    password: "SYS_REDIS_PASSWORD",
    mode: "SYS_REDIS_MODE",
    sentinels: {
      hosts: "SYS_REDIS_SENTINEL_HOSTS",
      port: "SYS_REDIS_SENTINEL_PORT",
      name: "SYS_REDIS_SENTINEL_NAME"
    }
  }
};
