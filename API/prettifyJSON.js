
const docs = require('./docs_raw.json');
const scopes = require('./scopes.json');

const output = {};
for(let key in docs) {
    const cat = docs[key].category;
    output[cat] ??= {};
    output[cat][key] = docs[key];
    output[cat][key].scopes = scopes[key].scopes;
    output[cat][key].authInfo = scopes[key].extra;
    output[cat][key].queryRestraints = scopes[key].queryRestraints;
    output[cat][key].chatScopes = scopes[key].chatScopes;
}

require('fs').writeFileSync('docs.json', JSON.stringify(output, null, 4));