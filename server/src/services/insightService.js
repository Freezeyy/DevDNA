import { GoogleGenerativeAI } from '@google/generative-ai';
import env from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * insightService turns computed analytics into a human-readable narrative.
 * It uses Google Gemini when a key is configured, and falls back to
 * deterministic rule-based insights otherwise so the platform always
 * returns something.
 */

let model = null;
function getModel() {
  if (!env.gemini.apiKey) return null;
  if (!model) {
    const genAI = new GoogleGenerativeAI(env.gemini.apiKey);
    model = genAI.getGenerativeModel({
      model: env.gemini.model,
      generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
    });
  }
  return model;
}

/**
 * Deterministic fallback insights derived purely from the analytics.
 */
function ruleBasedInsights(profile, analysis) {
  const { score, metrics, languageStats } = analysis;
  const topLanguages = languageStats.slice(0, 3).map((l) => l.name);
  const topCategory = metrics.projectCategories[0]?.name || 'general software';

  const summary =
    `${profile.name || profile.username} has ${metrics.totalRepos} public repositories ` +
    `earning ${metrics.totalStars} stars and ${metrics.totalForks} forks. ` +
    `Their strongest area appears to be ${topCategory.toLowerCase()}, ` +
    `working primarily in ${topLanguages.join(', ') || 'various languages'}.`;

  const highlights = [];
  if (score >= 70) highlights.push('High-impact developer with strong community traction.');
  else if (score >= 40) highlights.push('Active developer with a solid and growing portfolio.');
  else highlights.push('Emerging developer building out their public presence.');

  if (metrics.recentActivityRatio >= 0.5) {
    highlights.push('Consistently active — most repositories were updated within the last year.');
  } else {
    highlights.push('Several projects are older; recent activity is more selective.');
  }

  if (topLanguages.length) {
    highlights.push(`Primary tech stack centers on ${topLanguages.join(', ')}.`);
  }

  const recommendations = [
    'Add README badges and documentation to top repositories to boost discoverability.',
    'Pin your most-starred projects to strengthen your profile at a glance.',
    metrics.recentActivityRatio < 0.5
      ? 'Refresh or archive stale repositories to signal an active portfolio.'
      : 'Keep the momentum — consistent activity is a strong positive signal.',
  ];

  return { summary, highlights, recommendations, source: 'rule-based' };
}

/**
 * Ask Gemini for structured insights. Returns null on any failure so the
 * caller can fall back gracefully.
 */
async function aiInsights(profile, analysis) {
  const gemini = getModel();
  if (!gemini) return null;

  const payload = {
    username: profile.username,
    name: profile.name,
    bio: profile.bio,
    followers: profile.followers,
    score: analysis.score,
    totals: {
      repos: analysis.metrics.totalRepos,
      stars: analysis.metrics.totalStars,
      forks: analysis.metrics.totalForks,
    },
    topLanguages: analysis.languageStats.slice(0, 5),
    categories: analysis.metrics.projectCategories,
    techEvolution: analysis.metrics.techEvolution,
  };

  const prompt =
    'You are a senior engineering mentor analyzing a GitHub developer profile. ' +
    'Return ONLY valid JSON with keys: summary (string), highlights (string[]), ' +
    'recommendations (string[]). Be specific, encouraging, and concise.\n\n' +
    `Analyze this developer profile and generate insights:\n${JSON.stringify(payload, null, 2)}`;

  try {
    const result = await gemini.generateContent(prompt);
    const raw = result.response.text();
    const parsed = JSON.parse(raw);
    return {
      summary: parsed.summary || '',
      highlights: parsed.highlights || [],
      recommendations: parsed.recommendations || [],
      source: 'gemini',
    };
  } catch (err) {
    logger.warn('Gemini insight generation failed, using rule-based fallback:', err.message);
    return null;
  }
}

/**
 * Public API: always returns insights (AI when possible, else rule-based).
 */
export async function generateInsights(profile, analysis) {
  const ai = await aiInsights(profile, analysis);
  return ai || ruleBasedInsights(profile, analysis);
}

export default { generateInsights };
