import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const ts = require("typescript");

require.extensions[".ts"] = (module, filename) => {
  const source = require("node:fs").readFileSync(filename, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2023,
    },
  });
  module._compile(outputText, filename);
};

const { convertBlockToHtml } = require("../src/lib/notion/block-converter.ts");

test("renders Notion inline code rich text as code markup", async () => {
  const html = await convertBlockToHtml({
    type: "paragraph",
    paragraph: {
      rich_text: [
        {
          type: "text",
          plain_text: ".env",
          annotations: { code: true },
        },
        {
          type: "text",
          plain_text: " should stay escaped",
        },
      ],
    },
  }, () => 1);

  assert.equal(html, "<p><code>.env</code> should stay escaped</p>");
});
