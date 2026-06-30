import fs from "fs-extra";
import CleanCSS from "clean-css";
import config, { isTest } from "../config.js";

async function doWorkCSS(file, rel, out) {
    const start = performance.now();

    out = out.replace(/\.css$/, ".min.css");

    const code = await fs.readFile(file, "utf8");

    try {
        console.log(`\x1b[36m[Cascading Style Sheet]\x1b[0m ${rel} -> Minifying`);
        const min = new CleanCSS({}).minify(code).styles;
        if (!isTest) await fs.outputFile(out, min);
        const end = performance.now() - start;
        console.log(`\x1b[36m[Cascading Style Sheet]\x1b[0m ${rel} -> copied to dist (took ${end.toFixed(2)}ms ✅)`);
    } catch (err) {
        config.errorCode = 1;
        console.log(`\x1b[36m[Cascading Style Sheet]\x1b[0m ${rel} -> Failed ❌ [${err}]`);
    }
}

export default doWorkCSS;