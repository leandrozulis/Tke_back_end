import { Redis} from 'ioredis';
class CacheService {
  private redis: any;
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }
  async get(key: string) {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }
  async set(key: string, value: any, ttl = 60 * 5) { // 5 minutos por padrão
    await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
  }
  async invalidate(prefix: string) {
    const keys = await this.redis.keys(`${prefix}:*`);
    if (keys.length > 0) {
      await this.redis.del(keys);
    }
  }
}
export default new CacheService();