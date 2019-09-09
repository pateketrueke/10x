# Numbers

All numeric values are recognized, e.g. -.6, 42

Fractions are supported too, e.g. 1.5 as frac

# Strings

Double quoted strings are supported aswell,
sigle quotes are not considered for this purpose.

Interpolation is also possible, e.g. "Test: #{1, 2, 3} 😁"

> Notice all expressiones are evaluated and concatenated in place.

# Units

Common units can be used after numbers, e.g. 3 inches, 5mm

Converting between units is also possible: 3 inches as cm

Define and use your own units: x=1.2; 3x

Scope is created within parentheses:

(x=1.5; 3x)
2x

# Lists

Use parentheses to group any value or expression, e.g. (1, 2), 3, (4, (5))
