import * as rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: {
    message: 'Too many requests. Calm down.',
  },
});
