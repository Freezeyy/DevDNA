import rateLimit from 'express-rate-limit';

/**
 * Protects the analyze endpoint (and by extension the GitHub API quota)
 * from abuse. Tune limits per environment as needed.
 */
export const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many requests, please try again later.' } },
});
