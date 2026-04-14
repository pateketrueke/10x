# Main Application

Uses the math module.

## Import

@import add, subtract, multiply, divide, square, cube, PI, E @from "./math.md".

## Usage

# Basic operations
result1 = add(10, 5).
result2 = subtract(10, 5).
result3 = multiply(10, 5).
result4 = divide(10, 5).

# Powers
result5 = square(4).
result6 = cube(3).

# Constants
circumference = 2 * PI * 5.
area = PI * square(5).

## Output

@print "Results:".
@print "add(10, 5) = #{result1}".
@print "subtract(10, 5) = #{result2}".
@print "multiply(10, 5) = #{result3}".
@print "divide(10, 5) = #{result4}".
@print "square(4) = #{result5}".
@print "cube(3) = #{result6}".
@print "circumference = #{circumference}".
@print "area = #{area}".
