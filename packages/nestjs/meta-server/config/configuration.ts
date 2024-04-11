import defaultConfig from './config.default';
import local from './config.local';
import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  const env = (process.env.NODE_ENV || 'local').toUpperCase();
  const config = defaultConfig();
  config.env = env;

  switch (env) {
    case 'LOCAL':
      return Object.assign(config, local());
    default:
      return Object.assign(config, local());
  }
});
