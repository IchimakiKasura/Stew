import fs from "fs-extra";
import * as terser from "terser";
import config, { isProd, isTest } from "../config.js";
import log from "../console.js"

function rewriteJS(code, name) {
    code = code.replace(/(from\s+["'])([^"']+)\.js(["'])/g, (_, a, file, b) => {
        log(name,`Renaming script imports ${file.replace('.js', '.min.js')}`);
        return `${a}${file}.min.js${b}`;
    });

    log(name, `Removing development only codes.`);
    code = code.replace("const __DEV__ = true;", "const __DEV__ = false;");

    return code;
}

async function doWorkJS(file, rel, out) {
    const start = performance.now();
    if (file.includes("env")) return;
    
    out = out.replace(/\.js$/, ".min.js");

    let code = await fs.readFile(file, "utf8");

    log(rel, `Modifying scripts`);
    code = rewriteJS(code, rel);
    
    try {
        log(rel, `Minifying`);
        const minified = await terser.minify(code);
        if (!minified.code) throw new Error("Terser minification returned empty code.");
        
        code = minified.code.replace(/const\s+__DEV__\s*=\s*(?:!0|!1|true|false);?/g, "");
        
        if (!isTest) await fs.outputFile(out, code);
        const end = performance.now() - start;
        log(rel, `${isTest ? "FINISHED" : "copied to dist"} (took ${end.toFixed(2)}ms ✅)`);
    } catch (err) {
        config.errorCode = 1;
        log(rel, `Error Minifying\n[${err}]`);
    }
}

export default doWorkJS;