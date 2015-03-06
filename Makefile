BIN = $(PWD)/node_modules/.bin
APP_NAME = Gang

# targets which are not files
.PHONY: help build app clean install apm-install start

help:
	@echo 'Welcome Developer! These are the most often used tasks:'
	@echo
	@echo '  app               Produce Gang.app Mac OS X application.'
	@echo '  install           Install all dependencies for development.'
	@echo '  start             Start Gang application in development mode in browser.'
	@echo '  clean             Remove all build artifacts.'
	@echo
	@echo 'Dig into Makefile if you need to use more granular tasks.'

start:
	@$(BIN)/nodemon \
		-w src/server \
		-w src/shared \
		-w webpack.config.client.js \
		src/server/index.js

dev:
	@DEBUG=gang:* make start

install:
	@npm install

app: $(APP_NAME).app

$(APP_NAME).app: Atom.app apm-install build
	@cp package.atom.json build/package.json
	@cp -R Atom.app $(APP_NAME).app
	@cp -R vendor $(APP_NAME).app/Contents/Resources/
	@cp -R build $(APP_NAME).app/Contents/Resources/app
	@cp -R node_modules $(APP_NAME).app/Contents/Resources/app
	@cp gang.icns $(APP_NAME).app/Contents/Resources/atom.icns
	@mv $(APP_NAME).app/Contents/MacOS/Atom $(APP_NAME).app/Contents/MacOS/$(APP_NAME)
	@sed 's/atom.icns/gang.icns/' < Atom.app/Contents/Info.plist | sed 's/Atom</$(APP_NAME)</' > $(APP_NAME).app/Contents/Info.plist

Atom.app:
	@wget https://github.com/atom/atom-shell/releases/download/v0.21.3/atom-shell-v0.21.3-darwin-x64.zip
	@unzip atom-shell-v0.21.3-darwin-x64.zip

build/server.js:
	@mkdir -p $(@D)
	@NODE_ENV=production $(BIN)/webpack --bail -c --config webpack.config.server.js

build/client.js:
	@mkdir -p $(@D)
	@NODE_ENV=production $(BIN)/webpack --bail -c --config webpack.config.client.js

apm-install:
	@mkdir -p $(@D)
	@apm install

build: build/client.js build/server.js

clean:
	@rm -rf build
	@rm -rf $(APP_NAME).app
