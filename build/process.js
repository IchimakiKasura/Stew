const fs = require("fs-extra");
const path = require("path");

const { SRC, DIST, isProd, isTest } = require("./config");
const doWorkJS = require("./work/javascript");
const doWorkCSS = require("./work/css");
const doWorkHTML = require("./work/html");

async function proc(inputFile) {
    const rel = path.relative(SRC, inputFile);
    let out = path.join(DIST, rel);

    if (inputFile.endsWith(".js")) {
        await doWorkJS(inputFile, rel, out);
        return;
    }

    if (inputFile.endsWith(".css")) {
        if (isProd || isTest) return;
        await dowWorkCSS(inputFile, rel, out);
        return;
    }

    if (inputFile.endsWith(".html")) {
        await doWorkHTML(inputFile, rel, out);
        return;
    }

    if(isTest) return;
    const start = performance.now();
    await fs.copy(inputFile, out);
    const time = performance.now() - start;
    console.log(`\x1b[32m[ASSETS]\x1b[0m ${rel} -> copied to dist (took ${time.toFixed(2)}ms ✅)`);
}

module.exports = proc;