import githubService from './githubService.js';
import analyticsEngine from './analyticsEngine.js';
import insightService from './insightService.js';
import cacheService from './cacheService.js';
import logger from '../utils/logger.js';

/**
 * analysisService orchestrates the full flow for a username:
 *   cache -> GitHub fetch -> analytics -> AI insights -> persist.
 * Controllers call only this; they never touch GitHub, analytics, or the DB.
 */

/**
 * Shape the persisted/cached records into the API response contract.
 */
function toResponse({ profile, repositories, analysis }, cached) {
  return {
    cached,
    profile: {
      githubId: profile.githubId,
      username: profile.username,
      name: profile.name,
      avatar: profile.avatar,
      bio: profile.bio,
      company: profile.company,
      location: profile.location,
      blog: profile.blog,
      followers: profile.followers,
      following: profile.following,
      publicRepos: profile.publicRepos,
      githubCreatedAt: profile.githubCreatedAt,
    },
    repositories: repositories.map((r) => ({
      githubId: r.githubId,
      name: r.name,
      description: r.description,
      url: r.url,
      stars: r.stars,
      forks: r.forks,
      language: r.language,
      topics: r.topics,
      isFork: r.isFork,
      createdAt: r.githubCreatedAt,
      updatedAt: r.githubUpdatedAt,
      pushedAt: r.githubPushedAt,
    })),
    analytics: {
      score: analysis.score,
      metrics: analysis.metrics,
      languageStats: analysis.languageStats,
      insights: analysis.insights,
      generatedAt: analysis.generatedAt,
    },
  };
}

/**
 * Run (or reuse) an analysis for a GitHub username.
 * @param {string} username
 * @param {boolean} refresh - when true, bypass the cache and re-fetch.
 */
export async function runAnalysis(username, refresh = false) {
  if (!refresh) {
    const cached = await cacheService.getCachedAnalysis(username);
    if (cached) {
      logger.info(`Cache hit for "${username}".`);
      return toResponse(cached, true);
    }
  }

  logger.info(`Fetching fresh data for "${username}".`);

  // Fetch profile first (fails fast with 404 for unknown users).
  const profile = await githubService.fetchProfile(username);

  const [repos, languageBreakdown] = await Promise.all([
    githubService.fetchRepositories(username),
    githubService.fetchLanguageBreakdown(username),
  ]);

  const analysis = analyticsEngine.analyze({ profile, repos, languageBreakdown });
  const insights = await insightService.generateInsights(profile, analysis);

  await cacheService.saveAnalysis({ profile, repos, analysis, insights });

  return toResponse(
    {
      profile,
      repositories: repos.map((r) => ({
        ...r,
        githubCreatedAt: r.githubCreatedAt,
        githubUpdatedAt: r.githubUpdatedAt,
        githubPushedAt: r.githubPushedAt,
      })),
      analysis: { ...analysis, insights, generatedAt: new Date() },
    },
    false,
  );
}

export default { runAnalysis };
