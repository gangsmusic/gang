const plist = require('plist');
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
      const library = plist.parse(xml);
      const tracks = [];

      var track;

      for (let id in library.Tracks) {
        track = library.Tracks[id];
        if (track['Track Type'] === 'File' || track.Kind === 'Internet audio stream') {
          tracks.push({
            id: track['Persistent ID'],
            name: track.Name,
            artist: track['Album Artist'] || track.Artist || '-= unknown artist =-',
            album: track.Album,
            url: track.Location
          });
        }
      }

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
