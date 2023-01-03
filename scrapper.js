const express = require('express');
const helmet = require("helmet");
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const UriConstants = require('./src/Constants/UriConstants');
const { getVersionsController } = require('./src/Controllers/VersionController');

const interval = 1000 * 60 * 60; // 1 hour

setInterval(async () => {
    const browser = await puppeteer.launch();
    // Server Version
    const serverPage = await browser.newPage();
    await serverPage.goto(UriConstants.SERVER_TAGS_URI);
    const serverVersion = await serverPage.evaluate(() => {
        const element = document.getElementsByClassName('Link--primary')[0];
        return element.textContent;
    });
    // Game Version
    const gamePage = await browser.newPage();
    await gamePage.goto(UriConstants.GAME_TAGS_URI);
    const gameVersion = await gamePage.evaluate(() => {
        const element = document.getElementsByClassName('Link--primary')[0];
        return element.textContent;
    });
    // Launcher Version
    const launcherPage = await browser.newPage();
    await launcherPage.goto(UriConstants.LAUNCHER_TAGS_URI);
    const launcherVersion = await launcherPage.evaluate(() => {
        const element = document.getElementsByClassName('Link--primary')[0];
        return element.textContent;
    });
    await browser.close();

    // Path to version.json
    const versionsPath = path.join(__dirname, 'version.json');
    if (!fs.existsSync(versionsPath)) {
        /*
            Create version.json file if it doesn't exist with the current versions.
            This case will never happen because the file
            is already in the repo. But it's here just in case.
        */
        const newVersionsFile = {
            beamServer: {
                version: serverVersion
            },
            beamGame: {
                version: gameVersion
            },
            beamLauncher: {
                version: launcherVersion
            }
        };
        fs.writeFileSync(versionsPath, JSON.stringify(newVersionsFile, null, 2));
    }
    // Read version from file
    const versionsFile = JSON.parse(fs.readFileSync(versionsPath, 'utf8'));
    // Check if versions are different
    if (versionsFile.beamServer.version !== serverVersion) {
        versionsFile.beamServer.version = serverVersion;
        fs.writeFileSync(versionsPath, JSON.stringify(versionsFile, null, 2));
    };
    if (versionsFile.beamGame.version !== gameVersion) {
        versionsFile.beamGame.version = gameVersion;
        fs.writeFileSync(versionsPath, JSON.stringify(versionsFile, null, 2));
    };
    if (versionsFile.beamLauncher.version !== launcherVersion) {
        versionsFile.beamLauncher.version = launcherVersion;
        fs.writeFileSync(versionsPath, JSON.stringify(versionsFile, null, 2));
    };
}, interval);

// EXPRESS SERVER (MINIMALIST)
const app = express();

app.use(helmet.noSniff());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/beam-versions', getVersionsController);

app.listen(33000, () => {
    console.log('Example app listening on port 3000!');
});