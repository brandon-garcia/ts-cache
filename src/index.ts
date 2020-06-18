import {ClientOpts, RedisClient} from "redis";
import {promisify} from "util";

export type RedisConfig = ClientOpts;

type AsyncFn<T, R> = (param: T) => Promise<R>;

export interface ICache {
  readonly delete: (key: string) => Promise<boolean>;
  readonly deleteAll: () => Promise<boolean>;
  readonly get: (key: string) => Promise<string|undefined>;
  readonly has: (key: string) => Promise<boolean>;
  readonly set: (key: string, value: string, timeToLive?: number) => Promise<boolean>;
}

export const connectRedis = (config: RedisConfig): ICache => {
  const client: RedisClient = new RedisClient(config);

  const redisGet: AsyncFn<string, string> =
    promisify(client.get).bind(client);

  const redisDelete: AsyncFn<string, number> =
    promisify(client.del).bind(client);

  const redisExists: AsyncFn<string, number> =
    promisify(client.exists).bind(client);

  const redisSetEx: (key: string, timeToLive: number, value: string) => Promise<string> =
    promisify(client.setex).bind(client);

  const redisSet: (key: string, value: string) => Promise<string> =
    promisify(client.set).bind(client) as (key: string, value: string) => Promise<string>;

  const redisFlushDB: () => Promise<string> =
    promisify(client.flushdb).bind(client) as () => Promise<string>;

  return {
    delete: async (id: string) => 1 === (await redisDelete(id)),

    get: redisGet,

    set: async (id: string, value: string, ttl?: number) => {
      if (ttl == null) {
        return "OK" === await redisSet(id, value);
      }
      return "OK" === await redisSetEx(id, ttl, value);
    },

    has: async (id: string) => 1 === (await redisExists(id)),

    deleteAll: async () => "OK" === (await redisFlushDB()),
  };
};

