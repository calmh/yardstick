"use strict";

var _ = require('underscore');
var jsp = require('uglify-js').parser;
var util = require('util');

function Result() {
    return {
        ecc: 0,
            arity: 0,
            commentLines: {},
            codeLines: {}
    };
}

function addResults(a, b) {
    var s = new Result();
    s.ecc = a.ecc + b.ecc;

    var l = _.union(_.keys(a.codeLines), _.keys(b.codeLines));
    l.forEach(function (line) { s.codeLines[line] = true; });
    l = _.union(_.keys(a.commentLines), _.keys(b.commentLines));
    l.forEach(function (line) { s.commentLines[line] = true; });

    return s;
}

function summarizeResults(ary) {
    if (ary.length === 1) {
        return addResults(new Result(), ary[0]);
    } else {
        ary = _.clone(ary);
        var initial = ary.pop();
        return ary.reduce(addResults, initial);
    }
}

function recurseAll(ary) {
    if (!ary || ary.length < 1) {
        return new Result();
    }

    var results = ary.map(walkAst);
    var summarized = summarizeResults(results);

    summarized.children = {};
    _.each(results, function (r) {
        if (r.name) {
            summarized.children[r.name] = r;
            delete r.name;
        } else if (r.children && _.size(r.children) > 0) {
            _.extend(summarized.children, r.children);
        }
    });

    return summarized;
}

function walkAst(ast) {
    var result, children, params, name;

    if (!ast) {
        return new Result();
    }

    var type = ast[0].name || ast[0];
    var line = (ast[0].start || { line: 0 }).line;
    var endLine = (ast[0].end || { line: 0 }).line;

    switch (type) {
        case 'toplevel':
            children = ast[1];
            result = recurseAll(children);
            result.name = '<toplevel>';
            break;

        case 'block':
            children = ast[1];
            result = recurseAll(children);
            break;

        case 'defun':
        case 'function':
            name = ast[1] || ('anon@' + line);
            params = ast[2];
            children = ast[3];

            result = recurseAll(children);
            result.name = name;
            result.ecc += 1;
            result.arity = params.length;
            break;

        case 'if':
        case 'conditional':
            children = [ ast[2], ast[3] ];
            result = recurseAll(children);
            result.ecc += 1;
            break;

        case 'for':
            result = walkAst(ast[4]);
            result.ecc += 1;
            break;

        case 'while':
            result = walkAst(ast[2]);
            result.ecc += 1;
            break;

        case 'stat':
            result = walkAst(ast[1]);
            break;

        case 'call':
            result = recurseAll(ast[2]);
            break;

        case 'try':
            children = ast[1].concat(ast[2][1]);
            result = recurseAll(children);
            result.ecc += 1;
            break;

        case 'var':
            children = ast[1].map(function (t) { return t[1]; });
            result = recurseAll(children);
            break;

        case 'assign':
            children = [ ast[2], ast[3] ];
            result = recurseAll(children);
            break;

        case 'return':
            if (!ast[1]) {
                result = new Result();
            } else {
                result = walkAst(ast[1]);
            }
            break;

        case 'switch':
            children = ast[1].map(function (t) { return t[1]; });
            result = recurseAll(children);
            result.ecc += ast[2].length;
            break;

        default:
            result = new Result();
            break;
    }

    var comments = [];
    if (ast[0].start && ast[0].start.comments_before) {
        comments = comments.concat(ast[0].start.comments_before);
    }
    if (ast[0].end && ast[0].end.comments_before) {
        comments = comments.concat(ast[0].end.comments_before);
    }

    comments.forEach(function (comment) {
        var lines = comment.value.split('\n');
        for (var i = 0; i < lines.length; i++) {
            result.commentLines[comment.line + i] = true;
        }
    });

    result.codeLines[line] = true;
    result.codeLines[endLine] = true;

    return result;
}


function complexity(code) {
    var ast = jsp.parse(code, false, true);
    var res = walkAst(ast);

    function countLines(node) {
        node.codeLines = _.size(node.codeLines);
        node.commentLines = _.size(node.commentLines);
        if (node.children) {
            _.each(node.children, countLines);
        }
    }
    countLines(res);

    return res;
}

module.exports = exports = complexity;
