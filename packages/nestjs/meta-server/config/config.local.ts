export default () => {
  return {
    port: 8080,
    mysql: {
      host: '10.10.0.253',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'lm_meta_sever',
    },
    redis: {
      host: '10.10.0.253',
      port: 6379,
    },
    dd: {
      agentId: 3076820753,
      appKey: 'dingcdcpdo8d61khrq1b',
      appSecret:
        '5GJcZ-jyS0jqxzp97n1kEtUKA1GuM7wrZlOMKHmkoOx2RXDjFaT83-0x05o3jOrN',
      aesKey: 'bK8w6WtfjboOyB8dd0HNoVR6RbHpASDyLndxDiMtUfy',
      aesToken: '3artlLblIqxzJvSIzjjx11nM2e5tFYXOjBIr',
      approveCode: 'PROC-4B0510AB-C012-4517-9D00-91DC0CAD40AF',
    },
    git: {
      webHookToken: 'GR1348941WcXx_424ywTyMSrQy9jU',
    },
  };
};
