import fs from "fs-extra";
import * as htmlMinifier from "html-minifier-terser";
import config from "../config.js";

// yes, I could use jsdom, but I like to torture myself with regex

function applyStewModifiers(html) {
    return html.replace(/(<([a-z0-9]+)[^>]*\bstew-mod\s*=\s*["']\s*([\s\S]*?)\s*["'][^>]*>)/gi, (fullTag, _, tagName, stewContent) => {
        let updatedTag = fullTag, match;
        const modRegex = /\[([^\]]+)\]\[([^\]]+)\]/g;
        while ((match = modRegex.exec(stewContent)) !== null) {
            const [_, attrName, newVal] = match;
            const attrRegex = new RegExp(`(${attrName}\\s*=\\s*)(["'])(?:(?!\\2).)*\\2`, 'i');
            if (attrRegex.test(updatedTag)) 
                updatedTag = updatedTag.replace(attrRegex, `$1$2${newVal}$2`);
        }
        updatedTag = updatedTag.replace(/\s*stew-mod\s*=\s*(["'])[\s\S]*?\1/gi, '');
        return updatedTag;
    });
}

function rewriteHTML(html, rel) {
    html = html.replace(/(<link[^>]*href=["'])([^"']+)\.css(["'][^>]*>)/g, (_, a, file, b) => {
    if (file.endsWith('.min')) return _ ;

    log(rel, `rewriting ${file}.css > ${file}.min.css`); 
    return `${a}${file}.min.css${b}`; 
    });

    html = html.replace(/(<script[^>]*src=["'])([^"']+)\.js(["'][^>]*><\/script>)/g, (_, a, file, b) => {
        log(rel, `rewriting ${file}.js > ${file}.min.js`);
        return `${a}${file}.min.js${b}`;
    });

    if (!config.mode.isDev) {
        const originalHtml = html;
        html = html.replace(/<link[^>]*href=["'](?:\/|\.\/)[^"']+\.css["'][^>]*>\s*/g, "");
        if (html !== originalHtml) {
            html = html.replace("</head>", '<link rel="stylesheet" href="/css/bundle.min.css" defer></head>');
            log(rel, `css bundle linked (replaced existing styles)`);
        } else {
            log(rel, `no css links found; skipping bundle injection`);
        }
    
        // run custom replace for dev to prod
        html = applyStewModifiers(html);
    }

    // for dotdir option, changes "/" to "./" for relative dir
    // (enable this if your site is under another uri and not on root)
    if(config.flags.dotdir) {
        html = html.replace(/((?:href|src)=["']|url\["']?)(?!https?:|\/\/|#|mailto:|tel:|data:)\/?\/?/g, "$1./");
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