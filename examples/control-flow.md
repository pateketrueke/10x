# Control Flow Examples

Conditionals and branching in 10x.

## Basic @if

@if :on 1.
@if :off 0.

@if (= 1 1) "yes".
@if (= 1 2) "no".

## @if/@else

@if (= 1 1) "equal" @else "not equal".
@if (< 1 2) "less" @else "greater or equal".

## Multiple Conditions

@if (= 1 1) "one"
    (= 2 2) "two"
    @else "other".

@if (< 0 1) "positive"
    (> 0 -1) "negative"
    @else "zero".

## Ternary Operator

:on ? "yes" | "no".
:off ? "yes" | "no".

1 ? "truthy" | "falsy".
0 ? "truthy" | "falsy".

## Default Values

0 | 1.
"nil" | "default".
"" | "empty string".

## Logical Operators

!0.
!1.
(? 0 1 0).
($ 1 1 1).

## Pattern Matching with Symbols

status = :ok.

@if (= status :ok) "Success"
    (= status :err) "Error"
    @else "Unknown".

## Nested Conditions

@if (< 1 2)
  @if (< 2 3) "both true"
  @else "first true, second false"
@else "first false".
