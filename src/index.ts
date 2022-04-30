/* eslint-disable no-continue */
import * as vscode from 'vscode';
import Line, { LineType } from './Line';

// eslint-disable-next-line import/prefer-default-export
export function activate() {
    vscode.languages.registerDocumentFormattingEditProvider('mips', {
        // eslint-disable-next-line consistent-return
        provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
            const lines = [];
            const edits: vscode.TextEdit[] = [];

            let firstLabel = -1;
            let widths = [0, 0, 0];

            // Construct lines
            for (let i = 0; i < document.lineCount; i++) {
                const line = document.lineAt(i);
                lines.push(new Line(line));
            }

            // Find widths & indentations
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.label && firstLabel === -1) firstLabel = i;

                // Find largest arg width
                if (line.arguments) {
                    // eslint-disable-next-line @typescript-eslint/no-loop-func
                    line.arguments.forEach((a, index) => {
                        // 1 comma, 1 space
                        const width = a.length + 2;
                        if (width > widths[index]) widths[index] = width;
                    });
                }
            }

            // Normalize widths to multiple of 4
            widths = widths.map(w => Math.ceil(w / 4) * 4);

            // Find comment indentation, minimum 8 to account for instruction
            let commentIndentation = 8;
            if (firstLabel !== -1) commentIndentation += 4;
            // eslint-disable-next-line no-return-assign
            commentIndentation += widths.reduce((sum, w) => sum + w, 0);

            // Format lines
            let previousIndented = false;
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                let result = '';

                if (line.directive) result += line.directive;

                if (line.label) result += line.label;

                if (line.instruction) {
                    if (firstLabel !== -1) result += '    ';
                    result += line.instruction.padEnd(8, ' ');
                }

                if (line.arguments) {
                    // eslint-disable-next-line @typescript-eslint/no-loop-func
                    line.arguments.forEach((a, index) => {
                        let arg = a;
                        if (index !== line.arguments.length - 1) {
                            arg += ',';
                            arg = arg.padEnd(widths[index], ' ');
                        }
                        result += arg;
                    });
                }

                if (line.comment) {
                    if (line.type === LineType.COMMENT && !previousIndented) {
                        result = `# ${line.comment}`;
                    } else {
                        previousIndented = true;
                        result = `${result.padEnd(commentIndentation, ' ')}# ${line.comment}`;
                    }
                }

                if (line.type === LineType.BLANK) previousIndented = false;
                if (line.type === LineType.CODE) previousIndented = true;

                edits.push(vscode.TextEdit.replace(line.range, result));
            }

            return edits;
        }
    });
}
