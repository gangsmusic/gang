import express from 'express';
import Service from './Service';

let app = express();

export default class ResourceService extends Service {

  didStart() {
    app.listen(this.config.resourcePort);
  }

  static registerHandler(path, handler) {
    app.get(path, function(req, res, next) {
      handler(req)
        .then(response => {
          let [code, headers, body] = response;
          res.set(headers);
          res.status(code);
          res.write(body);
          res.end();
        })
        .catch(err => next(err));
    });
  }
}
