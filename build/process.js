import fs from "fs-extra";
import path from "node:path";

import { SRC, DIST, isProd, isTest } from "./config.js";
import doWorkJS from "./work/javascript.js";
import doWorkCSS from "./work/css.js";
import doWorkHTML from "./work/html.js";
import log from "./console.js"

async function proc(inputFile) {
    const rel = path.relative(SRC, inputFile);
    let out = path.join(DIST, rel);

    if(inputFile.endsWith(".nofile")) return;

    if (inputFile.endsWith(".js")) {
        await doWorkJS(inputFile, rel, out);
        return;
    }

    if (inputFile.endsWith(".css")) {
        if (isProd || isTest) return;
        await doWorkCSS(inputFile, rel, out);
        return;
    }

    if (inputFile.endsWith(".html")) {
        await doWorkHTML(inputFile, rel, out);
        return;
    }

    if (isTest) return;
    const start = performance.now();
    await fs.copy(inputFile, out);
    const time = performance.now() - start;
    log(rel, `copied to dist (took ${time.toFixed(2)}ms ✅)`);
}

export default proc;
