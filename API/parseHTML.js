//@ts-check
process.chdir(__dirname);

const fs = require('fs');
const { inspect } = require('util');

const escapeSeq = [
    {char: "\t", codes: ["&Tab;"]},
    {char: "\n", codes: ["&NewLine;"]},
    {char: " ", codes: ["&nbsp;"]},
    {char: "“", codes: ["&quot;"]},
    {char: "<", codes: ["&lt;"]},
    {char: ">", codes: ["&gt;"]},
    {char: " ", codes: ["&nbsp;"]},
    {char: "¡", codes: ["&iexcl;"]},
    {char: "¢", codes: ["&cent;"]},
    {char: "£", codes: ["&pound;"]},
    {char: "¤", codes: ["&curren;"]},
    {char: "¥", codes: ["&yen;"]},
    {char: "¦", codes: ["&brvbar;"]},
    {char: "§", codes: ["&sect;"]},
    {char: "¨", codes: ["&uml;"]},
    {char: "©", codes: ["&copy;"]},
    {char: "ª", codes: ["&ordf;"]},
    {char: "«", codes: ["&laquo;"]},
    {char: "¬", codes: ["&not;"]},
    {char: "­", codes: ["&shy;"]},
    {char: "®", codes: ["&reg;"]},
    {char: "¯", codes: ["&macr;"]},
    {char: "°", codes: ["&deg;"]},
    {char: "±", codes: ["&plusmn;"]},
    {char: "²", codes: ["&sup2;"]},
    {char: "³", codes: ["&sup3;"]},
    {char: "´", codes: ["&acute;"]},
    {char: "µ", codes: ["&micro;"]},
    {char: "¶", codes: ["&para;"]},
    {char: "·", codes: ["&dot;"]},
    {char: "¸", codes: ["&cedil;"]},
    {char: "¹", codes: ["&sup1;"]},
    {char: "º", codes: ["&ordm;"]},
    {char: "»", codes: ["&raquo;"]},
    {char: "¼", codes: ["&frac14;"]},
    {char: "½", codes: ["&frac12;"]},
    {char: "¾", codes: ["&frac34;"]},
    {char: "¿", codes: ["&iquest;"]},
    {char: "À", codes: ["&Agrave;"]},
    {char: "Á", codes: ["&Aacute;"]},
    {char: "Â", codes: ["&Acirc;"]},
    {char: "Ã", codes: ["&Atilde;"]},
    {char: "Ä", codes: ["&Auml;"]},
    {char: "Å", codes: ["&Aring;"]},
    {char: "Æ", codes: ["&AElig;"]},
    {char: "Ç", codes: ["&Ccedil;"]},
    {char: "È", codes: ["&Egrave;"]},
    {char: "É", codes: ["&Eacute;"]},
    {char: "Ê", codes: ["&Ecirc;"]},
    {char: "Ë", codes: ["&Euml;"]},
    {char: "Ì", codes: ["&Igrave;"]},
    {char: "Í", codes: ["&Iacute;"]},
    {char: "Î", codes: ["&Icirc;"]},
    {char: "Ï", codes: ["&Iuml;"]},
    {char: "Ð", codes: ["&ETH;"]},
    {char: "Ñ", codes: ["&Ntilde;"]},
    {char: "Ò", codes: ["&Ograve;"]},
    {char: "Ó", codes: ["&Oacute;"]},
    {char: "Ô", codes: ["&Ocirc;"]},
    {char: "Õ", codes: ["&Otilde;"]},
    {char: "Ö", codes: ["&Ouml;"]},
    {char: "×", codes: ["&times;"]},
    {char: "Ø", codes: ["&Oslash;"]},
    {char: "Ù", codes: ["&Ugrave;"]},
    {char: "Ú", codes: ["&Uacute;"]},
    {char: "Û", codes: ["&Ucirc;"]},
    {char: "Ü", codes: ["&Uuml;"]},
    {char: "Ý", codes: ["&Yacute;"]},
    {char: "Þ", codes: ["&THORN;"]},
    {char: "ß", codes: ["&szlig;"]},
    {char: "à", codes: ["&agrave;"]},
    {char: "á", codes: ["&aacute;"]},
    {char: "â", codes: ["&acirc;"]},
    {char: "ã", codes: ["&atilde;"]},
    {char: "ä", codes: ["&auml;"]},
    {char: "å", codes: ["&aring;"]},
    {char: "æ", codes: ["&aelig;"]},
    {char: "ç", codes: ["&ccedil;"]},
    {char: "è", codes: ["&egrave;"]},
    {char: "é", codes: ["&eacute;"]},
    {char: "ê", codes: ["&ecirc;"]},
    {char: "ë", codes: ["&euml;"]},
    {char: "ì", codes: ["&igrave;"]},
    {char: "í", codes: ["&iacute;"]},
    {char: "î", codes: ["&icirc;"]},
    {char: "ï", codes: ["&iuml;"]},
    {char: "ð", codes: ["&eth;"]},
    {char: "ñ", codes: ["&ntilde;"]},
    {char: "ò", codes: ["&ograve;"]},
    {char: "ó", codes: ["&oacute;"]},
    {char: "ô", codes: ["&ocirc;"]},
    {char: "õ", codes: ["&otilde;"]},
    {char: "ö", codes: ["&ouml;"]},
    {char: "÷", codes: ["&divide;"]},
    {char: "ø", codes: ["&oslash;"]},
    {char: "ù", codes: ["&ugrave;"]},
    {char: "ú", codes: ["&uacute;"]},
    {char: "û", codes: ["&ucirc;"]},
    {char: "ü", codes: ["&uuml;"]},
    {char: "ý", codes: ["&yacute;"]},
    {char: "þ", codes: ["&thorn;"]},
    {char: "ÿ", codes: ["&yuml;"]},
    {char: "Ā", codes: ["&Amacr;"]},
    {char: "ā", codes: ["&amacr;"]},
    {char: "Ă", codes: ["&Abreve;"]},
    {char: "ă", codes: ["&abreve;"]},
    {char: "Ą", codes: ["&Aogon;"]},
    {char: "ą", codes: ["&aogon;"]},
    {char: "Ć", codes: ["&Cacute;"]},
    {char: "ć", codes: ["&cacute;"]},
    {char: "Ĉ", codes: ["&Ccirc;"]},
    {char: "ĉ", codes: ["&ccirc;"]},
    {char: "Ċ", codes: ["&Cdot;"]},
    {char: "ċ", codes: ["&cdot;"]},
    {char: "Č", codes: ["&Ccaron;"]},
    {char: "č", codes: ["&ccaron;"]},
    {char: "Ď", codes: ["&Dcaron;"]},
    {char: "ď", codes: ["&dcaron;"]},
    {char: "Đ", codes: ["&Dstrok;"]},
    {char: "đ", codes: ["&dstrok;"]},
    {char: "Ē", codes: ["&Emacr;"]},
    {char: "ē", codes: ["&emacr;"]},
    {char: "Ĕ", codes: ["&Ebreve;"]},
    {char: "ĕ", codes: ["&ebreve;"]},
    {char: "Ė", codes: ["&Edot;"]},
    {char: "ė", codes: ["&edot;"]},
    {char: "Ę", codes: ["&Eogon;"]},
    {char: "ę", codes: ["&eogon;"]},
    {char: "Ě", codes: ["&Ecaron;"]},
    {char: "ě", codes: ["&ecaron;"]},
    {char: "Ĝ", codes: ["&Gcirc;"]},
    {char: "ĝ", codes: ["&gcirc;"]},
    {char: "Ğ", codes: ["&Gbreve;"]},
    {char: "ğ", codes: ["&gbreve;"]},
    {char: "Ġ", codes: ["&Gdot;"]},
    {char: "ġ", codes: ["&gdot;"]},
    {char: "Ģ", codes: ["&Gcedil;"]},
    {char: "ģ", codes: ["&gcedil;"]},
    {char: "Ĥ", codes: ["&Hcirc;"]},
    {char: "ĥ", codes: ["&hcirc;"]},
    {char: "Ħ", codes: ["&Hstrok;"]},
    {char: "ħ", codes: ["&hstrok;"]},
    {char: "Ĩ", codes: ["&Itilde;"]},
    {char: "ĩ", codes: ["&itilde;"]},
    {char: "Ī", codes: ["&Imacr;"]},
    {char: "ī", codes: ["&imacr;"]},
    {char: "Ĭ", codes: ["&Ibreve;"]},
    {char: "ĭ", codes: ["&ibreve;"]},
    {char: "Į", codes: ["&Iogon;"]},
    {char: "į", codes: ["&iogon;"]},
    {char: "İ", codes: ["&Idot;"]},
    {char: "ı", codes: ["&imath;","&inodot;"]},
    {char: "Ĳ", codes: ["&IJlig;"]},
    {char: "ĳ", codes: ["&ijlig;"]},
    {char: "Ĵ", codes: ["&Jcirc;"]},
    {char: "ĵ", codes: ["&jcirc;"]},
    {char: "Ķ", codes: ["&Kcedil;"]},
    {char: "ķ", codes: ["&kcedil;"]},
    {char: "ĸ", codes: ["&kgreen;"]},
    {char: "Ĺ", codes: ["&Lacute;"]},
    {char: "ĺ", codes: ["&lacute;"]},
    {char: "Ļ", codes: ["&Lcedil;"]},
    {char: "ļ", codes: ["&lcedil;"]},
    {char: "Ľ", codes: ["&Lcaron;"]},
    {char: "ľ", codes: ["&lcaron;"]},
    {char: "Ŀ", codes: ["&Lmidot;"]},
    {char: "ŀ", codes: ["&lmidot;"]},
    {char: "Ł", codes: ["&Lstrok;"]},
    {char: "ł", codes: ["&lstrok;"]},
    {char: "Ń", codes: ["&Nacute;"]},
    {char: "ń", codes: ["&nacute;"]},
    {char: "Ņ", codes: ["&Ncedil;"]},
    {char: "ņ", codes: ["&ncedil;"]},
    {char: "Ň", codes: ["&Ncaron;"]},
    {char: "ň", codes: ["&ncaron;"]},
    {char: "ŉ", codes: ["&napos;"]},
    {char: "Ŋ", codes: ["&ENG;"]},
    {char: "ŋ", codes: ["&eng;"]},
    {char: "Ō", codes: ["&Omacr;"]},
    {char: "ō", codes: ["&omacr;"]},
    {char: "Ŏ", codes: ["&Obreve;"]},
    {char: "ŏ", codes: ["&obreve;"]},
    {char: "Ő", codes: ["&Odblac;"]},
    {char: "ő", codes: ["&odblac;"]},
    {char: "Œ", codes: ["&OElig;"]},
    {char: "œ", codes: ["&oelig;"]},
    {char: "Ŕ", codes: ["&Racute;"]},
    {char: "ŕ", codes: ["&racute;"]},
    {char: "Ŗ", codes: ["&Rcedil;"]},
    {char: "ŗ", codes: ["&rcedil;"]},
    {char: "Ř", codes: ["&Rcaron;"]},
    {char: "ř", codes: ["&rcaron;"]},
    {char: "Ś", codes: ["&Sacute;"]},
    {char: "ś", codes: ["&sacute;"]},
    {char: "Ŝ", codes: ["&Scirc;"]},
    {char: "ŝ", codes: ["&scirc;"]},
    {char: "Ş", codes: ["&Scedil;"]},
    {char: "ş", codes: ["&scedil;"]},
    {char: "Š", codes: ["&Scaron;"]},
    {char: "š", codes: ["&scaron;"]},
    {char: "Ţ", codes: ["&Tcedil;"]},
    {char: "ţ", codes: ["&tcedil;"]},
    {char: "Ť", codes: ["&Tcaron;"]},
    {char: "ť", codes: ["&tcaron;"]},
    {char: "Ŧ", codes: ["&Tstrok;"]},
    {char: "ŧ", codes: ["&tstrok;"]},
    {char: "Ũ", codes: ["&Utilde;"]},
    {char: "ũ", codes: ["&utilde;"]},
    {char: "Ū", codes: ["&Umacr;"]},
    {char: "ū", codes: ["&umacr;"]},
    {char: "Ŭ", codes: ["&Ubreve;"]},
    {char: "ŭ", codes: ["&ubreve;"]},
    {char: "Ů", codes: ["&Uring;"]},
    {char: "ů", codes: ["&uring;"]},
    {char: "Ű", codes: ["&Udblac;"]},
    {char: "ű", codes: ["&udblac;"]},
    {char: "Ų", codes: ["&Uogon;"]},
    {char: "ų", codes: ["&uogon;"]},
    {char: "Ŵ", codes: ["&Wcirc;"]},
    {char: "ŵ", codes: ["&wcirc;"]},
    {char: "Ŷ", codes: ["&Ycirc;"]},
    {char: "ŷ", codes: ["&ycirc;"]},
    {char: "Ÿ", codes: ["&Yuml;"]},
    {char: "ƒ", codes: ["&fnof;"]},
    {char: "ˆ", codes: ["&circ;"]},
    {char: "˜", codes: ["&tilde;"]},
    {char: "Α", codes: ["&Alpha;"]},
    {char: "Β", codes: ["&Beta;"]},
    {char: "Γ", codes: ["&Gamma;"]},
    {char: "Δ", codes: ["&Delta;"]},
    {char: "Ε", codes: ["&Epsilon;"]},
    {char: "Ζ", codes: ["&Zeta;"]},
    {char: "Η", codes: ["&Eta;"]},
    {char: "Θ", codes: ["&Theta;"]},
    {char: "Ι", codes: ["&Iota;"]},
    {char: "Κ", codes: ["&Kappa;"]},
    {char: "Λ", codes: ["&Lambda;"]},
    {char: "Μ", codes: ["&Mu;"]},
    {char: "Ν", codes: ["&Nu;"]},
    {char: "Ξ", codes: ["&Xi;"]},
    {char: "Ο", codes: ["&Omicron;"]},
    {char: "Π", codes: ["&Pi;"]},
    {char: "Ρ", codes: ["&Rho;"]},
    {char: "Σ", codes: ["&Sigma;"]},
    {char: "Τ", codes: ["&Tau;"]},
    {char: "Υ", codes: ["&Upsilon;"]},
    {char: "Φ", codes: ["&Phi;"]},
    {char: "Χ", codes: ["&Chi;"]},
    {char: "Ψ", codes: ["&Psi;"]},
    {char: "Ω", codes: ["&Omega;"]},
    {char: "α", codes: ["&alpha;"]},
    {char: "β", codes: ["&beta;"]},
    {char: "γ", codes: ["&gamma;"]},
    {char: "δ", codes: ["&delta;"]},
    {char: "ε", codes: ["&epsilon;"]},
    {char: "ζ", codes: ["&zeta;"]},
    {char: "η", codes: ["&eta;"]},
    {char: "θ", codes: ["&theta;"]},
    {char: "ι", codes: ["&iota;"]},
    {char: "κ", codes: ["&kappa;"]},
    {char: "λ", codes: ["&lambda;"]},
    {char: "μ", codes: ["&mu;"]},
    {char: "ν", codes: ["&nu;"]},
    {char: "ξ", codes: ["&xi;"]},
    {char: "ο", codes: ["&omicron;"]},
    {char: "π", codes: ["&pi;"]},
    {char: "ρ", codes: ["&rho;"]},
    {char: "ς", codes: ["&sigmaf;"]},
    {char: "σ", codes: ["&sigma;"]},
    {char: "τ", codes: ["&tau;"]},
    {char: "υ", codes: ["&upsilon;"]},
    {char: "φ", codes: ["&phi;"]},
    {char: "χ", codes: ["&chi;"]},
    {char: "ψ", codes: ["&psi;"]},
    {char: "ω", codes: ["&omega;"]},
    {char: "ϑ", codes: ["&thetasym;"]},
    {char: "ϒ", codes: ["&upsih;"]},
    {char: "ϖ", codes: ["&piv;"]},
    {char: " ", codes: ["&ensp;"]},
    {char: " ", codes: ["&emsp;"]},
    {char: " ", codes: ["&thinsp;"]},
    {char: "", codes: ["&zwnj;"]},
    {char: "", codes: ["&zwj;"]},
    {char: "", codes: ["&lrm;"]},
    {char: "", codes: ["&rlm;"]},
    {char: "–", codes: ["&ndash;"]},
    {char: "—", codes: ["&mdash;"]},
    {char: "‘", codes: ["&lsquo;"]},
    {char: "’", codes: ["&rsquo;"]},
    {char: "‚", codes: ["&sbquo;"]},
    {char: "“", codes: ["&ldquo;"]},
    {char: "”", codes: ["&rdquo;"]},
    {char: "„", codes: ["&bdquo;"]},
    {char: "†", codes: ["&dagger;"]},
    {char: "‡", codes: ["&Dagger;"]},
    {char: "•", codes: ["&bull;"]},
    {char: "…", codes: ["&hellip;"]},
    {char: "‰", codes: ["&permil;"]},
    {char: "′", codes: ["&prime;"]},
    {char: "″", codes: ["&Prime;"]},
    {char: "‹", codes: ["&lsaquo;"]},
    {char: "›", codes: ["&rsaquo;"]},
    {char: "‾", codes: ["&oline;"]},
    {char: "€", codes: ["&euro;"]},
    {char: "™", codes: ["&trade;"]},
    {char: "←", codes: ["&larr;"]},
    {char: "↑", codes: ["&uarr;"]},
    {char: "→", codes: ["&rarr;"]},
    {char: "↓", codes: ["&darr;"]},
    {char: "↔", codes: ["&harr;"]},
    {char: "↵", codes: ["&crarr;"]},
    {char: "∀", codes: ["&forall;"]},
    {char: "∂", codes: ["&part;"]},
    {char: "∃", codes: ["&exist;"]},
    {char: "∅", codes: ["&empty;"]},
    {char: "∇", codes: ["&nabla;"]},
    {char: "∈", codes: ["&isin;"]},
    {char: "∉", codes: ["&notin;"]},
    {char: "∋", codes: ["&ni;"]},
    {char: "∏", codes: ["&prod;"]},
    {char: "∑", codes: ["&sum;"]},
    {char: "−", codes: ["&minus;"]},
    {char: "∗", codes: ["&lowast;"]},
    {char: "√", codes: ["&radic;"]},
    {char: "∝", codes: ["&prop;"]},
    {char: "∞", codes: ["&infin;"]},
    {char: "∠", codes: ["&ang;"]},
    {char: "∧", codes: ["&and;"]},
    {char: "∨", codes: ["&or;"]},
    {char: "∩", codes: ["&cap;"]},
    {char: "∪", codes: ["&cup;"]},
    {char: "∫", codes: ["&int;"]},
    {char: "∴", codes: ["&there4;"]},
    {char: "∼", codes: ["&sim;"]},
    {char: "≅", codes: ["&cong;"]},
    {char: "≈", codes: ["&asymp;"]},
    {char: "≠", codes: ["&ne;"]},
    {char: "≡", codes: ["&equiv;"]},
    {char: "≤", codes: ["&le;"]},
    {char: "≥", codes: ["&ge;"]},
    {char: "⊂", codes: ["&sub;"]},
    {char: "⊃", codes: ["&sup;"]},
    {char: "⊄", codes: ["&nsub;"]},
    {char: "⊆", codes: ["&sube;"]},
    {char: "⊇", codes: ["&supe;"]},
    {char: "⊕", codes: ["&oplus;"]},
    {char: "⊗", codes: ["&otimes;"]},
    {char: "⊥", codes: ["&perp;"]},
    {char: "⋅", codes: ["&sdot;"]},
    {char: "⌈", codes: ["&lceil;"]},
    {char: "⌉", codes: ["&rceil;"]},
    {char: "⌊", codes: ["&lfloor;"]},
    {char: "⌋", codes: ["&rfloor;"]},
    {char: "◊", codes: ["&loz;"]},
    {char: "♠", codes: ["&spades;"]},
    {char: "♣", codes: ["&clubs;"]},
    {char: "♥", codes: ["&hearts;"]},
    {char: "♦", codes: ["&diams;"]},
    {char: "&", codes: ["&amp;"]},
];

