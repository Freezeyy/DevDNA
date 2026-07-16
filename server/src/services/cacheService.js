import { UserProfile, Repository, Analysis } from '../models/index.js';
import env from '../config/env.js';

/**
 * cacheService encapsulates all persistence + freshness logic.
 * The most recent Analysis row for a user acts as the cache entry.
 */

function isFresh(generatedAt) {
  const ttlMs = env.cache.ttlMinutes * 60 * 1000;
  return Date.now() - new Date(generatedAt).getTime() < ttlMs;
}

/**
 * Return a cached, still-fresh result for a username, or null.
 */
export async function getCachedAnalysis(username) {
  const profile = await UserProfile.findOne({
    where: { username },
    include: [
      { model: Repository, as: 'repositories' },
      { model: Analysis, as: 'analyses', separate: true, order: [['generatedAt', 'DESC']], limit: 1 },
    ],
  });

  if (!profile) return null;
  const latest = profile.analyses?.[0];
  if (!latest || !isFresh(latest.generatedAt)) return null;

  return { profile, repositories: profile.repositories, analysis: latest, cached: true };
}

/**
 * Persist a fresh profile + repositories + analysis, replacing any stale
 * repository rows for the user. Runs in a transaction for consistency.
 */
export async function saveAnalysis({ profile, repos, analysis, insights }) {
  const { sequelize } = await import('../models/index.js');

  return sequelize.transaction(async (t) => {
    const [userProfile] = await UserProfile.upsert(
      {
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
      { transaction: t },
    );

    // Reload to guarantee we have the id (upsert return varies by dialect).
    const owner = await UserProfile.findOne({
      where: { username: profile.username },
      transaction: t,
    });

    // Replace repositories for a clean, consistent snapshot.
    await Repository.destroy({ where: { userProfileId: owner.id }, transaction: t });
    if (repos.length) {
      await Repository.bulkCreate(
        repos.map((r) => ({ ...r, userProfileId: owner.id })),
        { transaction: t },
      );
    }

    const savedAnalysis = await Analysis.create(
      {
        userProfileId: owner.id,
        score: analysis.score,
        metrics: analysis.metrics,
        languageStats: analysis.languageStats,
        insights,
        generatedAt: new Date(),
      },
      { transaction: t },
    );

    return { owner, savedAnalysis };
  });
}

export default { getCachedAnalysis, saveAnalysis };
