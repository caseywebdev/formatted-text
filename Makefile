BIN=node_modules/.bin/
COGS=$(BIN)cogs

dev:
	npm install
	bower install
	open index.html
	$(COGS) -w formatted-text.es6
