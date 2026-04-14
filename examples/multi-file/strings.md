# String Utilities Module

Exportable string functions.

## Exports

@export upper, lower, trim, split, join, replace, contains, startsWith, endsWith.

## Implementation

upper = s -> @upper s.
lower = s -> @lower s.
trim = s -> @trim s.
split = (s sep) -> @split s sep.
join = (arr sep) -> @join arr sep.
replace = (s old new) -> @replace s old new.
contains = (s sub) -> @contains s sub.
startsWith = (s prefix) -> @startsWith s prefix.
endsWith = (s suffix) -> @endsWith s suffix.

## Helpers

capitalize = s -> upper(head(s)) + lower(tail(s)).
wordCount = s -> size(split(s, " ")).

@export capitalize, wordCount.
