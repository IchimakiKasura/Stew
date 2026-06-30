const fs = require("fs-extra");
const htmlMinifier = require("html-minifier-terser");
const { isProd, isTest } = require("../config");
const config = require("../config"); // only used for errorCode variable

function rewriteHTML(html, rel) {

    html = html.replace(/(<link[^>]*href=["'])([^"']+)\.css(["'][^>]*>)/g, (_, a, file, b) => {
        console.log(`\x1b[38;5;208m[${isTest?"TEST:":""}Hyper Text Markup Language]\x1b[0m ${rel} -> rewriting ${file}.css > ${file}.min.css`);
        return `${a}${file}.min.css${b}`;
    });

    html = html.replace(/(<script[^>]*src=["'])([^"']+)\.js(["'][^>]*><\/script>)/g, (_, a, file, b) => {
        console.log(`\x1b[38;5;208m[${isTest?"TEST:":""}Hyper Text Markup Language]\x1b[0m ${rel} -> rewriting ${file}.js > ${file}.min.js`);
        return `${a}${file}.min.js${b}`;
    });

    if (!isProd || !isTest) return html;

    // removes stylesheets, bundle
    html = html.replace(/<link[^>]*href=["'][^"']+\.css["'][^>]*>\s*/g,"");
    html = html.replace("</head>",'<link rel="stylesheet" href="/css/bundle.min.css" defer></head>');
    console.log(`\x1b[38;5;208m[${isTest?"TEST:":""}Hyper Text Markup Language]\x1b[0m ${rel} -> css bundle linked`);

    return html;
}

async function doWorkHTML(file, rel, out) {
    const start = performance.now();
    let html = await fs.readFile(file, "utf8");

    html = rewriteHTML(html,rel);

    try {
        console.log(`\x1b[38;5;208m[${isTest?"TEST:":""}Hyper Text Markup Language]\x1b[0m ${rel} -> Minifying`);
        html = await htmlMinifier.minify(html, {
            collapseWhitespace: true,
            removeComments: true,
            minifyJS: true,
            minifyCSS: true,
            conservativeCollapse: true,
        });
        if(!isTest) await fs.outputFile(out, html);
        const time = performance.now() - start;
        console.log(`\x1b[38;5;208m[${isTest?"TEST:":""}Hyper Text Markup Language]\x1b[0m ${rel} -> ${isTest?"FINISHED":"copied to dist"} (took ${time.toFixed(2)}ms ✅)`);
    } catch (err) {
        config.errorCode = 1;
        console.log(`\x1b[38;5;208m[${isTest?"TEST:":""}Hyper Text Markup Language]\x1b[0m ${rel} -> Error occurs when minifying the file. ❌`);
        console.log(`\x1b[38;5;208m[${isTest?"TEST:":""}Hyper Text Markup Language]\x1b[0m \x1b[31m${rel} -> ${err}\x1b[0m`);
    }

}

module.exports = doWorkHTML;