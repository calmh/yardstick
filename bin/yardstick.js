#!/usr/bin/env node

"use strict";

var _ = require('underscore');
var complexity = require('../lib/complexity');
var fs = require('fs');
var jsp = require('uglify-js').parser;
var parser = require('nomnom');
var path = require('path');
var util = require('util');
var yatf = require('yatf');

// We'll build a table of metrics that includes all files at once, to avoid
// column width changes between tables. Thus we need the array of rows outside
// the walked function.

var rows = [];

// Analyze a file and add it's metrics to the table.

function displayMetrics(file) {
    var prefix = '';

    var code = fs.readFileSync(file, 'utf-8');

    // We remove any shebang at the start of the file since that isn't valid
    // Javascript and will trip up the parser.

    code = code.replace(/^#!.*\n/, '');

    var metrics = complexity(code);

    // Walk the metrics structure and add each member to the table rows.

    function walk(data, name) {
        // Fade out anonymous functions.

        if (name.indexOf('anon@') === 0) {
            name = name.grey;
        }

        rows.push([ prefix + name, data.ecc, data.arity, data.codeLines, data.commentLines, Math.round(100 * data.commentLines / data.codeLines) ]);

        // Add two spaces to the prefix before the next depth, to illustrate
        // the hierarchy in the table.

        prefix += '  ';
        _.each(data.children, walk);
        prefix = prefix.slice(0,prefix.length-2);
    }
    walk(metrics, path.basename(file).blue.bold);
}

// Parse the command line options.

parser.script('measure');
parser.option('file', {
    position: 0,
    required: true,
    help: 'The Javascript file to be measured'
});

var opts = parser.parse();

// Gather metrics for each file mentioned on the command line.

opts._.forEach(displayMetrics);

// Display a table of metrics.

yatf(['Scope', 'CC', 'Ar', 'Cd', 'Cm', 'Cm/Cd'], rows, { underlineHeaders: true });

