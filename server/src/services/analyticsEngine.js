/**
 * analyticsEngine holds ONLY pure, side-effect-free calculations.
 * It takes normalized profile + repo data and returns computed metrics.
 * Keeping it pure makes it trivial to unit-test and reuse.
 */

// Keyword buckets used to categorize repositories by name/description/topics.
const CATEGORY_KEYWORDS = {
  'Web / Frontend': ['react', 'vue', 'angular', 'frontend', 'website', 'ui', 'css', 'tailwind', 'next'],
  'Backend / API': ['api', 'server', 'backend', 'express', 'django', 'flask', 'rest', 'graphql', 'nest'],
  'Mobile': ['android', 'ios', 'flutter', 'react-native', 'mobile', 'swift', 'kotlin'],
  'Data / ML / AI': ['ml', 'machine-learning', 'ai', 'data', 'model', 'neural', 'tensorflow', 'pytorch', 'nlp'],
  'DevOps / Infra': ['docker', 'kubernetes', 'terraform', 'ci', 'cd', 'infra', 'devops', 'ansible'],
  'CLI / Tooling': ['cli', 'tool', 'script', 'automation', 'bot', 'utility'],
  'Game': ['game', 'unity', 'godot', 'phaser'],
  'Library / SDK': ['lib', 'library', 'sdk', 'package', 'framework'],
};

function categorizeRepo(repo) {
  const haystack = [
    repo.name,
    repo.description || '',
    ...(repo.topics || []),
  ]
    .join(' ')
    .toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => haystack.includes(kw))) return category;
  }
  return 'Other';
}

/**
 * Language percentage breakdown. Prefers precise byte counts from GraphQL,
 * falls back to counting repos by primary language.
 */
function computeLanguageStats(repos, languageBreakdown) {
  const hasBytes = languageBreakdown && Object.keys(languageBreakdown).length > 0;

  if (hasBytes) {
    const total = Object.values(languageBreakdown).reduce((sum, l) => sum + l.bytes, 0) || 1;
    return Object.entries(languageBreakdown)
      .map(([name, { bytes, color }]) => ({
        name,
        bytes,
        color: color || null,
        percentage: Number(((bytes / total) * 100).toFixed(2)),
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }

  // Fallback: count repos per primary language.
  const counts = {};
  for (const r of repos) {
    if (!r.language) continue;
    counts[r.language] = (counts[r.language] || 0) + 1;
  }
  const total = Object.values(counts).reduce((s, c) => s + c, 0) || 1;
  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      count,
      color: null,
      percentage: Number(((count / total) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.percentage - a.percentage);
}

/**
 * Repos grouped by creation year (repository growth timeline).
 */
function computeGrowthTimeline(repos) {
  const byYear = {};
  for (const r of repos) {
    if (!r.githubCreatedAt) continue;
    const year = new Date(r.githubCreatedAt).getFullYear();
    byYear[year] = (byYear[year] || 0) + 1;
  }
  return Object.entries(byYear)
    .map(([year, count]) => ({ year: Number(year), count }))
    .sort((a, b) => a.year - b.year);
}

/**
 * First year each language appeared (technology evolution timeline).
 */
function computeTechEvolution(repos) {
  const firstSeen = {};
  for (const r of repos) {
    if (!r.language || !r.githubCreatedAt) continue;
    const year = new Date(r.githubCreatedAt).getFullYear();
    if (!firstSeen[r.language] || year < firstSeen[r.language]) {
      firstSeen[r.language] = year;
    }
  }
  return Object.entries(firstSeen)
    .map(([language, year]) => ({ language, year }))
    .sort((a, b) => a.year - b.year);
}

/**
 * A 0-100 developer activity score. Weighted, log-scaled so a few viral
 * repos don't completely dominate, and diminishing returns apply.
 */
function computeScore({ totalStars, totalForks, totalRepos, followers, recentActivityRatio }) {
  const starScore = Math.min(40, Math.log10(totalStars + 1) * 20);
  const forkScore = Math.min(15, Math.log10(totalForks + 1) * 10);
  const repoScore = Math.min(20, Math.log10(totalRepos + 1) * 12);
  const followerScore = Math.min(15, Math.log10(followers + 1) * 8);
  const activityScore = recentActivityRatio * 10; // 0..10

  const total = starScore + forkScore + repoScore + followerScore + activityScore;
  return Number(Math.min(100, total).toFixed(1));
}

/**
 * Main entry point: turn raw data into the full analytics payload.
 */
export function analyze({ profile, repos, languageBreakdown }) {
  const ownRepos = repos.filter((r) => !r.isFork);

  const totalStars = ownRepos.reduce((sum, r) => sum + r.stars, 0);
  const totalForks = ownRepos.reduce((sum, r) => sum + r.forks, 0);
  const totalRepos = ownRepos.length;

  // Share of repos pushed to within the last year.
  const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
  const activeCount = ownRepos.filter(
    (r) => r.githubPushedAt && new Date(r.githubPushedAt).getTime() >= oneYearAgo,
  ).length;
  const recentActivityRatio = totalRepos ? activeCount / totalRepos : 0;

  const languageStats = computeLanguageStats(ownRepos, languageBreakdown);

  const mostActive = [...ownRepos]
    .sort((a, b) => {
      const scoreA = a.stars * 3 + a.forks * 2;
      const scoreB = b.stars * 3 + b.forks * 2;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return new Date(b.githubPushedAt || 0) - new Date(a.githubPushedAt || 0);
    })
    .slice(0, 6)
    .map((r) => ({
      name: r.name,
      url: r.url,
      description: r.description,
      stars: r.stars,
      forks: r.forks,
      language: r.language,
    }));

  // Category counts.
  const categories = {};
  for (const r of ownRepos) {
    const c = categorizeRepo(r);
    categories[c] = (categories[c] || 0) + 1;
  }
  const projectCategories = Object.entries(categories)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const score = computeScore({
    totalStars,
    totalForks,
    totalRepos,
    followers: profile.followers,
    recentActivityRatio,
  });

  return {
    score,
    metrics: {
      totalRepos,
      totalStars,
      totalForks,
      activeRepos: activeCount,
      recentActivityRatio: Number(recentActivityRatio.toFixed(2)),
      mostActive,
      growthTimeline: computeGrowthTimeline(ownRepos),
      techEvolution: computeTechEvolution(ownRepos),
      projectCategories,
    },
    languageStats,
  };
}

export default { analyze };
