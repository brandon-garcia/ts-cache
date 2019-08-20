import { ClientOpts } from "redis";
export declare type RedisConfig = ClientOpts;
export interface ICache {
    readonly delete: (id: string) => Promise<boolean>;
    readonly get: (id: string) => Promise<string>;
    readonly has: (id: string) => Promise<boolean>;
    readonly set: (id: string, value: string, ttl?: number) => Promise<boolean>;
}
export declare const connectRedis: (config: ClientOpts) => ICache;
