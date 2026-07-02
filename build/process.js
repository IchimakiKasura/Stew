import fs from "fs-extra";
import path from "node:path";

import config from "./config.js";
import compileJS from "./work/javascript.js";
import compileCSS from "./work/css.js";
import compileHTML from "./work/html.js";

async function proc(inputFile) {
    const rel = path.relative(config.src, inputFile);
    let out = path.join(config.dist, rel);

    switch (path.extname(inputFile)) {
        case ".nofile": return;
        case ".js": return timeTaken(rel, () => compileJS(inputFile, rel, out, true));
        case ".css":
            if (!config.mode.isDev) return;
            return timeTaken(rel, () => compileCSS(inputFile, rel, out, true));
        case ".html": return timeTaken(rel, () => compileHTML(inputFile, rel, out, true));
        default:
            if (config.mode.isTest) return;
            return timeTaken(rel, () => fs.copy(inputFile, out));
    }
}

export default proc;