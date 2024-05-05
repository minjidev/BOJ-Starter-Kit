import { defineConfig } from "@vscode/test-cli";

export default defineConfig({
  label: "SetupProblemTest",
  files: "out/test/**/*.test.js",
  workspaceFolder: "./src/test/testFixtures/testWorkspace",
  mocha: {
    ui: "bdd",
    timeout: 20000,
  },
});
