"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
// Cargar código C++ desde un archivo externo
var inputPath = path.join(__dirname, 'codigo.cpp');
var code = fs.readFileSync(inputPath, 'utf-8');
// Categorías léxicas
var keywords = new Set(['int', 'str', 'bool', 'char', 'float', 'void', 'if', 'else', 'for', 'while', 'do', 'switch', 'case']);
var operators = new Set(['=', '+', '-', '*', '/', '%', '//', '**', '&', '&&', '|', '||', '!', '==']);
var functions = new Set(['void', 'int', 'bool', 'string', 'float']);
var loops = new Set(['for', 'while', 'do']);
var conditionals = new Set(['if', 'else', 'else if', 'switch', 'case']);
var numberPattern = /^\d+(\.\d+)?$/;
var identifierPattern = /^[a-zA-Z_]\w*$/;
// Función para analizar tokens
function analyzeToken(token) {
    if (keywords.has(token)) {
        return "<span class=\"keyword\">".concat(token, "</span>");
    }
    else if (functions.has(token)) {
        return "<span class=\"function\">".concat(token, "</span>");
    }
    else if (loops.has(token)) {
        return "<span class=\"loop\">".concat(token, "</span>");
    }
    else if (conditionals.has(token)) {
        return "<span class=\"conditional\">".concat(token, "</span>");
    }
    else if (operators.has(token)) {
        return "<span class=\"operator\">".concat(token, "</span>");
    }
    else if (numberPattern.test(token)) {
        return "<span class=\"number\">".concat(token, "</span>");
    }
    else if (identifierPattern.test(token)) {
        return "<span class=\"identifier\">".concat(token, "</span>");
    }
    else {
        return "<span class=\"unknown\">".concat(token, "</span>");
    }
}
// Análisis del código
var tokens = code.match(/\w+|[=+\-*/%&|!]+/g) || [];
var highlightedCode = tokens.map(analyzeToken).join(' ');
// Generación de HTML con estilos
var htmlContent = "\n<!DOCTYPE html>\n<html lang=\"es\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>An\u00E1lisis L\u00E9xico de C++</title>\n    <style>\n        body { font-family: Consolas, monospace; background: #1E1E1E; color: #D4D4D4; padding: 20px; }\n        pre { padding: 10px; background: #252526; border-radius: 5px; }\n        .keyword { color: #569CD6; font-weight: bold; }\n        .function { color: #DCDCAA; }\n        .loop { color: #C586C0; }\n        .conditional { color: #9CDCFE; }\n        .operator { color: #CE9178; }\n        .number { color: #B5CEA8; }\n        .identifier { color: #D4D4D4; }\n        .unknown { color: #F44747; }\n    </style>\n</head>\n<body>\n    <pre>".concat(highlightedCode, "</pre>\n</body>\n</html>\n");
// Escribir archivo de salida
var outputPath = path.join(__dirname, 'resultado.html');
fs.writeFileSync(outputPath, htmlContent);
console.log("El archivo HTML se ha generado exitosamente en ".concat(outputPath));
