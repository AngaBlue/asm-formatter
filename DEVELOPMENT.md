# Development
## Setup
### Install dependencies
Dependencies are managed using [npm](https://www.npmjs.com/). The `vsce` package does not work well with other package managers.

```bash
npm install
```

### Install VSCode
Install the latest version of [Visual Studio Code](https://code.visualstudio.com/).

## Test
Test the extension by opening the project folder in VSCode and pressing <kbd>F5</kbd>. This will open a new VSCode window known as the Extension Development Host with the extension enabled.

<kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>F</kbd> will format the file in the active editor, allowing you to test the formatter on the provided files in the `./test` directory.

## Reloading Changes
After applying changes to the extension, you can reload the Extension Development Host by pressing <kbd>Ctrl</kbd> + <kbd>R</kbd> in the Extension Development Host window.  You do not need to build the extension to reload changes, as there is a watcher that will automatically rebuild the extension.

## Publishing
### Versioning
Before publishing, update the version according to [Semantic Versioning](https://semver.org/). This can be done by running the following command:

```bash
npm version patch|minor|major
```

### Publishing
Publish the extension to the [VSCode Marketplace](https://marketplace.visualstudio.com/).

```bash
vsce publish
```
