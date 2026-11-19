var digits = " !#$%'()*+,-./0123456789:;=?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~".split(""),
    values = {},
    i;

for (i = 0; i < digits.length; i++) {
    values[digits[i]] = i;
}

function base90toInteger(string, pos) {
    var high = values[string[pos]];

    if (high <= 15) {
        return high + 1;
    }
    return high * 90 + values[string[pos + 1]] - 1424;
}

exports.deltaDecode = function (string) {
    var length = string.length,
        pos = 0,
        sum = 0,
        out = [],
        value;

    while (pos < length) {
        value = base90toInteger(string, pos);
        sum += value;
        out.push(sum);
        if (value <= 15) {
            pos++;
        } else {
            pos += 2;
        }
    }
    return out;
};