const express = require('express');
const router = express.Router();

// Use matchDetails endpoint for specific matchId
const axios = require('axios');

router.get('/match-status/:matchid', async (req, res) => {
    const matchid = req.params.matchid;
    try {
        const response = await axios.get('https://www.fotmob.com/api/matchDetails', {
            params: { matchId: matchid },
            headers: {
                'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15'
            }
        });
        // Try to find finished status in general or header.status
        const finished = response.data?.general?.finished || response.data?.header?.status?.finished;
        if (typeof finished === 'boolean') {
            res.json({ ended: finished });
        } else {
            res.status(404).json({ error: 'Match not found' });
        }
    } catch (err) {
        console.error('Error in match-status:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
