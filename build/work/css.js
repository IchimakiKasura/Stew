import fs from "fs-extra";
import CleanCSS from "clean-css";
import config from "../config.js";

async function compileCSS(file, rel, out) {
    out = out.replace(/\.css$/, ".min.css");

    const code = await fs.readFile(file, "utf8");

    try {
        const min = new CleanCSS({}).minify(code).styles;
        if (!config.mode.isTest) await fs.outputFile(out, min);
    } catch (err) {
        config.errorCode = 1;
        log(rel, `Failed ❌ [${err}]`);
    }
}

export default compileCSS;