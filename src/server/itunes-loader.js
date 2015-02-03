import plist            from 'plist';
import shellescape      from 'shell-escape';
import {promisify}      from 'bluebird';

const exec      = promisify(require('child_process').exec);
const readFile  = promisify(require('fs').readFile);
const debug     = require('debug')('gang:itunes-loader');

const filename = 'iTunes Music Library.xml';

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

function parse(filename) {
  debug(`parsing ${filename}`)
  return readFile(filename, 'utf-8')
    .then(function(xml) {
      var library = plist.parse(xml);
      var tracks = [];
      var track;

      for (var id in library.Tracks) {
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

export default function findAndLoad() {
  return find().then(parse);
}
