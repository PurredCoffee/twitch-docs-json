//@ts-check
process.chdir(__dirname);

/**
 * @import {htmlObj} from './parseHTML'
 */
const docs = /** @type {htmlObj} */ (require('./docs.html.json'));

/**
 * 
 * @param {htmlObj | string | undefined} htmlObj 
 * @param {string|string[]} query
 * @returns {htmlObj}
 */
function $(htmlObj, query) {
    if(htmlObj === undefined || typeof htmlObj === 'string') throw Error('Value not found')
    if(typeof query == 'string') {
        const reg = /(\w*)(\#\w+|\.\w+|\[\w+\])*/g;
        //@ts-ignore
        query = [...reg.exec(query)];
        query = query.filter(Boolean);
        query.shift();
    }
    for(let v of htmlObj.children) {
        if(typeof v === 'string') continue;
        let check = true;
        query.forEach(q => {
            switch(q[0]) {
                case '.':
                    check &&= (" " + (v.attr.class?? "")).includes(" " + q.substring(1));
                    break;
                case '#':
                    check &&= v.attr.id == q.substring(1);
                    break;
                case '[':
                    const split = q.split("=");
                    if(split[1]) {
                        check &&= v.attr[0] === split[1];
                    } else {
                        check &&= v.attr[0] === undefined;
                    }
                    break;
                default:
                    check &&= v.name == q;
                    break;
            }
        });
        if(check) return v;
        try {
            return $(v, query);
        } catch(e) {}
    }
    throw Error('Value not found');
}
/**
 * 
 * @param {htmlObj | string | undefined} htmlObj
 * @returns {string} 
 */
function asText(htmlObj, trim=true) {
    if(htmlObj === undefined || typeof htmlObj === 'string') return String(htmlObj);
    let str = htmlObj.children.map((v) => {
        if(typeof v === 'string') return v.replaceAll(/\s/g, ' ');
        return asText(v, false);
    }).join('').replaceAll(/(\s) */g, '$1');
    /**
     * 
     * @param {string} str 
     * @returns 
     */
    function prettify(str) {
        switch(htmlObj?.name) {
            case 'strong':
                return '*' + str + '*';
            case 'code':
                return '`' + str + '`';
            case 'li':
                return '- ' + str.replaceAll('\n', '\n  ') + '\n';
            case 'a':
                //@ts-ignore
                return '[' + str + '](' + (htmlObj.attr["href"]?.startsWith?.("/")?'https://dev.twitch.tv' + htmlObj.attr["href"]:htmlObj.attr["href"]) + ')';
            case 'p':
                return str + '\n';
            default:
                return str;
        }
    }
    str = prettify((trim)?str.trim():str);
    return (trim)?str.trim():str
}
/**
 * 
 * @param {htmlObj | string | undefined} htmlObj
 * @returns {string} 
 */
function asRaw(htmlObj, trim=true) {
    if(htmlObj === undefined || typeof htmlObj === 'string') return String(htmlObj);
    const str = htmlObj.children.map((v) => {
        if(typeof v === 'string') return v;
        return asRaw(v, false);
    }).join('');
    return (trim)?str.trim():str;
}


const main = $(docs, "div.main");
const segments = $(main.children[1], 'tbody');

/**
 * @type {any}
 */
const RawInfo = {};
segments.children.forEach((v) => {
    if(typeof v === 'string') return;
    RawInfo[asRaw(v.children[3])] = {
        category: asText(v.children[1]),
        short: asText(v.children[5])
    }
});

const errors = [];
/**
 * @type {any}
 */
const warnings = {};
let i = 3;
while(main.children[i]?.name === 'section') {
    const segment = main.children[i];
    const doc = $(segment, '.left-docs');
    const name = asRaw(doc.children[1]);
    let long = "";
    let x = 5;
    while(doc.children[x]?.name != 'h3') {
        long += asText(doc.children[x]) + '\n';
        x+=2;
    }
    long = long.trim();
    RawInfo[name].long = long;
    RawInfo[name].params = [];
    RawInfo[name].reqBody = [];
    RawInfo[name].body = [];
    RawInfo[name].codes = {};
    while(doc.children[x]) {
        if(!RawInfo[name]) break;
        let b = false;
        try {
        switch(asRaw(doc.children[x]).toLowerCase()) {
            case 'url':
                [RawInfo[name].method, RawInfo[name].url] = asRaw(doc.children[x+2]).split(' ');
                break;
            case 'authorization':
                RawInfo[name].auth = asText(doc.children[x+2]);
                RawInfo[name].token = [
                    RawInfo[name].auth.toLowerCase().includes('app access token')?'app':'',
                    RawInfo[name].auth.toLowerCase().includes('user access token')||RawInfo[name].auth.toLowerCase().includes('user-access token')||RawInfo[name].auth.toLowerCase().includes('oauth scope')?'user':'',
                    RawInfo[name].auth.toLowerCase().includes('json web token')?'JWT':''
                ].filter(Boolean);
                break;
            case 'request query parameters': {
                while(doc.children[x+2].name == 'p') {
                    RawInfo[name].paramsInfo = ((RawInfo[name].paramsInfo ?? "") + "\n" + asText(doc.children[x+2])).trimStart();
                    warnings[name] = warnings[name] ?? {};
                    warnings[name].params = RawInfo[name].paramsInfo;
                    x+=2;
                }
                if(doc.children[x+2].name == 'h3') {
                    break;
                }
                let typelast = false;
                let skipReq = false;
                const header = $(doc.children[x+2], 'thead');
                //@ts-ignore
                if(header.children[1].children[3].children[0] !== 'Type') {
                    typelast = true;
                }
                //@ts-ignore
                if(header.children[1].children[5].children[0] === 'Description') {
                    skipReq = true;
                }
                const table = $(doc.children[x+2], 'tbody');
                let y = 1;
                while(table.children[y]) {
                    /**
                     * @type {htmlObj}
                     */
                    //@ts-expect-error
                    const row = table.children[y];
                    const Qname = asRaw(row.children[1], false);
                    /**
                     * 
                     * @param {string} str 
                     */
                    function toBool(str) {
                        switch(str) {
                            case 'yes': return true;
                            case 'no': return false;
                        }
                        return str;
                    }
                    RawInfo[name].params.push({
                        name: Qname,
                        type: asRaw(row.children[3 + (typelast?2:0)]).toLowerCase(),
                        required: (skipReq)?true:toBool(asRaw(row.children[5 - (typelast?2:0)]).toLowerCase()),
                        description: asText(row.children[7 - (skipReq?2:0)])
                    });
                    y+=2;
                }
                break;
            }
            case 'request body': {
                while(doc.children[x+2].name == 'p') {
                    RawInfo[name].reqBodyInfo = ((RawInfo[name].reqBodyInfo ?? "") + "\n" + asText(doc.children[x+2])).trimStart();
                    warnings[name] = warnings[name] ?? {};
                    warnings[name].reqBody = RawInfo[name].reqBodyInfo;
                    x+=2;
                }
                if(doc.children[x+2].name == 'h3') {
                    break;
                }
                let typelast = false;
                let skipReq = false;
                const header = $(doc.children[x+2], 'thead');
                //@ts-ignore
                if(header.children[1].children[3].children[0] !== 'Type') {
                    typelast = true;
                }
                //@ts-ignore
                if(header.children[1].children[5].children[0] === 'Description') {
                    skipReq = true;
                }
                const table = $(doc.children[x+2], 'tbody');
                let y = 1;
                while(table.children[y]) {
                    /**
                     * @type {htmlObj}
                     */
                    //@ts-expect-error
                    const row = table.children[y];
                    const Qname = asRaw(row.children[1], false);
                    /**
                     * 
                     * @param {string} str 
                     */
                    function toBool(str) {
                        switch(str) {
                            case 'yes': return true;
                            case 'no': return false;
                        }
                        return str;
                    }
                    RawInfo[name].reqBody.push({
                        name: Qname,
                        type: asRaw(row.children[3 + (typelast?2:0)]).toLowerCase(),
                        required: (skipReq)?true:toBool(asRaw(row.children[5 - (typelast?2:0)]).toLowerCase()),
                        description: asText(row.children[7 - (skipReq?2:0)])
                    });
                    y+=2;
                }
                break;
            }
            case 'response body': {
                while(doc.children[x+2].name == 'p') {
                    RawInfo[name].bodyInfo = ((RawInfo[name].bodyInfo ?? "") + "\n" + asText(doc.children[x+2])).trimStart();
                    warnings[name] = warnings[name] ?? {};
                    warnings[name].body = RawInfo[name].bodyInfo;
                    x+=2;
                }
                if(doc.children[x+2].name == 'h3') {
                    break;
                }
                const table = $(doc.children[x+2], 'tbody');
                let y = 1;
                while(table.children[y]) {
                    /**
                     * @type {htmlObj}
                     */
                    //@ts-expect-error
                    const row = table.children[y];
                    const Rname = asRaw(row.children[1], false);
                    RawInfo[name].reqBody.push({
                        name: Rname,
                        type: asRaw(row.children[3]).toLowerCase(),
                        description: asText(row.children[5])
                    });
                    y+=2;
                }
                break;
            }
            case 'response codes': {
                while(doc.children[x+2].name == 'p') {
                    RawInfo[name].codesInfo = ((RawInfo[name].codesInfo ?? "") + "\n" + asText(doc.children[x+2])).trimStart();
                    warnings[name] = warnings[name] ?? {};
                    warnings[name].codes = RawInfo[name].codesInfo;
                    x+=2;
                }
                if(doc.children[x+2].name == 'h3') {
                    break;
                }
                const table = $(doc.children[x+2], 'tbody');
                let y = 1;
                while(table.children[y]) {
                    /**
                     * @type {htmlObj}
                     */
                    //@ts-expect-error
                    const row = table.children[y];
                    const code = asRaw(row.children[1]).split(' ')[0];
                    RawInfo[name].codes[code] = asText(row.children[3]);
                    y+=2;
                }
                break;
            }
            default:
                b = true;
                break;
        }
        } catch(e){
            console.warn(name, 'failed to parse!', e);
            errors.push(name);
            b = true;
        }
        if(b) break;
        x+=4;
    }
    i+=2;
}
require('fs').writeFileSync('docs_raw.json', JSON.stringify(RawInfo, null, 4));
if(errors.length) {
    console.error('Failed to parse the following requests:');
    console.log(errors);
}
if(Object.keys(warnings).length) {
    console.error('Manual intervention is required to parse the following requests:');
    console.log(warnings);
}

const scopes = JSON.parse(require('fs').readFileSync('scopes.json'));

for(let key in RawInfo) {
    if(scopes[key]?.authText != RawInfo[key].auth) {
        scopes[key] = {
            authText: RawInfo[key].auth,
            scopes: 'TODO',
            restraints: 'TODO'
        }
        console.warn('Authentication changed for', key);
    }
}
require('fs').writeFileSync('scopes.json', JSON.stringify(scopes, null, 4));


//console.log(docs.children[1]);