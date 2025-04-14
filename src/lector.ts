// Importaciopn de las librerias para poder leer y crear archivos y manejar las rutas
import * as fs from 'fs';
import * as path from 'path';

// Rutasa de las archivos de entrada y salida
const inputPath = path.join(__dirname, '..', 'input.txt');
const outputPath = path.join(__dirname, '..', 'resultado.html');
const code = fs.readFileSync(inputPath, 'utf-8'); // Se define el tipo de entrada del archivo como texto

// Definición de las palabras reservadas de c++
const reservetWords = new Set([
    'int', 'float', 'double', 'char', 'void', 'bool', 'short', 'long', 
    'if', 'else', 'switch', 'case', 'default', 'for', 'while', 'do', 
    'break', 'continue', 'return', 'try', 'catch', 'throw', 'new', 'delete',
    'namespace', 'using', 'true', 'false', 'nullptr', 'auto'
]);

// Definicion de los tipos de variables
const variablesTypes = new Set([
    'int', 'float', 'double', 'char', 'void', 'bool', 'short', 'long'
]);

// Definicio de los tipos de operadores logicos y aritmeticos
const operators = new Set([
    '=', '+', '-', '*', '/', '%', '++', '--', '==', '!=', '>', '<', '>=', '<=',
    '&&', '||', '!', '&', '|', '^', '~', '<<', '>>', '+=', '-=', '*=', '/=', 
    '%=', '&=', '|=', '^=', '<<=', '>>=', '->', '.', '::', '?', ':'
]);

// Definicion de las importaciones de las librerias principaesles de c++
const imports = new Set(['#include', '#define', '#ifdef', '#ifndef', '#endif']);

// Funciones comunes y objetos de c++
const functions = new Set(['main', 'cout', 'cin', 'endl']);

// Elementos de la biblioteca baicas
const standardLibrary = new Set(['std', 'string', 'vector', 'map', 'set']);

// Expresiones regulares mejoradas

// patron para numeros enteros, decimales, hexadecimales
const numberPattern = /^(?:0[xX][0-9a-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)[uUlLfF]*/;

// Patron para cadenas de texto entre comillas dobles
const stringLiteralPattern = /^"(?:\\.|[^"\\])*"/;

// Patrones para cadenas de caracteres entre comillas
const charLiteralPattern = /^'(?:\\.|[^'\\])'/;

// Patrones para cadenas en comentarios (// o /* */)
const commentPattern = /^\/\/.*|\/\*[\s\S]*?\*\//;

// Patrones idetificadores como nombnbres de variables, funciones y etc.
const identifierPattern = /^[a-zA-Z_]\w*/;

/*
 * Función para escapar caracteres especiales en HTML
 * @param unsafe Texto que puede contener caracteres especiales
 * @returns Texto seguro para usar en HTML
 */
function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/*
 * Función que analiza el código fuente y genera HTML con resaltado de sintaxis
 * @param code Código fuente a analizar
 * @returns Código HTML con el resaltado aplicado
 */
