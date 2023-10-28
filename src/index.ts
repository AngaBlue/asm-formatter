import { languages } from 'vscode';
import formatter from './formatter.js';

// eslint-disable-next-line import/prefer-default-export
export function activate() {
    languages.registerDocumentFormattingEditProvider('mips', {
        provideDocumentFormattingEdits: formatter
    });
}
