var Terms = require("./terms.js"),
    Tags = require("./tags.js"),
    sqlite3 = require("sqlite3").verbose(),
    imageHash = require("./images.js").imageHash,
    articles = {};

function init() {
    var db = new sqlite3.Database('db');

    db.each(
        "SELECT * FROM articles",
        function (err, row) {
            var images = JSON.parse(row.images),
                imagesOut = [],
                i;

            for (i = 0; i < images.length; i++) {
                if (imageHash[images[i].location]) {
                    imagesOut.push(imageHash[images[i].location]);
                }
            }
            articles[row.id * 1] = {title: row.title, content: row.content, images: imagesOut};
        },
        function () {
            console.log("Element Server started");
        }
    );
}

var getList = exports.getList = function (indices) {
    var list = [],
        i;

    for (i = 0; i < indices.length; i++) {
        if (articles[indices[i]]) {
            list.push({id: indices[i], title: articles[indices[i]].title});
        }
    }
    return list;
}

exports.search = function (term, tagsArray, limit) {
    var articleIndices,
        articleTags,
        indices = [],
        i, k;

    if (!limit) {
        limit = 25;
    }
    if (!tagsArray) {
        tagsArray = [];
    }
    term = term.toLowerCase();
    if (articleIndices = Terms.getIndices(term)) {
        for (i = 0; i < articleIndices.length && indices.length <= limit; i++) {
            if (articleTags = Tags.getTagsForArticleIndex(articleIndices[i])) {
                k = 0;
                while ((k < tagsArray.length) && articleTags.hash[tagsArray[k]]) {
                    k++;
                }
                if (k === tagsArray.length) {
                    indices.push(articleIndices[i]);
                }
            }
        }
    }
    return getList(indices);
}

exports.getArticle = function (index) {
    if (articles[index]) {
        return articles[index];
    }
    return null;
}

init();
