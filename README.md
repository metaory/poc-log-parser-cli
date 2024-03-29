# poc-log-parser-cli 

Includes:

- [TypeScript](https://www.typescriptlang.org/), for writing good code
- [Ava](https://www.npmjs.com/package/ava), for writing good tests
- [Commander](https://www.npmjs.com/package/commander), for building CLI applications
- [Pkg](https://www.npmjs.com/package/pkg), for building cross-platform native executables

## Usage

`parser --input <path> --output <path>`

### **dev**

`npm run dev`

Runs the CLI application.

`npm run dev --input ./data/sample --output ./errors.json`

### **clean**

`npm run clean`

Removes any built code and any built executables.

### **build**

`npm run build`

`node dist/cli.js --input ./data/sample --output ./errors.json`

Cleans, then builds the TypeScript code.

Your built code will be in the `./dist/` directory.

`node dist/cli.js --input ./data/sample --output ./errors.json`

### **test**

`npm run test`

Cleans, then builds, and tests the built code.

### **bundle**

`npm run bundle`

Cleans, then builds, then bundles into native executables for Windows, Mac, and Linux.

Your shareable executables will be in the `./exec/` directory.

`./exec/getmayd-log-parser-cli-linux --input ./data/sample --output errors.json`
