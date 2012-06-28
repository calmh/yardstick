                             __     __  _      __
       __  ______ __________/ /____/ /_(_)____/ /__
      / / / / __ `/ ___/ __  / ___/ __/ / ___/ //_/
     / /_/ / /_/ / /  / /_/ (__  ) /_/ / /__/ ,<
     \__, /\__,_/_/   \__,_/____/\__/_/\___/_/|_|
    /____/

yardstick [![build status](https://secure.travis-ci.org/calmh/node-inpath.png)](http://travis-ci.org/calmh/node-inpath)
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

By themselves, yes. But they can be a handy guide for evaluating areas of code
that could use some love. It's a tool like anything else.

License
-------

2-Clause BSD
