import fs from "fs-extra";
import * as htmlMinifier from "html-minifier-terser";
import config, { isProd, isTest } from "../config.js";
import log from "../console.js"

function rewriteHTML(html, rel) {
    html = html.replace(/(<link[^>]*href=["'])([^"']+)\.css(["'][^>]*>)/g, (_, a, file, b) => {
        log(rel, `rewriting ${file}.css > ${file}.min.css`);
        return `${a}${file}.min.css${b}`;
    });

    html = html.replace(/(<script[^>]*src=["'])([^"']+)\.js(["'][^>]*><\/script>)/g, (_, a, file, b) => {
        log(rel, `rewriting ${file}.js > ${file}.min.js`);
        return `${a}${file}.min.js${b}`;
    });

    if (!isProd || !isTest) return html;

    // removes stylesheets, bundle
    html = html.replace(/<link[^>]*href=["'][^"']+\.css["'][^>]*>\s*/g, "");
    html = html.replace("</head>", '<link rel="stylesheet" href="/css/bundle.min.css" defer></head>');
    log(rel, `css bundle linked`);
    
    // run custom replace for dev
    // html = html.replace(/* regex */, /* replace */);

    return html;
}

async function doWorkHTML(file, rel, out) {
    const start = performance.now();
    let html = await fs.readFile(file, "utf8");

    html = rewriteHTML(html, rel);

    try {
        log(rel, `Minifying`);
        html = await htmlMinifier.minify(html, {
            collapseWhitespace: true,
            removeComments: true,
            minifyJS: true,
            minifyCSS: true,
            conservativeCollapse: true,
        });
        if (!isTest) await fs.outputFile(out, html);
        const time = performance.now() - start;
        log(rel, `${isTest ? "FINISHED" : "copied to dist"} (took ${time.toFixed(2)}ms ✅)`);
    } catch (err) {
        config.errorCode = 1;
        log(rel, `Error occurs when minifying the file. ❌`);
        log(`\x1b[31m${rel}`, err);
    }
}

export default doWorkHTML;