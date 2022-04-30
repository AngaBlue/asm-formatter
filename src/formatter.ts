import { TextDocument, TextEdit } from 'vscode';
import Line from './Line';
import LineType from './LineType';

// Tab size of 4 spaces
const TAB = '    ';
const TAB_SIZE = TAB.length;

export default function formatter(document: TextDocument): TextEdit[] {
    /**
     * Construct Lines
     */

    const lines = [];
    for (let line = 0; line < document.lineCount; line++) {
        lines.push(new Line(document.lineAt(line)));
    }

    /**
     * Calculate Widths & Indentations
     */

    let widths = [0, 0, 0]; // Largest MIPS instruction has 3 arguments
    let firstLabel: number | null = null;
    for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        if (line.label && firstLabel === null) firstLabel = index;

        // For each argument, find the largest argument width out of each line
        if (line.arguments) {
            for (let arg = 0; arg < line.arguments.length; arg++) {
                // Argument width + 2 (for ',' and ' ')
                const width = line.arguments[arg].length + 2;
                if (width > widths[arg]) widths[arg] = width;
            }
        }
    }

    // Normalize widths to a multiple of tab size
    widths = widths.map(w => Math.ceil(w / TAB_SIZE) * TAB_SIZE);

    // Find largest comment indentation
    let commentIndentation = 2 * TAB_SIZE; // 2 tabs for instruction
    if (firstLabel !== null) commentIndentation += TAB_SIZE;
    commentIndentation += widths.reduce((sum, width) => sum + width, 0);

    /**
     * Format Lines
     */

    let prevLineIndented = false;
    const edits = lines.map(line => {
        let result = '';

        // Directive
        if (line.directive) result += line.directive;

        // Label
        if (line.label) result += line.label;

        // Instruction
        if (line.instruction) {
            if (firstLabel !== null) result += TAB;
            result += line.instruction.padEnd(2 * TAB_SIZE, ' ');
        }

        // Arguments
        if (line.arguments) {
            line.arguments.forEach((arg, index) => {
                if (index !== line.arguments.length - 1) {
                    // Join and pad arguments
                    arg += ',';
                    arg = arg.padEnd(widths[index], ' ');
                }

                result += arg;
            });
        }

        // Comment
        switch (line.type) {
            case LineType.BLANK:
                prevLineIndented = false;
                break;
            case LineType.COMMENT:
                // If last line wasn't indented
                if (prevLineIndented) {
                    // Indent comment
                    result = `${result.padEnd(commentIndentation, ' ')}${line.comment}`;
                    prevLineIndented = true;
                } else {
                    // Don't indent comment
                    result = line.comment;
                }
                break;
            case LineType.CODE:
                result = `${result.padEnd(commentIndentation, ' ')}${line.comment}`;
                prevLineIndented = true;
                break;
        }

        return TextEdit.replace(line.range, result);
    });

    return edits;
}
