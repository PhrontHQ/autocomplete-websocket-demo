var deltaDecode = require("./delta-decode.js").deltaDecode,
    index = require("./data/index.js").index,
    sortedTerms;

function init() {
    var word, i;

    sortedTerms = Object.keys(index).sort();
    for (i = 0; i < sortedTerms.length; i++) {
        word = sortedTerms[i];
        index[word] = deltaDecode(index[word]);
    }
}

var isIndexed = exports.isIndexed = function (string) {
    return index.hasOwnProperty(string.toLowerCase());
}

exports.getIndices = function (string) {
    string = string.toLowerCase();
    if (isIndexed(string)) {
        return index[string];
    }
    return null;
}

exports.autocomplete = function (string) {
    var length = sortedTerms.length,
        position = 0,
        end = length - 1,
        term,
        frequency,
        stringLength = string.length,
        highestFrequency = 0,
        bestTerm = null,
        step = 65536;

    string = string.toLowerCase();
    if (isIndexed(string)) {
        return string;
    }
    while (step) {
        if ((position + step < length) && (sortedTerms[position + step] < string)) {
            position += step;
        }
        step >>= 1;
    }
    position++;
    end = position;
    step = 16384;
    while (step) {
        if ((end + step < length) && (sortedTerms[end + step].substr(0, stringLength) === string)) {
            end += step;
        }
        step >>= 1;
    }
    if (sortedTerms[position].substr(0, stringLength) === string) {
        while (position <= end) {
            term = sortedTerms[position];
            frequency = index[term].length;
            if (frequency > highestFrequency) {
                highestFrequency = frequency;
                bestTerm = term;
            }
            position++;
        }
    }
    return bestTerm;
};

init();
