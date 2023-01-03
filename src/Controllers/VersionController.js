const { getVersionsService } = require('../Services/VersionsService');

const getVersionsController = async (req, res) => {
    try {
        const versions = await getVersionsService();
        res.status(200).json(versions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getVersionsController };