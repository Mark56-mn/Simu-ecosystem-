import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://placeholder.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'placeholder',
});

export const getRateLimiter = (limit: number) => {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, '1 h'),
    analytics: true,
  });
};
