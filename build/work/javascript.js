const fs = require("fs-extra");
const terser = require("terser");
const { isProd, isTest } = require("../config");
const config = require("../config"); // only used for errorCode variable


function rewriteJS(code, name) {

    code = code.replace(/(from\s+["'])([^"']+)\.js(["'])/g, (_, a, file, b) => {
        console.log(`\x1b[33m[${isTest?"TEST:":""}JavaScript]\x1b[0m ${name} -> Renaming script imports ${file.replace('.js', '.min.js')}`);
        return `${a}${file}.min.js${b}`;
    });

    console.log(`\x1b[33m[${isTest?"TEST:":""}JavaScript]\x1b[0m ${name} -> Removing development only codes.`);
    code = code.replace("const __DEV__ = true;", "const __DEV__ = false;");

    return code;
}

async function doWorkJS(file, rel, out) {
    const start = performance.now();
    if(file.match("env")) return;
    
    out = out.replace(/\.js$/, ".min.js");

    let code = await fs.readFile(file, "utf8");

    console.log(`\x1b[33m[${isTest?"TEST:":""}JavaScript]\x1b[0m ${rel} -> Modifying scripts`);
    code = rewriteJS(code, rel);
    
    console.log(`\x1b[33m[${isTest?"TEST:":""}JavaScript]\x1b[0m ${rel} -> Minifying`);
    try {
        code = ((await terser.minify(code)).code).replace(/const\s+__DEV__\s*=\s*(?:!0|!1|true|false);?/g, "");
        if(!isTest) await fs.outputFile(out, code);
        const end = performance.now() - start;
        console.log(`\x1b[33m[${isTest?"TEST:":""}JavaScript]\x1b[0m ${rel} -> ${isTest?"FINISHED":"copied to dist"} (took ${end.toFixed(2)}ms ✅)`);
    } catch(err) {
        config.errorCode = 1;
        console.log(`\x1b[33m[${isTest?"TEST:":""}JavaScript]\x1b[0m ${rel} -> Error Minifying\n[${err}]`);
    }
}

module.exports = doWorkJS;