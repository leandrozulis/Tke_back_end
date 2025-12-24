"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// dist/services/Cache.service.js
var Cache_service_exports = {};
__export(Cache_service_exports, {
  default: () => Cache_service_default
});
module.exports = __toCommonJS(Cache_service_exports);
var import_ioredis = require("ioredis");
var CacheService = class {
  constructor() {
    this.redis = new import_ioredis.Redis(process.env.REDIS_URL || "redis://localhost:6379");
  }
  async get(key) {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }
  async set(key, value, ttl = 60 * 5) {
    await this.redis.set(key, JSON.stringify(value), "EX", ttl);
  }
  async invalidate(prefix) {
    const keys = await this.redis.keys(`${prefix}:*`);
    if (keys.length > 0) {
      await this.redis.del(keys);
    }
  }
};
var Cache_service_default = new CacheService();
