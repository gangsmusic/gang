const shellescape = require('shell-escape');
const promisify = require('bluebird').promisify;
const itunes = require("itunes-data");
const fs = require('fs');
const parser = itunes.parser();
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

export class ItunesLoader {

  constructor(onAdd) {
    this.onAdd = onAdd;
  }

  /**
   * find and add itunes library tracks
   * @function
   */
  loadLibrary() {
    this.find().then(this.parse.bind(this));
  };

  /**
   * finds path to itunes library xml
   * @return {Promise<String>}
   */
  find() {
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
   * parse itunes library xml into library
   * @param {string} filename
   */
  parse(filename) {
    debug(`parsing ${filename}`);
    const stream = fs.createReadStream(filename);

    var tracks = [];
    parser.on("track", function(track) {
      const type = track['Track Type'];
      const kind = track.Kind;

      if (type === 'File' || kind === 'Internet audio stream') {
        const location = track.Location;
        // TODO some unknown iTunes library bug (?) that adds `localhost` to file
        // location, so instead of
        // file:///path/to/file/mp3
        // we have to deal with
        // file://localhost/path/to/file/mp3
        const url = location && location.replace('/localhost/', '//');
        //debug('track.Location', url);

        const id = track['Persistent ID'];
        const name = track['Name'];
        const artist = track['Album Artist']
            || track.Artist
            || '-= unknown artist =-';
        const album = track.Album;
        tracks.push({id, name, artist, album, url});
      }
    }.bind(this));
    stream.pipe(parser);
    stream.on('end', () => {
      debug('total tracks processed', tracks.length);
      this.onAdd({tracks});
    });
  }

}
