import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

/**
 * githubService is the ONLY module that communicates with GitHub.
 * It abstracts REST + GraphQL, auth, pagination, and error mapping so the
 * rest of the app deals only with plain, normalized data structures.
 */

const REST_HEADERS = () => {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'DevDNA-Analytics',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (env.github.token) headers.Authorization = `Bearer ${env.github.token}`;
  return headers;
};

/**
 * Generic REST GET with unified error handling.
 */
async function restGet(path) {
  const res = await fetch(`${env.github.restBaseUrl}${path}`, {
    headers: REST_HEADERS(),
  });

  if (res.status === 404) throw ApiError.notFound('GitHub user not found');
  if (res.status === 403) {
    throw ApiError.tooManyRequests(
      'GitHub API rate limit reached. Add a GITHUB_TOKEN or try again later.',
    );
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw ApiError.badGateway('GitHub REST request failed', body);
  }
  return res.json();
}

/**
 * Fetch a user's public profile and normalize it to our shape.
 */
export async function fetchProfile(username) {
  const data = await restGet(`/users/${encodeURIComponent(username)}`);
  return {
    githubId: data.id,
    username: data.login,
    name: data.name,
    avatar: data.avatar_url,
    bio: data.bio,
    company: data.company,
    location: data.location,
    blog: data.blog,
    followers: data.followers,
    following: data.following,
    publicRepos: data.public_repos,
    githubCreatedAt: data.created_at,
  };
}

/**
 * Fetch all public repositories, following pagination. Returns normalized
 * repo objects. Language byte-breakdowns are fetched separately via GraphQL.
 */
export async function fetchRepositories(username) {
  const perPage = 100;
  const maxPages = 10; // safety cap: up to 1000 repos
  let page = 1;
  const repos = [];

  while (page <= maxPages) {
    const batch = await restGet(
      `/users/${encodeURIComponent(username)}/repos?per_page=${perPage}&page=${page}&sort=updated`,
    );
    if (!Array.isArray(batch) || batch.length === 0) break;

    for (const r of batch) {
      repos.push({
        githubId: r.id,
        name: r.name,
        fullName: r.full_name,
        description: r.description,
        url: r.html_url,
        stars: r.stargazers_count,
        forks: r.forks_count,
        watchers: r.watchers_count,
        openIssues: r.open_issues_count,
        language: r.language,
        topics: r.topics || [],
        isFork: r.fork,
        isArchived: r.archived,
        githubCreatedAt: r.created_at,
        githubUpdatedAt: r.updated_at,
        githubPushedAt: r.pushed_at,
      });
    }

    if (batch.length < perPage) break;
    page += 1;
  }

  return repos;
}

/**
 * Fetch per-repository language byte breakdowns via the GraphQL API in a
 * single request. Falls back to an empty map if GraphQL is unavailable
 * (e.g. no token) so the analysis can still proceed with REST data.
 */
export async function fetchLanguageBreakdown(username) {
  if (!env.github.token) return {};

  const query = `
    query ($login: String!, $after: String) {
      user(login: $login) {
        repositories(first: 100, after: $after, ownerAffiliations: OWNER, isFork: false) {
          pageInfo { hasNextPage endCursor }
          nodes {
            name
            languages(first: 20, orderBy: { field: SIZE, direction: DESC }) {
              edges { size node { name color } }
            }
          }
        }
      }
    }`;

  const breakdown = {};
  let after = null;

  try {
    // Paginate through all repos to accumulate language sizes.
    /* eslint-disable no-await-in-loop */
    while (true) {
      const res = await fetch(env.github.graphqlUrl, {
        method: 'POST',
        headers: {
          ...REST_HEADERS(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables: { login: username, after } }),
      });

      if (!res.ok) break;
      const json = await res.json();
      const repoConn = json?.data?.user?.repositories;
      if (!repoConn) break;

      for (const node of repoConn.nodes) {
        for (const edge of node.languages.edges) {
          const key = edge.node.name;
          if (!breakdown[key]) breakdown[key] = { bytes: 0, color: edge.node.color };
          breakdown[key].bytes += edge.size;
        }
      }

      if (!repoConn.pageInfo.hasNextPage) break;
      after = repoConn.pageInfo.endCursor;
    }
    /* eslint-enable no-await-in-loop */
  } catch (err) {
    logger.warn('GraphQL language breakdown failed, continuing without it:', err.message);
    return {};
  }

  return breakdown;
}

export default { fetchProfile, fetchRepositories, fetchLanguageBreakdown };
