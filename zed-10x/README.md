# zed-10x

Zed extension scaffold for the 10x language.

## Local wiring

- Grammar source: `../tree-sitter-10x`
- Language server: `node ../lsp/dist/server.mjs --stdio`

## Workflow

1. Build LSP:
   ```sh
   npm run lsp:build
   ```
2. Generate grammar:
   ```sh
   npm run ts:generate
   npm run ts:test
   ```
3. Load extension from this folder in Zed developer mode.
