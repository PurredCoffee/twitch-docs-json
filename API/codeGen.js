const fs = require('fs');
process.chdir(__dirname);

if(!fs.existsSync('docs.html')) {
    require('./downloadHTML').then(() => {
        require('./parseHTML'); 
        require('./generateJSON');
        require('./prettifyJSON');
    });
} else if(!fs.existsSync('docs.html.json')) {
    require('./parseHTML');
    require('./generateJSON');
    require('./prettifyJSON');
} else if(!fs.existsSync('docs_raw.json')) {
    require('./generateJSON');
    require('./prettifyJSON');
}