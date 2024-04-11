export default () => {
  return {
    port: 8080,
    mysql: {
      host: '192.168.3.13',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'lm_meta_sever',
    },
    redis: {
      host: '192.168.3.13',
      port: 6379,
    },
    dingding: {
      agentId: 1327331556,
      appKey: 'dingliydht8dffignulx',
      appSecret:
        'awXxIgr6qYLyPBtThONBwVLTBt3AyPzqR0YF2_m23YCOrv6rX2qey_NQmh5a6xGo',
      aesKey: 'lU5xAo9IgUqUTtsSWAgnq6UycCHyCeyxSN2587dctpA',
      aesToken: 's3XMXtc6KYxPO2uQTYcwTAGt0CYJ17qYN3BMPndXjX8irJIHVr1GZU9xc',
      approveCode: 'PROC-4B0510AB-C012-4517-9D00-91DC0CAD40AF',
    },
  };
};
