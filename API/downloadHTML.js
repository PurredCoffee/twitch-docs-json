//@ts-check
process.chdir(__dirname);

const fs = require('fs');

module.exports = (async () => {
    fs.writeFileSync('docs.html', await (await fetch('https://dev.twitch.tv/docs/api/reference/')).text());
})()