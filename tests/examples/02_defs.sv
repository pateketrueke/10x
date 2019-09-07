# Definitions

Local functions can be achieved too:

sum(a, b)=a + b;
sum(1, 2);

## Matching

Use :if, :else, :not, :unless and :otherwise to do comparisons.

:if (< 1 2) "lower" :else "upper";

:unless (:false) "Completely true";

:not (:true) -1 :otherwise "Falsey";

Multiple matches are allowed through :match, e.g.

testMatch(value)=
  :match
    (== value :true) "OK",
    (== value :false) "NOPE"
  :otherwise "UNKNOWN";

testMatch("String"),
testMatch(:false),
testMatch(:true);

## Loops

:loop (3, 4, 5) _ * 2;

## Errors

Use :try and/or :catch to handle possible failures:

:try sum() :catch -1;

If you omit :catch a message will be shown:

:try undef();

Or hide any message with :catch, e.g.

:catch undef();