/**
 * 
 * @param {string} str
 * @returns {string} 
 */
function unescape(str) {
    let p = -1;
    while(true) {
        p = str.indexOf('&', p + 1);
        if(p == -1) break;
        let escaped = false;
        if(str.startsWith('&#x')) {
            let end = str.indexOf(';', p);
            let digits = str.slice(p + 3, end - 1);
            str = str.substring(0,p) + String.fromCharCode(parseInt(digits, 16)) + str.substring(end + 1);
            continue;
        }
        if(str.startsWith('&#')) {
            let end = str.indexOf(';', p);
            let digits = str.slice(p + 2, end - 1);
            str = str.substring(0,p) + String.fromCharCode(parseInt(digits)) + str.substring(end + 1);
            continue;
        }
        for(const v of escapeSeq) {
            for(let seq of v.codes) {
                if(str.startsWith(seq, p)) {
                    str = str.substring(0,p) + v.char + str.substring(p + seq.length);
                }
            }
            if(escaped) break;
        }
    }
    return str;
}
/**
 * @typedef {{children: Array<htmlObj | string>, attr: {[name: string]: string | boolean}, name: string}} htmlObj
 */
/**
 * 
 * @param {{
 *  full: string,
 *  pos: number,
 *  startsWith(string: string, pos?: number): boolean,
 *  consume(count?: number | string, escapeable?: boolean): string,
 *  pass(): number,
 *  tillSpecial(whitespace?: boolean): string,
 *  return(count: number | string): string
 * }} html 
 * @returns {htmlObj}
 */
