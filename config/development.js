module.exports = {
  DB: {
    Type: "postgres",
    User: "duo",
    Password: "DuoS123",
    Port: 5432,
    Host: "192.168.4.182",
    Database: "facetone",
  },

  Redis: {
    mode: "instance", //instance, cluster, sentinel
    ip: "192.168.4.182",
    port: 6379,
    user: "duo",
    password: "DuoS123",
    sentinels: {
      hosts: "138.197.90.92,45.55.205.92,138.197.90.92",
      port: 16389,
      name: "redis-cluster",
    },
  },

  Security: {
    ip: "192.168.4.182",
    port: 6379,
    user: "duo",
    password: "DuoS123",
    mode: "instance", //instance, cluster, sentinel
    sentinels: {
      hosts: "138.197.90.92,45.55.205.92,138.197.90.92",
      port: 16389,
      name: "redis-cluster",
    },
  },

  Host: {
    profilesearch: "secondaryonly",
    resource: "cluster",
    vdomain: "localhost",
    domain: "localhost",
    port: "3645",
    version: "1.0.0.0",
  },

  LBServer: {
    ip: "localhost",
    port: "3645",
  },

  Mongo: {
    ip: "192.168.4.182",
    port: "",
    dbname: "facetone",
    password: "DuoS123",
    user: "duo",
    type: "mongodb",
  },

  //mongodb+srv://facetone:Hds7236YD@facetone-prod.2xyao.mongodb.net/dvpdb
  //mongodb+srv://facetone:Hds7236YD@facetone-prod.2xyao.mongodb.net/test?authSource=admin&replicaSet=atlas-unwxnp-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true

  RabbitMQ: {
    ip: "192.168.4.182",
    port: 5672,
    user: "duo",
    password: "DuoS123",
    vhost: "/",
  },

  Services: {
    accessToken:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQdWJiYVMiLCJqdGkiOiI5NDM3N2RmMC00ZGRhLTExZjEtYWUzNC0xNWQ0OTZmNGY5MGQiLCJzdWIiOiJBY2Nlc3MgY2xpZW50IiwiZXhwIjoxODEwMTA5NjYxLCJ0ZW5hbnQiOjEsImNvbXBhbnkiOjEyLCJjb250ZXh0Ijp7fSwiY29tcGFueU5hbWUiOiJmdGRldiIsInNjb3BlIjpbeyJyZXNvdXJjZSI6ImNkciIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJldmVudHRyaWdnZXIiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoiYWxsIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX1dLCJpYXQiOjE3Nzg1NzM2NjF9.XcFckVuF7CG-jdGBTeeVQVZgyKZbHwBaPvJprIpN6Yw",
    resourceServiceHost: "resourceservice.104.131.67.21.xip.io",
    resourceServicePort: "8831",
    resourceServiceVersion: "1.0.0.0",
    sipuserendpointserviceHost: "sipuserendpointservice.104.131.67.21.xip.io",
    sipuserendpointservicePort: "8831",
    sipuserendpointserviceVersion: "1.0.0.0",
    clusterconfigserviceHost: "clusterconfig.104.131.67.21.xip.io",
    clusterconfigservicePort: "8831",
    clusterconfigserviceVersion: "1.0.0.0",
  },
};
