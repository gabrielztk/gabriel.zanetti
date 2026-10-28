NODE = mise exec node@24.21.0 --
PNPM = $(NODE) npm exec --yes --package=pnpm@11.3.0 -- pnpm
.PHONY: install build verify up down
install:
	$(PNPM) install --frozen-lockfile
build:
	ASTRO_TELEMETRY_DISABLED=1 $(PNPM) run build
verify:
	python3 scripts/verify-build.py
up: build verify
	docker compose up -d
down:
	docker compose down
