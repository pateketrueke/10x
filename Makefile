ci: src deps
	@npm run pretest
	@INFO=true npm run test:coverage -- -r html

eval: src deps
	@node -r esm bin/cli -- "$(code)"

repl: src deps
	@node -r esm bin/cli --repl

build: src deps
	@npm run build

dev: src deps
	@npm run watch

deps: package*.json
	@(((ls node_modules | grep .) > /dev/null 2>&1) || npm i) || true
