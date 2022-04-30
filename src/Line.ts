import { Range, TextLine } from 'vscode';

export enum LineType {
    BLANK,
    COMMENT,
    CODE
}

export default class Line {
    static labelPattern = /^\w+:$/;

    range: Range;

    directive?: string;

    label?: string;

    instruction?: string;

    arguments?: string[];

    comment?: string;

    type = LineType.BLANK;

    constructor(line: TextLine) {
        this.range = line.range;

        const [text, ...comment] = line.text.trim().split('#');
        this.comment = comment.join('#').trim();

        if (!text) this.type = this.comment ? LineType.COMMENT : LineType.BLANK;
        else this.type = LineType.CODE;

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

        // Code
        const [instruction, ...args] = text.split(/[\s,]+/);
        this.instruction = instruction;
        this.arguments = args.filter(a => a);
    }
}
