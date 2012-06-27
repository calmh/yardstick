var should = require('should');
var complexity = require('../lib/complexity');

describe('complexity', function () {
    it ('should give complexity 1 for an empty function', function () {
        var code = 'function test() { };';
        var res = complexity(code);
        res.children.test.ecc.should.eql(1);
    });
    it ('should give complexity 2 for an if statement', function () {
        var code = 'function test() { if (1) return 2; };';
        var res = complexity(code);
        res.children.test.ecc.should.eql(2);
    });
    it ('should give complexity 2 for a while statement', function () {
        var code = 'function test() { while (1) return 2; };';
        var res = complexity(code);
        res.children.test.ecc.should.eql(2);
    });
    it ('should give complexity 2 for a for statement', function () {
        var code = 'function test() { for (var i=0; i<5; i++) return 2; };';
        var res = complexity(code);
        res.children.test.ecc.should.eql(2);
    });
    it ('should give complexity 2 for a nested function definition', function () {
        var code = 'function test() { var f = function () { return 2; }; return f(); };';
        var res = complexity(code);
        res.children.test.ecc.should.eql(2);
    });
    it ('should give complexity 2 for a nested function declaration', function () {
        var code = 'function test() { function f() { return 2; }; return f(); };';
        var res = complexity(code);
        res.children.test.ecc.should.eql(2);
    });
    it ('should give complexity 1 for the nested function', function () {
        var code = 'function test() { function f() { return 2; }; return f(); };';
        var res = complexity(code);
        res.children.test.children.f.ecc.should.eql(1);
    });
    it ('should give complexity 2 for try/catch', function () {
        var code = 'function test() { try { return 1; } catch (err) { return 2; } };';
        var res = complexity(code);
        res.children.test.ecc.should.eql(2);
    });
    it ('should give complexity 2 for ?:', function () {
        var code = 'function test() { return 2 ? "a" : "b"; };';
        var res = complexity(code);
        res.children.test.ecc.should.eql(2);
    });
    it ('should give complexity 5 for a switch/case', function () {
        var code = 'function test(a) { switch (a) { case 1: break; case 2: break; case 3: break; default: break; };}';
        var res = complexity(code);
        res.children.test.ecc.should.eql(5);
    });
    it ('should give complexity 1 and 2 for two different functions', function () {
        var code = 'function a(b, c) { return b+c; } function test() { try { return 1; } catch (err) { return 2; } };';
        var res = complexity(code);
        res.children.a.ecc.should.eql(1);
        res.children.test.ecc.should.eql(2);
    });
    it ('should give correct complexity for a more involved function', function () {
        var code = [
        "function test(a, b) {", // +1
       "function handle (err) {", // +1
       "if (err) { var d = 1 ? 2 : 3 ; }", // +1 +1
       "else { var d = 2 ? 3 : 4 ; }", // +1
       "};",
       "for (var i=0; i<5; i++) {", // +1
       "try {", // +1
       "var c = a ? a : b;", // +1
       "} catch (err) {",
       "if (err) handle(err);", // +1
       "}",
       "}",
       "}"
        ].join('\n');
    var res = complexity(code);
    res.children.test.ecc.should.eql(9);
    });
});
describe('arity', function () {
    it ('should be correct for various functions', function () {
        var code = [
        "function testa() {}",
       "function testb(a) {}",
       "function testc(a, b, c, d) {}"
        ].join('\n');
    var res = complexity(code);
    res.children.testa.arity.should.eql(0);
    res.children.testb.arity.should.eql(1);
    res.children.testc.arity.should.eql(4);
    });
});
describe('<toplevel>', function () {
    it ('should have reasonable values', function () {
        var code = [
        "function testa() {}",
       "function testb(a) {}",
       "function testc(a, b, c, d) {}"
        ].join('\n');
    var res = complexity(code);
    res.ecc.should.equal(3);
    res.arity.should.equal(0);
    });
});
describe('line count', function () {
    it ('should be correct for a piece of code', function () {
        var code = "function testa() {\n";
        code += "}\n";
        code += "\n";
        code += "/*\n";
        code += "* Block\n";
        code += "* Comment\n";
        code += "*/\n";
        code += "function testb(a) {}\n";
        code += "\n";
        code += "// A comment here\n";
        code += "\n";
        code += "function testc(a, b, c, d) {\n";
        code += "console.log(2 /* 1+1 */);\n";
        code += "console.log(2); // 1+1\n";
        code += "var x = 2\n";
        code += " + 2;\n";
        code += "}\n";
        code += "\n";

        var res = complexity(code);
        res.codeLines.should.equal(9);
        res.commentLines.should.equal(7);
    });
    it('should handle multiline expressions', function () {
        // Splitting a single expression over multiple lines doesn't count.
        // This might be considered a bug or a feature.

        var code = "function test() {\n";
        code += "var x = 2\n";
        code += "+\n";
        code += "2\n";
        code += "+\n";
        code += "2;\n";
        code += "}\n";

        var res = complexity(code);
        res.codeLines.should.equal(4);
        res.commentLines.should.equal(0);
    });
});
