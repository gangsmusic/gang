import fs from 'fs';
import Service from './Service';
import Dispatcher from '../Dispatcher';
import ActionTypes from '../ActionTypes';
import {addTrack} from '../Actions';
import mm from 'musicmetadata';

export default class TaggingService extends Service {

  didStart() {
    this.debug('TaggingService did start');

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
          const parser = mm(fs.createReadStream(payload));
          parser.on('metadata', result => {
            result.artist = result.artist && result.artist[0];
            result.picture = '';
            result.name = result.title;
            result.url = 'file://' + payload;
            process.nextTick(() => addTrack(result));
          });
          break;
      }
    });
  }

}
