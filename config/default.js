module.exports = {

  Redis: {
    mode: "instance", //instance, cluster, sentinel
    ip: "",
    port: 6389,
    password: "",
    sentinels: {
      hosts: "",
      port: 16389,
      name: "redis-cluster",
    },
  },

  Security: {
    ip: "",
    port: 6389,
    password: "",
    mode: "instance", //instance, cluster, sentinel
    sentinels: {
      hosts: "",
      port: 16389,
      name: "redis-cluster",
    },
  },

  Host: {
    Ip: "0.0.0.0",
    Port: "3645",
    Version: "1.0.0.0",
  },
};
