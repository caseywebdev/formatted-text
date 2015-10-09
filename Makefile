BIN=node_modules/.bin/
COGS=$(BIN)cogs

dev:
	npm install
	$(COGS) -w formatted-text.es6
