module.exports = function(key, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == key) return i;
    }
    return -1;
}