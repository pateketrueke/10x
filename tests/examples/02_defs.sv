# Definitions

Local functions can be achieved too:

sum(a, b)=a + b;
sum(1, 2);

# Logic handling

Only three kind of logical support is implemented.

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

## Errors

:try sum() :catch -1;

:try undef();

:catch undef();

:foo (:bar);
