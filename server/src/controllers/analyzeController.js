import analysisService from '../services/analysisService.js';
import ApiError from '../utils/ApiError.js';

/**
 * Thin controller: validates input, delegates to the service, shapes output.
 * No business logic lives here.
 */
export async function analyze(req, res) {
  const { username, refresh } = req.body;

  if (!username || typeof username !== 'string' || !username.trim()) {
    throw ApiError.badRequest('A valid "username" is required.');
  }

  const result = await analysisService.runAnalysis(username.trim(), Boolean(refresh));
  res.status(200).json(result);
}

export default { analyze };
