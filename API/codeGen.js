const fs = require('fs');
process.chdir(__dirname);

if(!fs.existsSync('docs.html')) {
    module.exports = new Promise((resolve) => {
        require('./downloadHTML').then(() => {
            require('./parseHTML'); 
            require('./generateJSON');
            require('./prettifyJSON');
            resolve();
        });
    });
} else if(!fs.existsSync('docs.html.json')) {
    require('./parseHTML');
    require('./generateJSON');
    require('./prettifyJSON');
    module.exports = Promise.resolve();
} else {
    require('./generateJSON');
    require('./prettifyJSON');
    module.exports = Promise.resolve();
}