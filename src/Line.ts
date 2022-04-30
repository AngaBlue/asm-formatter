import { Range, TextLine } from 'vscode';
import LineType from './LineType';

export default class Line {
    static labelPattern = /^\w+:$/;

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

        const [text, ...comment] = line.text.trim().split('#');
        this.comment = comment.join('#').trim();

        // Set type
        if (!text) {
            this.type = this.comment ? LineType.COMMENT : LineType.BLANK;
        } else {
            this.type = LineType.CODE;
        }

        // Comment
        if (this.comment) this.comment = `# ${this.comment}`;

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