function analyzeCode(code: string): string {
    let result = ''; // variable para guardar el resultado html
    let i = 0; // variable para poder recorrer el codigo
    const n = code.length; // Longitud del codigo

    // Recorrer el codido caracter por caracter
    while (i < n) {
        const char = code[i];

        // Manejar espacios en blanco y saltos de línea
        if (/\s/.test(char)) {
            // Convertir el salto de linea en br
            if (char === '\n') {
                result += '<br>';
            // Convertir los tabs en 4 espacios 
            } else if (char === '\t') {
                result += '&nbsp;&nbsp;&nbsp;&nbsp;';
            // otro tipo de espacio tambien se convierte en espacio pero de 1
            } else {
                result += '&nbsp;';
            }
            i++;
            continue;
        }

        // Manejar comentarios
        if (char === '/' && i + 1 < n && (code[i+1] === '/' || code[i+1] === '*')) {
            const isLineComment = code[i+1] === '/'; // ¿Es comentario de línea (//)?
            let comment = char + code[i+1]; // Empezamos el comentario
            i += 2; // Avanzamos 2 caracteres (el / y el / o *)

            if (isLineComment) {
                // Comentario de línea: va hasta el final de la línea
                while (i < n && code[i] !== '\n') {
                    comment += code[i];
                    i++;
                }
            } else {
                // Comentario de bloque: va hasta encontrar */
                while (i + 1 < n && !(code[i] === '*' && code[i+1] === '/')) {
                    comment += code[i];
                    i++;
                }
                if (i + 1 < n) {
                    comment += code[i] + code[i+1]; // Agregamos el */ de cierre
                    i += 2;
                }
            }

            // Se ingresa el comentario al archivo con el respectivo estilo que le corresponde
            result += `<span class="comment" style="background-color: rgba(106, 153, 85, 0.3);">${escapeHtml(comment)}</span>`;
            continue;
        }

        // Manejo de comillas de texto entre comillas cobles
        if (char === '"') {
            let str = char;
            i++;
            while (i < n && code[i] !== '"') {
                if (code[i] === '\\' && i + 1 < n) {
                    str += code[i] + code[i+1];
                    i += 2;
                } else {
                    str += code[i];
                    i++;
                }
            }
            if (i < n) {
                str += code[i];
                i++;
            }
            result += `<span class="string" style="background-color: rgba(206, 145, 120, 0.3);">${escapeHtml(str)}</span>`;
            continue;
        }

        // Manejo de comillas de texto entre comillas simples
        if (char === "'") {
            let chr = char;
            i++;
            while (i < n && code[i] !== "'") {
                if (code[i] === '\\' && i + 1 < n) {
                    chr += code[i] + code[i+1];
                    i += 2;
                } else {
                    chr += code[i];
                    i++;
                }
            }
            if (i < n) {
                chr += code[i];
                i++;
            }
            result += `<span class="char" style="background-color: rgba(206, 145, 120, 0.3);">${escapeHtml(chr)}</span>`;
            continue;
        }

        // Manejar números
        if (/[0-9]/.test(char)) {
            let num = '';
            while (i < n && /[0-9a-fA-F.xX]/.test(code[i])) {
                num += code[i];
                i++;
            }
            result += `<span class="number" style="background-color: rgba(181, 206, 168, 0.3);">${escapeHtml(num)}</span>`;
            continue;
        }

        // Manejo de las importascines (comienzan con #)
        if (char === '#') {
            let directive = char;
            i++;
            while (i < n && /[a-zA-Z]/.test(code[i])) {
                directive += code[i];
                i++;
            }
            result += `<span class="imports" style="background-color: rgba(155, 155, 155, 0.3);">${escapeHtml(directive)}</span>`;
            continue;
        }

        // Manejar operadores logicos y aritmeticos
        if (/[+\-*\/%=&|<>!?:.]/.test(char)) {
            let op = char;
            i++;
            // Verificar operadores de 2 o 3 caracteres
            if (i < n && /[=+&|<>*]/.test(code[i])) {
                const potentialOp = char + code[i];
                if (operators.has(potentialOp)) {
                    op = potentialOp;
                    i++;
                    // Verificar operadores de 3 caracteres (como >>=)
                    if (i < n && code[i] === '=' && operators.has(op + '=')) {
                        op += '=';
                        i++;
                    }
                }
            }
            result += `<span class="operator" style="background-color: rgba(212, 212, 212, 0.3);">${escapeHtml(op)}</span>`;
            continue;
        }

        // Manejo de los identificadores com funciones y variables
        if (/[a-zA-Z_]/.test(char)) {
            let word = '';
            while (i < n && /[a-zA-Z0-9_]/.test(code[i])) {
                word += code[i];
                i++;
            }

            // Se determinan el tipo de variable para poder mandarle el color correspondiente
            let cssClass = 'identifier';
            let bgColor = 'rgba(212, 212, 212, 0.1)';

            if (reservetWords.has(word)) {
                cssClass = 'keyword';
                bgColor = 'rgba(86, 156, 214, 0.3)';
            } else if (variablesTypes.has(word)) {
                cssClass = 'type';
                bgColor = 'rgba(78, 201, 176, 0.3)';
            } else if (functions.has(word)) {
                cssClass = 'function';
                bgColor = 'rgba(220, 220, 170, 0.3)';
            } else if (standardLibrary.has(word)) {
                cssClass = 'library';
                bgColor = 'rgba(197, 134, 192, 0.3)';
            }

            // Agergamos el identificador al resultado con su estilo
            result += `<span class="${cssClass}" style="background-color: ${bgColor};">${escapeHtml(word)}</span>`;
            continue;
        }

        // Caracteres no reconocidos (Si no pueden ser identificados estos se marcaran de rojos)
        result += `<span style="background-color: rgba(244, 71, 71, 0.2);">${escapeHtml(char)}</span>`;
        i++;
    }
    return result;
}

const highlightedCode = analyzeCode(code);

// Plantilla de html con los estilos css y el codigo resaltado
const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Análisis Léxico de C++ con Resaltado</title>
    <style>
        body {
            font-family: Consolas, monospace;
            background: #1E1E1E;
            color: #D4D4D4;
            padding: 20px;
            line-height: 1.5;
        }
        pre {
            padding: 15px;
            background: #252526;
            border-radius: 5px;
            tab-size: 4;
            white-space: pre;
            overflow-x: auto;
        }
        .keyword {
            color: #569CD6;
            font-weight: bold;
        }
        .type {
            color: #4EC9B0;
        }
        .operator {
            color: #D4D4D4;
        }
        .number {
            color: #B5CEA8;
        }
        .string, .char {
            color: #CE9178;
        }
        .comment {
            color: #6A9955;
            font-style: italic;
        }
        .imports {
            color: #9B9B9B;
            font-style: italic;
        }
        .function {
            color: #DCDCAA;
        }
        .library {
            color: #C586C0;
        }
        .identifier {
            color: #D4D4D4;
        }
        span:hover {
            outline: 1px solid #264F78;
            border-radius: 2px;
        }
    </style>
</head>
<body>
    <pre>${highlightedCode}</pre>
</body>
</html>
`;

// Se escribe el archivo html en el anterior creado
fs.writeFileSync(outputPath, htmlContent);
console.log(`El archivo HTML se ha generado exitosamente en ${outputPath}`);