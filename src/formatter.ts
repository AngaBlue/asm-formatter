import { Position, Range, TextDocument, TextEdit } from 'vscode';
import Line from './Line.js';

// Tab size of 4 spaces
const TAB_SIZE = 4;
const TAB = ' '.repeat(TAB_SIZE);

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
    let longestLabel = 0;
    let longestDirective = 0;
    for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        if (line.label && !line.directive && firstLabel === null) firstLabel = index;

        // For each argument, find the largest argument width out of each line
        if (line.arguments && !line.directive) {
            for (let arg = 0; arg < line.arguments.length; arg++) {
                // Argument width + 2 (for ',' and ' ')
                const width = line.arguments[arg].length + 2;
                if (width > widths[arg]) widths[arg] = width;
            }
        }

        // Label & Directive
        if (line.label && line.directive) {
            // Label
            let width = line.label.length;
            if (width > longestLabel) longestLabel = width;

            // Directive
            width = line.directive.length;
            if (width > longestDirective) longestDirective = width;
        }
    }

    // Normalize widths to a multiple of tab size
    widths = widths.map(w => Math.ceil(w / TAB_SIZE) * TAB_SIZE);
    longestLabel = Math.floor(longestLabel / TAB_SIZE + 1) * TAB_SIZE;
    longestDirective = Math.floor(longestDirective / TAB_SIZE + 1) * TAB_SIZE;

    /**
     * Format Lines
     */
    const textSectionIndex = lines.findIndex(line => line.directive === '.text');
    const edits = lines.map((line, index) => {
        let result = '';

        // Label
        if (line.label) result += line.label.padEnd(longestLabel, ' ');

        // Indentation
        if (index < textSectionIndex && !line.label && line.directive && line.directive !== '.data') result = result.padEnd(longestLabel, ' ');

        // Directive
        if (line.directive) result += index < textSectionIndex ? line.directive.padEnd(longestDirective, ' ') : line.directive;

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
                    arg += ', ';
                    if (!line.directive) arg = arg.padEnd(widths[index], ' ');
                }

                result += arg;
            });
        }

        return result;
    });

    // Longest line
    let longestLine = edits.reduce((length, line) => (line.length > length ? line.length : length), 0);
    longestLine = Math.floor(longestLine / TAB_SIZE + 1) * TAB_SIZE;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.comment) continue;

        if (!line.label && !line.directive && !line.instruction) edits[i] = TAB + line.comment;
        else if (line.label && line.directive && line.instruction) edits[i] += ` ${line.comment}`;
        else edits[i] = edits[i].padEnd(longestLine, ' ') + line.comment;
    }

    // Commit edits
    const range = new Range(new Position(0, 0), document.lineAt(document.lineCount - 1).range.end);
    return [TextEdit.replace(range, edits.join('\n'))];
}
