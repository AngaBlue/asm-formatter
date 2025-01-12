import type { TextLine } from 'vscode';

type LineProperty = 'directive' | 'data' | 'label' | 'instruction' | 'arguments' | 'comment';

export default class Line {
	private static patterns = {
		label: /^\w+:/,
		directive: /^\.\w+/,
		arg: /(?<!')\,(?!')/,
		string: /^"([^"\\]*(?:\\.[^"\\]*)*)"/,
		comment: /[#;].+/
	};

	directive?: string;

	data?: string;

	label?: string;

	instruction?: string;

	arguments?: string[];

	comment?: string;

	/**
	 * Check if the line has a property after the property of comparison.
	 * @param property The property to check for.
	 * @returns If the line has the property after the property of comparison.
	 */
	hasPropertyAfter = (property: LineProperty) => {
		// If the property doesn't exist, return false
		if (!this[property]) return false;

		// Get the index of the property of comparison
		const properties = ['label', 'directive', 'data', 'instruction', 'arguments', 'comment'];
		const index = properties.indexOf(property);

		// Check if there are any properties after the property of comparison
		return properties
			.slice(index + 1)
			.some(p => (Array.isArray(this[p as LineProperty]) ? this[p as LineProperty]?.length : this[p as LineProperty]));
	};

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
			text = text.slice(this.arguments[0].length);
		}

		// Comment separator
		match = text.match(Line.patterns.comment);
		if (match) {
			this.comment = match.at(0);
			text = text.slice(0, match.index).trimEnd();
		}

		// Instruction & Arguments
		const args = text
			.split(Line.patterns.arg)
			.map(a => a.trim())
			.filter(a => a);
		if (!this.directive && args.length > 0) {
			const [instruction, arg] = args.shift().split(/\s+/);
			this.instruction = instruction;
			if (arg) args.unshift(arg);
		}

		// Save arguments
		if (this.arguments) this.arguments.push(...args);
		else this.arguments = args;
	}
}
