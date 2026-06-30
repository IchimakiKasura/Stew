import fs from "fs-extra";
import path from "node:path";
import CleanCSS from "clean-css";
import config, { SRC, DIST, isTest } from "../config.js";

async function bundleCSS() {
    const start = performance.now();
    const cssDir = path.join(SRC, "css");
    const bundleDir = path.join(DIST, "css", "bundle.min.css");

    let bundle = "";

    for (const file of await fs.readdir(cssDir)) {
        if (!file.endsWith(".css")) continue;

        console.log(`\x1b[36m[${isTest ? "TEST:" : ""}Cascading Style Sheet]\x1b[0m ${file} -> Bundling file`);
        bundle += await fs.readFile(path.join(cssDir, file), "utf8");

        bundle += "\n";
    }

    try {
        console.log(`\x1b[36m[${isTest ? "TEST:" : ""}Cascading Style Sheet]\x1b[0m bundle.css -> Minifying (bundle.min.css)`);
        bundle = new CleanCSS({}).minify(bundle).styles;
        if (!isTest) await fs.outputFile(bundleDir, bundle);
        const end = performance.now() - start; // Fixed: Now correctly calculates total duration
        console.log(`\x1b[36m[${isTest ? "TEST:" : ""}Cascading Style Sheet]\x1b[0m bundle.min.css -> ${isTest ? "FINISHED" : "copied to dist"} (took ${end.toFixed(2)}ms ✅)`);
    } catch (err) {
        config.errorCode = 1;
        console.log(`\x1b[36m[${isTest ? "TEST:" : ""}Cascading Style Sheet]\x1b[0m bundle.min.css -> Failed ❌ [${err}]`);
    }
}

export default bundleCSS;