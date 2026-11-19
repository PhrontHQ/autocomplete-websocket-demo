var Terms = require("./terms.js"),
    tags = require("./data/tags.js").tags;

function init() {
    var i, j, hash;

    for (i = 0; i < tags.length; i++) {
        if (tags[i]) {
            tags[i] = {
                array: tags[i].split(" "),
                hash: {}
            }
            for (j = 0; j < tags[i].array.length; j++) {
                tags[i].hash[tags[i].array[j]] = j + 1;
            }
        }
    }
}

var getTagsForArticleIndex = exports.getTagsForArticleIndex = function (index) {
    if (tags[index]) {
        return tags[index];
    }
    return null;
}

exports.getTagsForQuery = function (term, tagsArray) {
    var articleIndices,
        articleTags,
        out,
        frequency,
        multiplier,
        articles = 0,
        selectionTags = {},
        searchTagsHash = {},
        i, j, k, t, m;

    if (!term) {
        return null;
    }
    if (!tagsArray) {
        tagsArray = [];
    }
    for (i = 0; i < tagsArray.length; i++) {
        searchTagsHash[tagsArray[i]] = true;
    }
    term = term.toLowerCase();
    if (articleIndices = Terms.getIndices(term)) {
        for (i = 0; i < articleIndices.length; i++) {
            if (articleTags = getTagsForArticleIndex(articleIndices[i])) {
                k = 0;
                while ((k < tagsArray.length) && articleTags.hash[tagsArray[k]]) {
                    k++;
                }
                if (k === tagsArray.length) {
                    t = articleTags.hash[term];
                    t = t ? (41 - t) * (41 - t) : 1;
                    for (j = 0; j < articleTags.array.length; j++) {
                        multiplier = (40 - j) * (40 - j) * t;
                        m = articleTags.array[j];
                        if (selectionTags[m]) {
                            selectionTags[m].c++;
                            selectionTags[m].r += multiplier;
                        } else {
                            selectionTags[m] = {
                                r: multiplier,
                                c: 1
                            };
                        }
                    }
                    articles++;
                }
            }
        }
        out = ["","","","","","","","","","","","","","",""];
        frequency = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        searchTagsHash[term] = true;
        for (i in selectionTags) {
            if (selectionTags[i].c !== articles && !searchTagsHash[i]) {
                m = selectionTags[i].r;
                j = out.length - 1;
                while ((frequency[j] < m) && (j >= 0)) {
                    out[j] = out[j - 1];
                    frequency[j] = frequency[j - 1];
                    j--;
                }
                if (j < out.length - 1) {
                    out[j + 1] = i;
                    frequency[j + 1] = m;
                }
            }
        }
        if (out.indexOf("") !== -1) {
            out.splice(out.indexOf(""), Infinity);
        }
        return out;
    }
    return null;
}

init();
