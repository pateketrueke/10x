# 10x LSP

Language server scaffold for 10x (`vscode-languageserver`).

## Features (MVP)

- parse/compile diagnostics
- hover preview with compiled JS excerpt

## Local usage

```sh
npm --prefix lsp install
npm run lsp:build
node lsp/dist/server.mjs --stdio
```
