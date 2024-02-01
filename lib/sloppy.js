'use strict';
/* Swap this to a strict-mode compatible version. */

module.exports = {
    Window_run: function _run(code, file) {
        if (file) {
            code += '\n//@ sourceURL=' + file;
        }

        evalInScope(code, this);
    },

    EventHandlerBuilder_build: function build() {
        try {
            var context = {};
            Object.assign(context, (this.document.defaultView || Object.create(null)));
            Object.assign(context, this.document);
            Object.assign(context, this.form);
            Object.assign(context, this.element);

            return evalInScope("(function(event){" + this.body + "})", context);
        }
        catch (err) {
            return function () { throw err; };
        }
    }
};

// See Stack Overflow post on how this satisfies strict mode
// https://stackoverflow.com/questions/76991442/how-to-replace-with-statement-in-strict-mode
/* jshint evil: true */
function evalInScope(js, contextAsScope) {
    return new Function(['with (this) { return eval(', JSON.stringify(js), '); }'].join('')).call(contextAsScope);
}
