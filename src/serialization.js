import Immutable from 'immutable';
import transit from 'transit-js';

let ImmutableMapWriter = transit.makeWriteHandler({
  tag(v, h) {
    return 'immap';
  },
  rep(v, h) {
    return v.entrySeq().toArray();
  },
  stringRep(v, h) {
    return null;
  }
});

let ImmutableOrderedMapWriter = transit.makeWriteHandler({
  tag(v, h) {
    return 'imomap';
  },
  rep(v, h) {
    return v.entrySeq().toArray();
  },
  stringRep(v, h) {
    return null;
  }
});

let ImmutableListWriter = transit.makeWriteHandler({
  tag(v, h) {
    return 'imlist';
  },
  rep(v, h) {
    return v.toArray();
  },
  stringRep(v, h) {
    return null;
  }
});

export let writer = transit.writer('json', {
  handlers: transit.map([
    Immutable.Map, ImmutableMapWriter,
    Immutable.OrderedMap, ImmutableOrderedMapWriter,
    Immutable.List, ImmutableListWriter
  ])
});

export let reader = transit.reader('json', {
  handlers: {
    immap(rep) {
      return Immutable.Map(Immutable.Seq(rep));
    },
    imomap(rep) {
      return Immutable.OrderedMap(Immutable.Seq(rep));
    },
    imlist(rep) {
      return Immutable.List(rep);
    }
  }
});
