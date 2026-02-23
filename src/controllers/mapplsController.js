const axios = require('axios');

const MAPPLS_API_KEY = process.env.MAPPLS_API_KEY || '';

exports.getDrivingRoute = async (req, res) => {
    try {
        const { start, end } = req.query;

        if (!start || !end) {
            return res.status(400).json({ message: 'Start and end coordinates are required' });
        }

        const response = await axios.get(
            `https://apis.mappls.com/advancedmaps/v1/${MAPPLS_API_KEY}/route_adv/driving/${start};${end}`,
            {
                params: {
                    geometries: 'polyline',
                    steps: true,
                    overview: 'full'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Mappls Route Error:', error.message);
        res.status(500).json({ message: 'Failed to get route', error: error.message });
    }
};

exports.getPlaceDetails = async (req, res) => {
    try {
        const { eLoc } = req.query;

        if (!eLoc) {
            return res.status(400).json({ message: 'eLoc is required' });
        }

        const response = await axios.get(
            `https://apis.mappls.com/advancedmaps/v1/${MAPPLS_API_KEY}/place_detail`,
            {
                params: { place_id: eLoc }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Mappls Place Details Error:', error.message);
        res.status(500).json({ message: 'Failed to get place details', error: error.message });
    }
};
