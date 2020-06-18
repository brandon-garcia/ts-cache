import { ClientOpts } from "redis";
export declare type RedisConfig = ClientOpts;
export interface ICache {
    readonly delete: (key: string) => Promise<boolean>;
    readonly deleteAll: () => Promise<boolean>;
    readonly get: (key: string) => Promise<string | undefined>;
    readonly has: (key: string) => Promise<boolean>;
    readonly set: (key: string, value: string, timeToLive?: number) => Promise<boolean>;
}
export declare const connectRedis: (config: ClientOpts) => ICache;
