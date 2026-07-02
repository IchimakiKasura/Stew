import fs from "fs-extra";
import path from "node:path";
import config from "./config.js";
import bundleCSS from "./work/bundleCSS.js";
import proc from "./process.js";

async function timeTaken(rel, fn, isCompiling) {
    if(isCompiling) log(rel, 'Minifying');
    const start = performance.now();
    await fn();
    log(rel, `${config.mode.isTest ? "FINISHED" : "copied to dist"} (took ${(performance.now() - start).toFixed(2)}ms ✅)`);
}

async function navigate(dir) {
    for (const f of await fs.readdir(dir)) {
        const full = path.join(dir, f);

        if ((await fs.stat(full)).isDirectory()) {
            await navigate(full);
        } else {
            await proc(full);
        }
    }
}

function log(file, text) {
    let output;
    let testTxt = config.mode.isTest ? "TEST:" : "";
    if(file) {
        if(file.endsWith(".js")) {
            output = `\x1b[33m[${testTxt}JavaScript]\x1b[0m ${file} -> ${text}`
        } else if(file.endsWith(".css")) {
            output = `\x1b[36m[${testTxt}Cascading Style Sheet]\x1b[0m ${file} -> ${text}`
        } else if(file.endsWith(".html")) {
            output = `\x1b[38;5;208m[${testTxt}Hyper Text Markup Language]\x1b[0m ${file} -> ${text}`
        } else output = `\x1b[32m[ASSETS]\x1b[0m ${file} -> ${text}`;
    } else {
        output = `[SYSTEM] ${text}`;
    }
    console.log(output);
}

(async () => {
    log(null, `StewJS bundler/compiler :>`);

    const start = performance.now();
    if(config.mode.isProd) {
        log(null, `Building live production files`);
    } else if (config.mode.isDev) {
        log(null, `Building development production files`);
    } else if(!config.mode.isTest){
        log(null, `No chosen option: '--dev', '--prod', '--test'`);
    }

    log(null, `Build start`);

    if (!config.mode.isTest) {
        log(null, `Removing files`);
        await fs.remove(config.dist);
        await fs.ensureDir(config.dist);
    } else {
        log(null, `Test Building, NO OUTPUTS WILL BE BUILT! ASSETS WILL BE SKIPPED!`);
    }

    if (!config.mode.isDev) {
      log(null, `Bundling CSS Files`);
      await bundleCSS();
    }

    await navigate(config.src);
    const end = performance.now() - start;
    log(null, `Build ${config.errorCode === 0 ? "Done!" : "Failed"} (took ${end.toFixed(2)}ms ${config.errorCode === 0 ? "✅" : "❌"})`);
    
    process.exitCode = config.errorCode;
})();

globalThis.timeTaken = timeTaken;
globalThis.log = log;