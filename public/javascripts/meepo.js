/**********************************************************************
 * Meepo (like Async plugin)
 **********************************************************************/

(function (global) {
    global.Meepo = function () {
        var counter = 0;
        var callback;
        this.run = function (arr) {
            return counter = arr.length;
        }
        this.itemComplete = function () {
            counter--;
            if (counter == 0 && callback) {
                callback();
            }
        }
        this.push = function (func, length) {
            if (length) {
                return counter = length;
            }
            return counter++;
        }
        this.callback = function (f) {
            callback = f;
            if (counter == 0 && callback) {
                callback();
            }
        }
    }
})(window);