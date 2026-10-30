# tree-sitter-ifc

[Tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammar for IFC STEP files (`.ifc`).

Tree-sitter is an incremental parser that builds syntax trees efficiently, including during live edits.
It is commonly used for syntax highlighting, code navigation, structural queries, and language-server features.
IFC (Industry Foundation Classes) is an open, vendor-neutral BIM data standard maintained by buildingSMART.
Official references: [buildingSMART IFC standards](https://technical.buildingsmart.org/standards/ifc/) and [IFC 4.3 documentation](https://ifc43-docs.standards.buildingsmart.org/).

This repository includes bindings for:

- C
- Go
- Node.js
- Python
- Rust
- Swift

## Status

This grammar is under active development and may change between versions.

## Requirements

- `tree-sitter` CLI (recommended: `0.26.x`)
- Node.js (used by the grammar DSL tooling)

## Parse Files With CLI

Parse a file and print the syntax tree:

```bash
tree-sitter parse samples/Building-Architecture-IFC4.ifc
```

Quiet parse mode (`-q` / `--quiet`):

```bash
tree-sitter parse -q samples/Building-Architecture-IFC4.ifc
```

In quiet mode, `tree-sitter` suppresses normal tree output and reports parse problems (for example `ERROR` nodes), which is useful for validation and scripting.

## Development

Main files to edit:

- [`grammar.js`](grammar.js): defines IFC syntax rules and AST node structure.
- [`queries/highlights.scm`](queries/highlights.scm): defines syntax-highlighting captures for editors and tools.

Regenerate parser artifacts after editing [`grammar.js`](grammar.js):

```bash
tree-sitter generate
```

This updates generated files in `src/` (`parser.c`, `grammar.json`, `node-types.json`), which are intended to be committed.

### Compact grammar

[`compact/grammar.js`](compact/grammar.js) extends [`grammar.js`](grammar.js) and lexes valid entities, parameter lists, number and reference lists and strings as single tokens. It parses large files faster but has no nodes inside those tokens, so `queries/highlights.scm` does not apply to it. Only the Rust binding builds it, as `LANGUAGE_COMPACT`; `LANGUAGE` is the grammar above.

Regenerate and test it after changing either grammar:

```bash
cd compact
tree-sitter generate
tree-sitter test
```

### Error Node Debugging

This repository includes a helper to print each `ERROR` node with source location and line context:

```bash
./scripts/debug-error-nodes.sh samples/*.ifc
```

Or through npm:

```bash
npm run debug:errors -- samples/Building-Architecture-IFC4.ifc
```

## Queries

- Highlights: `queries/highlights.scm`

## License

MIT
