process.chdir(__dirname);
const docs = require('./docs_raw.json');
const scopes = require('./scopes.json');
const overrides = require('./overrides.js');

const output = {};

while(overrides.length > 0) {
    const key = overrides.shift();
    const func = overrides.shift();
    try {
        func(docs[key])
    } catch(e) {
        console.warn(e);
    }
}
for(let key in docs) {
    /**
     * 
     * @param {{ 
     *  name: string,
     *  type: string,
     *  required: boolean,
     *  description: string
     * }[]} param 
     */
    function paramToObj(param, depth = 0) {
        const retObj = {};
        let c;
        while(c = param.shift()) {
            if(c.name.length - c.name.trimStart().length != depth) {
                param.unshift(c);
                return retObj;
            }
            
            retObj[c.name.trim()] = {
                type: c.type,
                required: c.required,
                description: c.description
            }
            if(c.type.toLowerCase().startsWith('string')) {
                let possible = c.description.toLowerCase().indexOf('can be');
                if(possible == -1) possible = c.description.toLowerCase().indexOf('possible');
                if(possible != -1) possible = c.description.toLowerCase().indexOf('values', possible);
                if(possible == -1) possible = c.description.toLowerCase().indexOf('possible');
                if(possible != -1)
                while((possible = c.description.indexOf('- ', possible + 1)) >= 0) {
                    let end = [
                        c.description.indexOf("—", possible + 1),
                        c.description.indexOf("-", possible + 1),
                        c.description.indexOf(",", possible + 1),
                        c.description.indexOf(":", possible + 1),
                        c.description.indexOf("\n", possible + 1)
                    ].reduce((prev, v) => (v==-1?prev:Math.min(prev, v)), c.description.length);
                    (retObj[c.name.trim()].possible ??= []).push(c.description.substring(possible + 2, end).trim().replaceAll(/`|"|'/g,''));
                }
            }
            if(c.type.toLowerCase().startsWith('map')) {
                const types = /map\[(.*),(.*)\]|map\[(.*)\](.*)/.exec(c.type);
                retObj[c.name.trim()].type = 'map<' + (types[1] ?? types[3]) + ',' + (types[2] ?? types[4]) + '>';
                if(!['string', 'bool', 'unsigned integer', 'integer', 'boolean', 'float', 'int64'].some((v => (types[2] ?? types[4]).toLowerCase().startsWith(v)))) {
                    let nextname = param[0]?.name ?? "";
                    if(nextname.length - nextname.trim().length == depth) retObj[c.name.trim()].attr = {};
                    else retObj[c.name.trim()].attr = paramToObj(param, nextname.length - nextname.trim().length);
                    if(Object.keys(retObj[c.name.trim()].attr).length == 0) console.warn(key, 'found with no documented attributes:', c.name.trim(), ":", c.type);
                }
            }
            if(!['string', 'bool', 'unsigned integer', 'integer', 'boolean', 'map', 'float', 'int64'].some((v => c.type.toLowerCase().startsWith(v)))) {
                let nextname = param[0]?.name ?? "";
                if(nextname.length - nextname.trim().length == depth) retObj[c.name.trim()].attr = {};
                else retObj[c.name.trim()].attr = paramToObj(param, nextname.length - nextname.trim().length);
                if(Object.keys(retObj[c.name.trim()].attr).length == 0) console.warn(key, 'found with no documented attributes:', c.name.trim(), ":", c.type);
            }
        }
        return retObj;
    }
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
    const modParams = paramToObj(output[cat][key].params ?? []);
    if(output[cat][key].params.length) console.warn(key, 'could not parse all parameters:', output[cat][key].params);
    output[cat][key].params = modParams;
    const modReqBody = paramToObj(output[cat][key].reqBody ?? []);
    if(output[cat][key].reqBody.length) console.warn(key, 'could not parse all request body parameters', output[cat][key].reqBody);
    output[cat][key].reqBody = modReqBody
    const modBody = paramToObj(output[cat][key].body ?? []);
    if(output[cat][key].body.length) console.warn(key, 'could not parse all parameters of body', output[cat][key].body);
    output[cat][key].body = modBody;
    if((output[cat][key].params['after'] != null) != (output[cat][key].body['pagination'] != null)) console.warn(key, 'weird pagination layout!');
}

require('fs').writeFileSync('docs.json', JSON.stringify(output, null, 4));