import { Range, TextLine } from 'vscode';
import LineType from './LineType.js';

export default class Line {
    static labelPattern = /^\w+:/;

    static argPattern = /[\s,]+/;

    type = LineType.BLANK;

    range: Range;

    directive?: string;

    label?: string;

    instruction?: string;

    arguments?: string[];

    comment?: string;

    constructor(line: TextLine) {
        this.range = line.range;

        // Find the comment separator and make sure it is not inside a string literal
        let quoted = false;
        let text = '';
        for (let i = 0; i < line.text.length; i++) {
            const char = line.text[i];

            switch (char) {
                case '"': {
                    if (quoted) {
                        quoted = false;
                    } else {
                        let escaped = false;
                        // Check if escaped
                        for (let j = i - 1; j >= 0; j--) {
                            if (line.text[j] === '\\') {
                                escaped = !escaped;
                            } else {
                                break;
                            }
                        }

                        // Only mark as quoted if not escaped
                        if (!escaped) quoted = true;
                    }
                    break;
                }
                case '#':
                case ';': {
                    if (!quoted) {
                        // Set comment
                        const comment = line.text.substring(i + 1).trim();
                        if (comment) this.comment = `${char} ${comment}`;

                        // Set text, the rest of the line to be parsed
                        text = line.text.substring(0, i).trim();
                        break;
                    }
                }
            }
        }

        // Set text if no comment is found
        if (!this.comment) text = line.text.trim();

        // Set type
        if (!text) {
            this.type = this.comment ? LineType.COMMENT : LineType.BLANK;
        } else {
            this.type = LineType.CODE;
        }

        // Assembler directive
        if (text.startsWith('.')) {
            this.directive = text.trim();
            return;
        }

        // Label
        if (text.match(Line.labelPattern)) {
            this.label = text.trim();
            return;
        }

        // Instruction & Arguments
        const [instruction, ...args] = text.split(Line.argPattern);
        this.instruction = instruction;

        // Filter out empty arguments
        this.arguments = args.filter(a => a);
    }
}
