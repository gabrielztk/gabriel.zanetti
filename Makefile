NODE = mise exec node@24.21.0 --
.PHONY: install build verify up down
install:
	$(NODE) npm ci --ignore-scripts
build:
	ASTRO_TELEMETRY_DISABLED=1 $(NODE) npm run build
verify:
	python3 scripts/verify-build.py
up: build verify
	docker compose up -d

down:
	docker compose down
