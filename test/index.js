const qunit = require('qunit');

qunit.run({
    code: {
        /* Include your CODE to test here */
        path: './jquery.specialinput.js',
        // What global var should it introduce for your tests?
        namespace: 'specialinput'
    },
    tests: [
        'jquery.specialinput.test.js'
    ].map(function (v) { return './test/' + v })
});
