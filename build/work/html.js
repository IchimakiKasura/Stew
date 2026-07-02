import fs from "fs-extra";
import * as htmlMinifier from "html-minifier-terser";
import config from "../config.js";

// yes, I could use jsdom, but I like to torture myself with regex

const regex = {
    stew: /\s*stew-mod\s*=\s*(["'])[\s\S]*?\1/gi,
    stewMod: /<([a-z0-9]+)([^>]*\bstew-mod\s*=\s*["']\s*([\s\S]*?)\s*["'][^>]*?)(?:\/>|>([\s\S]*?)<\/\1>)/gi,
    linkRemove: /<link[^>]*href=["'](?:\/|\.\/)[^"']+\.css["'][^>]*>\s*/g,
    linkMinify: /(<link[^>]*href=["'])([^"']+)\.css(["'][^>]*>)/g,
    scriptMinify: /(<script[^>]*src=["'])([^"']+)\.js(["'][^>]*><\/script>)/g,
    dotdir: /((?:href|src)=["']|url\["']?)(?!https?:|\/\/|#|mailto:|tel:|data:)\/?\/?/g
}

function applyStewModifiers(html) {
    return html.replace(regex.stewMod, (fullElement, tagName, attributes, stewValue, innerHTML) => {
        if (stewValue.includes('[remove][]'))  return '';
    
        let updatedAttributes = attributes;
        let updatedInnerHTML = innerHTML;
        let match;
        
        const modRegex = /\[([^\]]+)\]\[([^\]]*?)\]/g; 
        
        while ((match = modRegex.exec(stewValue)) !== null) {
            const [_, key, newVal] = match;
            if (key.toLowerCase() === 'textcontent')
                updatedInnerHTML = newVal;
            else {
                const attrRegex = new RegExp(`\\s*${key}\\s*=\\s*(["'])(?:(?!\\1).)*\\1`, 'i');
                
                if (newVal === "") updatedAttributes = updatedAttributes.replace(attrRegex, '');
                else if (attrRegex.test(updatedAttributes)) {
                    const updatePattern = new RegExp(`(${key}\\s*=\\s*)(["'])(?:(?!\\2).)*\\2`, 'i');
                    updatedAttributes = updatedAttributes.replace(updatePattern, `$1$2${newVal}$2`);
                } else updatedAttributes += ` ${key}="${newVal}"`;
            }
        }

        updatedAttributes = updatedAttributes.replace(regex.stew, '');
        return `<${tagName}${updatedAttributes}>${updatedInnerHTML}</${tagName}>`;
    });
}

function rewriteHTML(html, rel) {
    html = html.replace(regex.linkMinify, (_, a, file, b) => {
        if (file.endsWith('.min')) return _ ;

        log(rel, `rewriting ${file}.css > ${file}.min.css`); 
        return `${a}${file}.min.css${b}`; 
    });

    html = html.replace(regex.scriptMinify, (_, a, file, b) => {
        log(rel, `rewriting ${file}.js > ${file}.min.js`);
        return `${a}${file}.min.js${b}`;
    });

    if (!config.mode.isDev) {
        const originalHtml = html;

        html = applyStewModifiers(html);  

        html = html.replace(regex.linkRemove, "");
        if (html !== originalHtml) {
            html = html.replace("</head>", '<link rel="stylesheet" href="/css/bundle.min.css" defer></head>');
            log(rel, `css bundle linked (replaced existing styles)`);
        } else {
            log(rel, `no css links found; skipping bundle injection`);
        }
    }

    // for dotdir option, changes "/" to "./" for relative dir
    // (enable this if your site is under another uri and not on root)
    if(config.flags.dotdir) {
        html = html.replace(regex.dotdir, "$1./");
        log(rel, `relative index fixed`);
    }
    
    return html;
}

async function compileHTML(file, rel, out) {
    let html = await fs.readFile(file, "utf8");

    html = rewriteHTML(html, rel);

    try {
        html = await htmlMinifier.minify(html, {
            collapseWhitespace: true,
            removeComments: true,
            minifyJS: true,
            minifyCSS: true,
            conservativeCollapse: true,
        });
        if (!config.mode.isTest) await fs.outputFile(out, html);
    } catch (err) {
        config.errorCode = 1;
        log(rel, `Error occurs when minifying the file. ❌`);
        log(`\x1b[31m${rel}`, err);
    }
}

export default compileHTML;