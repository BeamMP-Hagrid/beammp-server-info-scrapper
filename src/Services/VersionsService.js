const path = require('path');
const fs = require('fs');

const getVersionsService = async () => {
    const versionsPath = path.join(__dirname, '../../version.json');
    if (!fs.existsSync(versionsPath)) {
        throw new Error('version.json not found');
    }
    const versionsFile = JSON.parse(fs.readFileSync(versionsPath, 'utf8'));
    return versionsFile;
}

module.exports = { getVersionsService }