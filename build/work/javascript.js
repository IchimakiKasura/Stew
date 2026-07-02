import fs from "fs-extra";
import * as terser from "terser";
import config from "../config.js";

function rewriteJS(code, name) {
    code = code.replace(/(from\s+["'])([^"']+)\.js(["'])/g, (_, a, file, b) => {
        log(name,`Renaming script imports ${file.replace('.js', '.min.js')}`);
        return `${a}${file}.min.js${b}`;
    });

    log(name, `Removing development only codes.`);
    code = code.replace("const __DEV__ = true;", "const __DEV__ = false;");

    return code;
}

async function compileJS(file, rel, out) {
    if (file.includes("env")) return;
    
    out = out.replace(/\.js$/, ".min.js");

    let code = await fs.readFile(file, "utf8");

    code = rewriteJS(code, rel);
    
    try {
        const minified = await terser.minify(code);
        if (!minified.code) throw new Error("Terser minification returned empty code.");
        
        code = minified.code.replace(/const\s+__DEV__\s*=\s*(?:!0|!1|true|false);?/g, "");
        
        if (!config.mode.isTest) await fs.outputFile(out, code);
        
    } catch (err) {
        config.errorCode = 1;
        log(rel, `Error Minifying\n[${err}]`);
    }
}

export default compileJS;