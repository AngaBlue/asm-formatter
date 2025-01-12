import { languages } from 'vscode';
import formatter from './formatter.js';

export function activate() {
	languages.registerDocumentFormattingEditProvider('mips', {
		provideDocumentFormattingEdits: formatter
	});
}
