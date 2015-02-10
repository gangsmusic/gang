import fs from 'fs';
import Service from './Service';
import Dispatcher from '../Dispatcher';
import ActionTypes from '../ActionTypes';
import debug from 'debug';
import {addTrack} from '../Actions';
import mm from 'musicmetadata';

const taggingDebug = debug('gang:tagging');

export default class TaggingService extends Service {

  didStart() {
    taggingDebug('TaggingService did start');

    Dispatcher.register(({type, payload}) => {
      switch(type) {
        case ActionTypes.ADD_FILE:
          if (!payload) {
            taggingDebug('file added from within browser environment, couldn\'t determine file path');
          }
          // TODO:
          // 1. filter supported file extensions and directories
          // 2. if any of top level dropped files are directories then
          //    21. process them
          //    22. add them to `watched folders list`
          var parser = mm(fs.createReadStream(payload));
          parser.on('metadata', function (result) {
            result.artist = result.artist && result.artist[0];
            result.picture = '';
            result.name = result.title;
            result.url = 'file://' + payload;
            addTrack(result);
          });
          break;
      }
    });
  }

}
