# Development
## Setup
### Install dependencies
Dependencies are managed using [npm](https://www.npmjs.com/). The `vsce` package does not work well with other package managers.

```bash
npm install
```

### Install VSCode
Install [Visual Studio Code](https://code.visualstudio.com/).

### Disable Installed Extension
Disable the installed extension to avoid conflicts.  You can do this by navigating to the extensions tab (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>X</kbd>) and clicking the disable button on `AngaBlue.asm-formatter`.

## Build
Run the build script with file watching to build the extension whenever changes are made to the source code.

```bash
npm run watch
```

## Test
Test the extension by opening the project folder in VSCode and pressing <kbd>F5</kbd>. This will open a new VSCode window known as the Extension Development Host with the extension enabled.

<kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>F</kbd> will format the file in the active editor, allowing you to test the formatter on the provided files in the `./test` directory.

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
