import fs from "fs-extra";
import CleanCSS from "clean-css";
import config, { isTest } from "../config.js";
import log from "../console.js"

async function doWorkCSS(file, rel, out) {
    const start = performance.now();

    out = out.replace(/\.css$/, ".min.css");

    const code = await fs.readFile(file, "utf8");

    try {
        log(rel, `Minifying`);
        const min = new CleanCSS({}).minify(code).styles;
        if (!isTest) await fs.outputFile(out, min);
        const end = performance.now() - start;
        log(rel, `copied to dist (took ${end.toFixed(2)}ms ✅)`);
    } catch (err) {
        config.errorCode = 1;
        log(rel, `Failed ❌ [${err}]`);
    }
}

export default doWorkCSS;