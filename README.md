# This project is not actively maintained

Issues and pull requests on this repository may not be acted on in a timely
manner, or at all.  You are of course welcome to use it anyway. You are even
more welcome to fork it and maintain the results.

![Unmaintained](https://nym.se/img/unmaintained.jpg)

                             __     __  _      __
       __  ______ __________/ /____/ /_(_)____/ /__
      / / / / __ `/ ___/ __  / ___/ __/ / ___/ //_/
     / /_/ / /_/ / /  / /_/ (__  ) /_/ / /__/ ,<
     \__, /\__,_/_/   \__,_/____/\__/_/\___/_/|_|
    /____/

yardstick [![build status](https://secure.travis-ci.org/calmh/yardstick.png)](http://travis-ci.org/calmh/yardstick)
=========

Code metrics for Javascript

How
---

Install it:

    % sudo npm install -g yardstick

Run it on one or more code files:

    % yardstick mole.js 
    Scope          CC  Ar  Cd   Cm   Cm/Cd
    mole.js        79  -   415  162     39
      anon@55       1   1    3    0      0
      readCert      2   0   11    3     27
      init          2   1    8    5     63
      register      2   1   17   12     71
        anon@274    1   1   10    5     50
      token         2   1    9    2     22
        anon@307    1   1    3    0      0
    ...

Reported Metrics
----------------

  - `CC`: Estimated cyclomatic complexity. "Estimated", since this is a hard
    nut to crack on Javascript without actually running the code. The estimate
    is fairly good however and the point being "higher number => higer
    complexity => not necessarily so good" is still valid.

  - `Ar`: Arity of the function.

  - `Cd`: Number of lines of code, excluding blanks and comments.

  - `Cm`: Number of lines of comments.

  - `Cm/Cd`: Ratio of comments to code, as a percentage. So `100` means there
    are as many lines of comments as there are lines of code, while `25` means
    there are four times as many lines of code.

But metrics such as cyclomatic complexity and number of comments are useless!
-----------------------------------------------------------------------------

By themselves, possibly. But they can be a handy guide for evaluating areas of
code that could use some love. It's a tool like anything else.

The cyclomatic complexity reported by `yardstick` differs from `$othertool`!
----------------------------------------------------------------------------

Like I said, calculating CC for JS code is nontrivial. A common approach for
other languages is to simply count branching keywords. That doesn't give
anything like the the full picture in JS since many common control structures
are instead expressed as function calls. Consider:

    for (var i = 0; i < 5; i++) {
        /* ... */
    }

vs

    [0, 1, 2, 3, 4].forEach(function (i) {
        /* ... */
    });

Any tool that doesn't recognize those as the same structure is broken. Likewise:

    someEventEmitter.on('something', function (d) {
        /* ... */
    }).on('error', function (e) {
        /* ... */
    });

Not to mention:

    someEventEmitter.on('something', declaredElsewhere)
        .on('error', alsoDeclaredElseWhere);

That last case isn't handled well by `yardstick` either...

License
-------

MIT

