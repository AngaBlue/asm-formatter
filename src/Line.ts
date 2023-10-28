import { TextLine } from 'vscode';

export default class Line {
    private static patterns = {
        label: /^\w+:/,
        directive: /^\.\w+/,
        arg: /[\s,]+/,
        string: /^"([^"\\]*(?:\\.[^"\\]*)*)"/,
        comment: /[#;].+/
    };

    directive?: string;

    data?: string;

    label?: string;

    instruction?: string;

    arguments?: string[];

    comment?: string;

    constructor(line: TextLine) {
        // Trim the line
        let text = line.text.trim();

        // Label
        let match = text.match(Line.patterns.label);
        if (match) {
            this.label = match.at(0);
            text = text.slice(this.label.length).trimStart();
        }

        // Directive
        match = text.match(Line.patterns.directive);
        if (match) {
            this.directive = match.at(0);
            text = text.slice(this.directive.length).trimStart();
        }

        // String literal
        match = text.match(Line.patterns.string);
        if (match) {
            this.arguments = [match.at(0)];
            text = text.slice(this.arguments[0].length).trimStart();
        }

        // Comment separator
        match = text.match(Line.patterns.comment);
        if (match) {
            this.comment = match.at(0);
            text = text.slice(0, match.index).trimEnd();
        }

        // Instruction & Arguments
        const args = text.split(Line.patterns.arg).filter(a => a);
        if (!this.directive) this.instruction = args.shift();

        // Save arguments
        if (this.arguments) this.arguments.push(...args);
        else this.arguments = args;
    }
}
