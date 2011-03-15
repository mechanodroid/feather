jojo.ns("blog");

var Couch = require("../../../api/couchdb");

Couch.db.initialize({
  hostUrl: 'http://localhost',
  dbName: 'jojoblog'
});

blog.lastfive = jojo.widget.create({
  name: "blog.lastfive",
  path: "widgets/lastfive/",
  prototype: {
    initialize: function($super, options) {
      $super(options);
      //this.getPosts();
    },
    getPosts: jojo.widget.serverMethod(function(client, result) {
      var me = this;
      var posts = [];
      client.manageResponse = false; // We'll handle the sending of data back to the client.
      Couch.db.view("blogentry/posts_by_date", { descending: true }, function(err, dbResult) {
        if (!err) {
          debugger;
          dbResult.forEach(function(key, doc, id) {
            doc.key = key;
            doc.pubDate = new Date(key[0], key[1], key[2], key[3], key[4], key[5]);
            doc.id = id;
            posts.push(doc); // id, key, value { pub_date, summary, post }
          });
          result.success = true;
          result.result = posts;
        } else {
          result.success = false;
          result.err = err;
        }
        client.send(result);

      }); // end couch.db.view
    }) // end getPosts
  } // end prototype
});
