APP_NAME = Gang

# targets which are not files
.PHONY: build app clean

app: $(APP_NAME).app

$(APP_NAME).app: build Atom.app
	cp -R Atom.app $(APP_NAME).app
	cp -R vendor $(APP_NAME).app/Contents/Resources/
	cp -R build $(APP_NAME).app/Contents/Resources/app
	rm $(APP_NAME).app/Contents/Resources/atom.icns
	cp gang.icns $(APP_NAME).app/Contents/Resources/
	mv $(APP_NAME).app/Contents/MacOS/Atom $(APP_NAME).app/Contents/MacOS/$(APP_NAME)
	sed 's/atom.icns/gang.icns/' < Atom.app/Contents/Info.plist | sed 's/Atom</$(APP_NAME)</' > $(APP_NAME).app/Contents/Info.plist

build:
	NODE_ENV=production ./node_modules/.bin/webpack --bail -c --config webpack.config.client.js
	NODE_ENV=production ./node_modules/.bin/webpack --bail -c --config webpack.config.server.js
	cp package.atom.json build/package.json
	cd build && npm install

clean:
	rm -rf build
	rm -rf $(APP_NAME).app
