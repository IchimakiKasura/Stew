import fs from "fs-extra";
import path from "node:path";
import CleanCSS from "clean-css";
import config, { SRC, DIST, isTest } from "../config.js";
import log from "../console.js"

async function bundleCSS() {
    const start = performance.now();
    const cssDir = path.join(SRC, "css");
    const bundleDir = path.join(DIST, "css", "bundle.min.css");

    let bundle = "";

    for (const file of await fs.readdir(cssDir)) {
        if (!file.endsWith(".css")) continue;

        log(file, `Bundling file`);
        bundle += await fs.readFile(path.join(cssDir, file), "utf8");

        bundle += "\n";
    }

    try {
        log('bundle.css', `Minifying (bundle.min.css)`);
        bundle = new CleanCSS({}).minify(bundle).styles;
        if (!isTest) await fs.outputFile(bundleDir, bundle);
        const end = performance.now() - start;
        log(`bundle.min.css`, `${isTest ? "FINISHED" : "copied to dist"} (took ${end.toFixed(2)}ms ✅)`);
    } catch (err) {
        config.errorCode = 1;
        log(`bundle.min.css`, `Failed ❌ [${err}]`);
    }
}

export default bundleCSS;