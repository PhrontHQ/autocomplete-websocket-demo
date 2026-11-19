var sqlite3 = require('sqlite3').verbose(),
    WebSocketServer = require("ws").Server,
    wss = new WebSocketServer({port: 8888}),
    db;



            /*db.run("CREATE TABLE lorem (info TEXT)");

            var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
            for (var i = 0; i < 10; i++) {
                stmt.run("Ipsum " + i);
            }
            stmt.finalize();*/

db = new sqlite3.Database('db');
console.log("SQL started.");
var preparedInsert = db.prepare("INSERT INTO articles (title, content, images) VALUES (?, ?, ?)");
var pages;


wss.on('connection', function (ws) {
    ws.on('message', function (message) {
        var data = JSON.parse(message);

        if (data.command === "insert") {
            db.serialize(function () {
                preparedInsert.run(data.title, data.content, data.images);
            });
            ws.send("OK");
        }
        if (data.command === "retrieve") {
            pages = [];
            db.each(
                //WHERE   testType IN ('A', 'B', 'C', 'D')
                "SELECT * FROM articles LIMIT " + data.arguments.from + "," + data.arguments.limit,
                function (err, row) {
                    pages.push({id: row.id, title: row.title, content: row.content, images: row.images});
                },
                function () {
                    ws.send(JSON.stringify(pages));
                }
            );
        }
    });
});

