import fs from 'fs';
import mm from 'musicmetadata';
import Promise from 'bluebird';
import Immutable from 'immutable';

import Dispatcher from '../Dispatcher';
import ActionTypes from '../ActionTypes';
import {addTrack} from '../Actions';

import ResourceService from './ResourceService';
import Service from './Service';

export default class TaggingService extends Service {

  constructor(config) {
    super(config);
    this._cache = Immutable.Map();
  }

  didStart() {

    ResourceService.registerHandler(
      '/cover',
      this._handleCover.bind(this));

    Dispatcher.register(({type, payload}) => {
      switch(type) {
        case ActionTypes.ADD_FILE:
          if (!payload) {
            this.debug('file added from within browser environment, couldn\'t determine file path')
            break;
          }
          // TODO:
          // 1. filter supported file extensions and directories
          // 2. if any of top level dropped files are directories then
          //    21. process them
          //    22. add them to `watched folders list`
          this._parseMetadata(payload).then(metadata =>
            addTrack({
              artist: metadata.artist && metadata.artist[0],
              picture: '',
              name: metadata.title,
              url: 'file://' + filename
            }));
          break;
      }
    });
  }

  async _handleCover(req) {
    let {url} = req.query;
    let filename = /^file:\/\//.exec(url) ?
      url.slice(7) :
      url;
    let metadata = await this._parseMetadata(filename);
    let cover = metadata.picture && metadata.picture[0] ?
      metadata.picture[0].data :
      null;
    if (cover) {
      return [200, {'Content-Type': 'image/jpg'}, cover];
    } else {
      return [404, {}, 'not found'];
    }
  }

  _parseMetadata(filename) {
    let stream = fs.createReadStream(filename);
    stream.on('error', error => {});
    let parser = mm(stream);
    parser.on('error', error => {});
    return waitForEvent(parser, 'metadata');
  }

}

function waitForEvent(emitter, eventName) {
  return new Promise(resolve =>
    emitter.once(eventName, result => resolve(result)));
}
