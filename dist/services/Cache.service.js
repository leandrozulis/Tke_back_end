import { Redis } from 'ioredis';
class CacheService {
    constructor() {
        this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    }
    async get(key) {
        const value = await this.redis.get(key);
        return value ? JSON.parse(value) : null;
    }
    async set(key, value, ttl = 60 * 5) {
        await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
    }
    async invalidate(prefix) {
        const keys = await this.redis.keys(`${prefix}:*`);
        if (keys.length > 0) {
            await this.redis.del(keys);
        }
    }
}
export default new CacheService();
