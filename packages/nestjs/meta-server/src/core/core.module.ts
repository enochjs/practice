import { Module, Global } from '@nestjs/common';
import { RobotService } from '@/core/robot';
import { ConfigModule, ConfigType } from '@nestjs/config';
import configuration from 'config/configuration';
import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { snakeCase } from 'lodash';
import { redisStore } from 'cache-manager-redis-store';
import { LoggerModule } from 'nestjs-pino';
import { RedisModule } from '@nestjs-modules/ioredis';
import pino from 'pino';
import { randomUUID } from 'crypto';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { DdService } from './dd/dd.service';

// config module
const configModule = ConfigModule.forRoot({
  load: [configuration],
  isGlobal: true,
});

// mysql
class CustomNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    return snakeCase(
      embeddedPrefixes.concat(customName ? customName : propertyName).join('_'),
    );
  }
}

const typeOrmModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  async useFactory(configService: ConfigType<typeof configuration>) {
    const mysql = configService.mysql;
    const env = configService.env;
    return {
      type: 'mysql',
      ...mysql,
      keepConnectionAlive: true,
      // 只有本地环境同步entity的schema到数据库
      synchronize: env === 'LOCAL' || false,
      autoLoadEntities: true,
      retryAttempts: 2,
      retryDelay: 1000,
      namingStrategy: new CustomNamingStrategy(),
      charset: 'utf8mb4_general_ci',
      // logging: true,
    };
  },
  inject: [configuration.KEY],
});

const loggerModuleInst = LoggerModule.forRootAsync({
  useFactory(config: ConfigType<typeof configuration>) {
    return {
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: config.env === 'LOCAL',
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
          },
        },
        autoLogging: false,
        genReqId: (req, res) => {
          const existingID = req.id ?? req.headers['x-request-id'];
          if (existingID) return existingID;
          const id = randomUUID();
          res.setHeader('x-request-id', id);
          return id;
        },
        stream: pino.destination({
          dest: 'stdout',
          sync: false, // Asynchronous logging
        }),
      },
    };
  },
  inject: [configuration.KEY],
});

const ioRedisModule = RedisModule.forRootAsync({
  imports: [ConfigModule],
  inject: [configuration.KEY],
  useFactory: (configService: ConfigType<typeof configuration>) => {
    const redisConfig = configService.redis;
    console.log('redisConfig', redisConfig);
    return {
      ...redisConfig,
      type: 'single',
      keyPrefix: 'lm:meta:server:ioredis',
    };
  },
});

const bullModuleInst = BullModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigType<typeof configuration>) => {
    const redisConfig = configService.redis;
    const env = configService.env.toLowerCase();
    return {
      redis: {
        store: redisStore,
        keyPrefix: env,
        ...redisConfig,
      },
    };
  },
  inject: [configuration.KEY],
});

const cacheModule = CacheModule.registerAsync({
  imports: [ConfigModule],
  inject: [configuration.KEY],
  async useFactory(configService: ConfigType<typeof configuration>) {
    const redisConfig = configService.redis;
    return {
      ttl: configService.CACHE_TTL,
      store: redisStore,
      ...redisConfig,
    };
  },
});

@Global()
@Module({
  imports: [
    configModule,
    loggerModuleInst,
    typeOrmModule,
    ioRedisModule,
    cacheModule,
    bullModuleInst,
  ],
  providers: [RobotService, DdService],
  exports: [
    configModule,
    RobotService,
    DdService,
    typeOrmModule,
    ioRedisModule,
    cacheModule,
    bullModuleInst,
  ],
})
export class CoreModule {}
