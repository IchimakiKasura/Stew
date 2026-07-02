import fs from "fs-extra";
import path from "node:path";
import CleanCSS from "clean-css";
import config from "../config.js";

async function bundleCSS() {
    const cssDir = path.join(config.src, "css");
    const bundleDir = path.join(config.dist, "css", "bundle.min.css");

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
        if (!config.mode.isTest) await fs.outputFile(bundleDir, bundle);
    } catch (err) {
        config.errorCode = 1;
        log(`bundle.min.css`, `Failed ❌ [${err}]`);
    }
}

export default bundleCSS;