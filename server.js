var _ = require('underscore'),
  bodyParser = require('body-parser'),
  jsonServer = require('json-server'),
  middlewares,
  router,
  server;

server = jsonServer.create();
router = jsonServer.router('db.json');
middlewares = jsonServer.defaults({
  static: './dist'
});

server.use(middlewares);
server.use(bodyParser.json({limit: '10mb', extended: false}))
server.use(bodyParser.urlencoded({extended: false}))
server.use(function (req, res, next) {
  if (req.method === 'GET') {
    // store this data into original_query for further use since json-server
    // is deleting almost the entire query object when performing the database
    // reading
    req.original_query = {};
    req.original_query.page = req.query._page = req.query.page || 1;
    req.original_query.limit = req.query._limit = req.query.limit || 10;
  }
  if (req.method === 'POST') {
      if (!req.body['id']) {
        var endpoint = req.path.split('/')[2];
        var documents = router.db.get(endpoint).value();
        var id = _.max(documents, 'id')['id'] + 1;
        req.body['id'] = id;
      }
  }
  next();
});

router.render = function(req, res, next) {
  var result = res.locals.data,
    data = {};

  if (_.isArray(result)) {
    var objectCount = res.get('X-Total-Count').value();
    var pageNumber = parseInt(req.original_query.page, 10);
    var pageSize = parseInt(req.original_query.limit, 10);
    var pageCount = objectCount / pageSize;
    var endpoint = req.path.split('/')[1];

    data['pagination'] = {
      'object_count': objectCount,
      'page_number': pageNumber,
      'page_size': pageSize,
      'page_count': pageCount
    };
    data[endpoint] = result;
  } else if (_.isObject(result)) {
    data = result;
  }

  res.jsonp(data);
};
server.use('/api', router);

server.listen(3000, function() {
  console.log('\\{^_^}/ hi!');
});
