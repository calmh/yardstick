#!/usr/bin/env node

"use strict";

var _ = require('underscore');
var complexity = require('../lib/complexity');
var fs = require('fs');
var jsp = require('uglify-js').parser;
var parser = require('nomnom');
var util = require('util');
var yatf = require('yatf');

function displayStats(file) {
    var table = [];
    var prefix = '';

    var code = fs.readFileSync(file, 'utf-8');
    code = code.replace(/^#!.*\n/, '');

    var cplx = complexity(code);

    function walk(data, name) {
        if (!name) {
            _.each(data.children, walk);
        } else {
            table.push([ prefix + name, data.ecc, data.arity, data.codeLines, data.commentLines, Math.round(100 * data.commentLines / data.codeLines) ]);
            prefix += '  ';
            _.each(data.children, walk);
            prefix = prefix.slice(0,prefix.length-2);
        }
    }

    table.push([ file.blue.bold, cplx.ecc, '-', cplx.codeLines, cplx.commentLines, Math.round(100 * cplx.commentLines / cplx.codeLines) ]);
    walk(cplx);

    yatf(['Scope', 'CC', 'Ar', 'Cd', 'Cm', 'Cm/Cd'], table, { underlineHeaders: true });
    console.log();
}

parser.script('measure');
parser.option('file', {
    position: 0,
    required: true,
    help: 'The Javascript file to be measured'
});

var opts = parser.parse();
opts._.forEach(displayStats);

