const plist = require('plist');
const libxmljs = require('libxmljs');
const shellescape = require('shell-escape');
const promisify = require('bluebird').promisify;

const exec = promisify(require('child_process').exec);
const readFile = promisify(require('fs').readFile);
const debug = require('debug')('gang:itunes-loader');

const filename = 'iTunes Music Library.xml';

/**
 * javascript representation of itunes track
 * @typedef {{id: string, name: string, artist: string, album: string, name:string}} Track
 */

/**
 * @typedef {Array<Track>} Library
 */

/**
 * finds path to itunes library xml
 * @return {Promise<String>}
 */
function find() {
  const cmd = shellescape(['mdfind', '-name', filename]);
  debug('finding itunes xml', cmd);
  return exec(cmd)
    .then(function(stdout) {
      const source = stdout[0];
      if (!source || !source.trim()) {
        throw new Error(`${filename} not found`);
      }
      return source.trim();
    });
}

/**
 * parse itunes library xml into javascript array
 * @param {string} filename
 * @return {Promise<Library>}
 */
function parse(filename) {
  debug(`parsing ${filename}`);
  return readFile(filename, 'utf8')
    .then(function(xml) {
      const library = libxmljs.parseXml(xml);
      const tracks = [];

      var dicts = library.get('/plist/dict/key[text() = "Tracks"]').nextElement().find('dict');
      let getInfo = (key, dict) => dict.get(`key[text() = "${key}"]`)
                                && dict.get(`key[text() = "${key}"]`).nextElement().text();

      dicts.forEach(track => {
        const type = getInfo('Track Type', track);
        const kind = getInfo('Kind', track);

        if (type === 'File' || kind === 'Internet audio stream') {
          const location = getInfo('Location', track);
          // TODO some unknown iTunes library bug (?) that adds `localhost` to file
          // location, so instead of
          // file:///path/to/file/mp3
          // we have to deal with
          // file://localhost/path/to/file/mp3
          const url = location && location.replace('/localhost/', '//');
          debug('track.Location', url);

          const id = getInfo('Persistent ID', track);
          const name = getInfo('Name', track);
          const artist = getInfo('Album Artist', track)
              || getInfo('Artist', track)
              || '-= unknown artist =-';
          const album = getInfo('Album', track);
          tracks.push({id, name, artist, album, url});
        }
      });

      debug('done');
      return tracks;
    });
}

/**
 * find and parse itunes library xml into javascript array
 * @function
 * @return {Promise<Library>}
 */
module.exports = function() {
  return find().then(parse);
};