function parseHTMLSnippet(html, depth = 0) {
    const char = html.consume();
    if(char != '<') throw Error("tag malformed! " + html.return(100) + "« HERE");
    html.pass();
    /**
     * @type {htmlObj}
     */
    let retObj = {name: html.tillSpecial(), attr: {}, children: []};
    html.pass();
    let attr;
    while(attr = html.tillSpecial()) {
        if(attr.endsWith('=')) {
            const opener = html.consume();
            if(!["'", '"'].includes(opener)) throw Error("attribute malformed! " + html.return(100) + "« HERE");
            const val = html.consume(opener, true);
            retObj.attr[attr.substring(0, attr.length-1)] = val;
            html.consume();
        } else {
            retObj.attr[attr] = true;
        }
        html.pass();
    }
    if(html.consume() != '>') {
        throw Error("tag malformed! " + html.return(100) + "« HERE");
    }
    let hasChildren = true;
    if(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"].includes(retObj.name)) hasChildren = false;
    if(["script", "style", "svg"].includes(retObj.name)) {
        retObj.children.push(html.consume("</" + retObj.name));
        html.consume(retObj.name.length + 2);
        return retObj;
    }
    if(!hasChildren) return retObj;
    while(html.pos <= html.full.length) {
        retObj.children.push(unescape(html.consume('<')));
        if(html.startsWith('</')) {
            html.consume('>');
            html.consume();
            break;
        }
        if(html.startsWith('<!--')) {
            html.consume(4);
            retObj.children.push({
                attr: {},
                children: [unescape(html.consume('-->'))],
                name: "!--"
            });
            html.consume(3);
            continue;
        }
        retObj.children.push(parseHTMLSnippet(html, depth + 1));
    }
    return retObj;
}

/**
 * 
 * @param {string} html 
 */
function parseHTML(html) {
    html = html.substring(html.indexOf('<html'));
    return parseHTMLSnippet({
        full: html, pos: 0, 
        consume(count = 1, escapeable=false) {
            if(typeof count == 'string') {
                if(escapeable) {
                    let c = 0;
                    let char;
                    while(char = this.full[c + this.pos]) {
                        if(char == '\\') {
                            if(this.full[c+1+this.pos] == count) break;
                            c += 2;
                            continue;
                        }
                        if(char == count) break;
                        c += 1;
                    }
                    count = c;
                } else count = this.full.indexOf(count, this.pos) - this.pos;
            }
            const retVal = this.full.substring(this.pos, count + this.pos);
            this.pos += count;
            return retVal;
        }, 
        pass() {
            const len = this.full.length - this.pos;
            this.pos = this.full.length - this.full.substring(this.pos).trimStart().length;
            return len - this.pos;
        }, 
        tillSpecial(whitespace=true) {
            const specials = ['"',"'",'<','>'];
            if(whitespace) {
                specials.push(' ');
            }
            let char;
            let str = "";
            while(char = this.consume()) {
                str += char;
                if(char == '\\') {
                    str += this.consume();
                    continue;
                }
                if(specials.includes(char)) {
                    this.pos -= 1;
                    str = str.substring(0, str.length-1);
                    break;
                }
            }
            return str;
        },
        return(count = 1) {
            if(typeof count == 'string') {
                count = this.full.lastIndexOf(count, this.pos) - this.pos;
            }
            const retVal = this.full.substring(this.pos - count, this.pos);
            this.pos -= count;
            return retVal;
        },
        startsWith(string, position) {
            return this.full.startsWith(string, (position ?? 0) + this.pos)
        }
    });
}

const htmlText = fs.readFileSync('docs.html').toString();
const html = parseHTML(htmlText);

fs.writeFileSync('docs.html.json', JSON.stringify(html, null, 2));