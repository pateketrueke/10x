import path from 'path';
import { fileURLToPath } from 'url';
import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  DiagnosticSeverity,
  TextDocumentSyncKind,
  MarkupKind,
} from 'vscode-languageserver/node.js';
import { TextDocument } from 'vscode-languageserver-textdocument';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const runtime = await import(path.resolve(__dirname, '../dist/main.js'));
const { Parser, compile } = runtime;

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);

function toDiagnostic(error) {
  const line = Number.isFinite(error && error.line) ? Math.max(0, error.line) : 0;
  const col = Number.isFinite(error && error.col) ? Math.max(0, error.col) : 0;
  const message = error && error.message ? String(error.message) : 'Unknown 10x error';

  return {
    severity: DiagnosticSeverity.Error,
    range: {
      start: { line, character: col },
      end: { line, character: col + 1 },
    },
    message,
    source: '10x',
  };
}

function safeCompile(text) {
  try {
    Parser.getAST(text, 'parse');
    const out = compile(text);
    return { diagnostics: [], compiled: out };
  } catch (error) {
    return { diagnostics: [toDiagnostic(error)], compiled: null };
  }
}

function validate(document) {
  const { diagnostics } = safeCompile(document.getText());
  connection.sendDiagnostics({ uri: document.uri, diagnostics });
}

connection.onInitialize(() => ({
  capabilities: {
    textDocumentSync: TextDocumentSyncKind.Incremental,
    hoverProvider: true,
  },
}));

documents.onDidOpen(event => validate(event.document));
documents.onDidChangeContent(event => validate(event.document));
documents.onDidSave(event => validate(event.document));

connection.onHover(params => {
  const document = documents.get(params.textDocument.uri);
  if (!document) return null;

  const { compiled } = safeCompile(document.getText());
  if (!compiled) return null;

  const lines = compiled.split('\n');
  const excerpt = lines.slice(0, 40).join('\n');
  return {
    contents: {
      kind: MarkupKind.Markdown,
      value: `**Compiled JS (preview)**\n\n\`\`\`js\n${excerpt}\n\`\`\``,
    },
  };
});

documents.listen(connection);
connection.listen();
