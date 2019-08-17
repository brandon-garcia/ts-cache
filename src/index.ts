import {ClientOpts, RedisClient} from "redis";
import {promisify} from "util";

export type RedisConfig = ClientOpts;

type AsyncFn<T, R> = (param: T) => Promise<R>;

export interface ICache {
  readonly delete: (id: string) => Promise<boolean>;
  readonly get: (id: string) => Promise<string>;
  readonly has: (id: string) => Promise<boolean>;
  readonly set: (id: string, value: string, ttl?: number) => Promise<boolean>;
}

export const connectRedis = (config: RedisConfig): ICache => {
  const client: RedisClient = new RedisClient(config);

  const redisGet: AsyncFn<string, string> =
    promisify(client.get).bind(client);

  const redisDelete: AsyncFn<string, number> =
    promisify(client.del).bind(client);

  const redisExists: AsyncFn<string, number> =
    promisify(client.exists).bind(client);

  const redisSetEx: (id: string, ttl: number, value: string) => Promise<string> =
    promisify(client.setex).bind(client);

  const redisSet: (id: string, value: string) => Promise<string> =
    promisify(client.set).bind(client) as (id: string, value: string) => Promise<string>;

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
  };
};

