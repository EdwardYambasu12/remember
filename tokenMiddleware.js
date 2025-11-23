const { model_schema, generateXmasToken, generateMatchesToken, generateMatchDetailsToken } = require('./auth');

/**
 * Get or generate x-mas token with fallback logic
 * @param {string} type - Token type: 'matches', 'matchDetails', 'commentary', 'news', 'odds'
 * @param {object} params - Parameters for token generation
 * @returns {Promise<string>} x-mas token
 */
async function getOrGenerateToken(type, params = {}) {
  try {
    const data = await model_schema.findOne();
    
    switch(type) {
      case 'matches':
        if (data?.variable) return data.variable;
        const { date, timezone, ccode3 } = params;
        return generateMatchesToken(
          date || new Date().toISOString().split('T')[0].replace(/-/g, ''),
          timezone || 'Africa%2FMonrovia',
          ccode3 || 'LBR'
        );
        
      case 'matchDetails':
        if (data?.result_string) return data.result_string;
        return generateMatchDetailsToken(params.matchId || '4822533');
        
      case 'commentary':
        if (data?.comm) return data.comm;
        return generateXmasToken(params.urlPath);
        
      case 'news':
        if (data?.m_news) return data.m_news;
        return generateXmasToken(params.urlPath);
        
      case 'odds':
        if (data?.odds) return data.odds;
        return generateXmasToken(params.urlPath);
        
      default:
        return generateXmasToken(params.urlPath || '/api/data/matches');
    }
  } catch (error) {
    console.error('Token generation error:', error);
    // Fallback to fresh token generation
    if (type === 'matches') {
      return generateMatchesToken(
        new Date().toISOString().split('T')[0].replace(/-/g, ''),
        'Africa%2FMonrovia',
        'LBR'
      );
    }
    return generateXmasToken(params.urlPath || '/api/data/matches');
  }
}

module.exports = { getOrGenerateToken };