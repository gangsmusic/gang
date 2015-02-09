import {rgb, rgba} from './StyleUtils';

export let colors = {
  background: rgb(255, 255, 255),
  controls: rgba(0, 0, 0, 0.6),
  controlsDisabled: rgba(0, 0, 0, 0.3),
  selected: rgba(0, 0, 255, 0.5),
  accent: rgb(255, 108, 108),

  fadedText: rgb(142, 142, 142),

  selectedText: rgb(255, 255, 255),
};

export let NonSelectableMixin = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
  cursor: 'default'
};

