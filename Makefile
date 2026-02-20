ci: src deps
	@npm run pretest
	@TZ=UTC bun test --coverage tests/

eval: src deps
	@node bin/cli -- "$(code)"

repl: src deps
	@node bin/cli

build: src deps
	@bun run build

dev: src deps
	@bun test --watch

demo: build
	@bun x serve . --listen 3131

deps: package*.json
	@(((ls node_modules | grep .) > /dev/null 2>&1) || bun install) || true
