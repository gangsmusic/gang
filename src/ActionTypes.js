import keyMirror from 'key-mirror';

let ActionTypes = keyMirror({
  BOOTSTRAP_STORES: null,
  LOCAL_PARTY_PARTICIPANT_ADDED: null,
  LOCAL_PARTY_PARTICIPANT_REMOVED: null
});

export default ActionTypes;
