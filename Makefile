Gang.app: build
	cp -R Atom.app Gang.app
	cp -R vendor Gang.app/Contents/Resources/
	cp -R build Gang.app/Contents/Resources/app
	rm Gang.app/Contents/Resources/atom.icns
	cp gang.icns Gang.app/Contents/Resources/
	mv Gang.App/Contents/MacOS/Atom Gang.App/Contents/MacOS/Gang
	sed 's/atom.icns/gang.icns/' < Atom.app/Contents/Info.plist | sed 's/Atom</Gang</' > Gang.app/Contents/Info.plist

build:
	NODE_ENV=production ./node_modules/.bin/webpack -c --config webpack.config.client.js
	NODE_ENV=production ./node_modules/.bin/webpack -c --config webpack.config.server.js
	cp package.atom.json build/package.json
	cd build && npm install

clean:
	rm -rf build
	rm -rf Gang.app
