import { isTest } from "./config.js";

function log(file, text) {
    let output;
    if(file) {
        if(file.endsWith(".js")) {
            output = `\x1b[33m[${isTest ? "TEST:" : ""}JavaScript]\x1b[0m ${file} -> ${text}`
        } else if(file.endsWith(".css")) {
            output = `\x1b[36m[${isTest ? "TEST:" : ""}Cascading Style Sheet]\x1b[0m ${file} -> ${text}`
        } else if(file.endsWith(".html")) {
            output = `\x1b[38;5;208m[${isTest ? "TEST:" : ""}Hyper Text Markup Language]\x1b[0m ${file} -> ${text}`
        } else output = `\x1b[32m[ASSETS]\x1b[0m ${file} -> ${text}`;
    } else {
        output = `[SYSTEM] ${text}`;
    }
    console.log(output);
}

export default log;