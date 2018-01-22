export function toggleDebug(debug = false) {
    if(!debug) {
        window.alert = function() {};
        window.console.log = function() {};
    }
}
