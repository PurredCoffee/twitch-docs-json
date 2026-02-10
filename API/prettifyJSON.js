process.chdir(__dirname);
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
    output[cat][key].auth = "Requires " + [
        (output[cat][key].token.includes('app'))?"an [app access token](https://dev.twitch.tv/docs/authentication#app-access-tokens)":"",
        (output[cat][key].token.includes('user'))?"a [user access token](https://dev.twitch.tv/docs/authentication#user-access-tokens))":"",
        (output[cat][key].token.includes('JWT'))?"a signed JSON Web Token (JWT) created by an Extension Backend Service (EBS). For signing requirements, see [Signing the JWT](https://dev.twitch.tv/docs/extensions/building/#signing-the-jwt).":""
    ].filter(Boolean).join(' or ');
    if(output[cat][key].scopes.length > 0) {
        output[cat][key].auth += " with any of the following scopes: " + output[cat][key].scopes.map(v => "`" + v + "`").join(', ');
    }
    if(output[cat][key].chatScopes?.length > 0) {
        output[cat][key].auth += " and any of the following scopes in the requested chat: " + output[cat][key].chatScopes.map(v => "`" + v + "`").join(', ');
    }
    if(output[cat][key].authInfo) {
        output[cat][key].auth += "\nINFO: " + output[cat][key].authInfo;
    }
}

require('fs').writeFileSync('docs.json', JSON.stringify(output, null, 4));