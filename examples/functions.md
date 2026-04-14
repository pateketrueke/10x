# Function Examples

Function definitions and higher-order functions in 10x.

## Simple Functions

double = x -> x * 2.
double(5).

triple = x -> x * 3.
triple(4).

## Multiple Arguments

add = (a b) -> a + b.
add(3, 4).

multiply = (a b) -> a * b.
multiply(5, 6).

## No-Argument Functions

answer = -> 42.
answer().

## Block-Body Functions

sum = (a b) => 
  result = a + b,
  result.

greet = name =>
  greeting = "Hello, " + name,
  greeting.

## Higher-Order Functions

apply = (f x) -> f(x).
apply(double, 5).

compose = (f g x) -> f(g(x)).
compose(double, triple, 2).

## Partial Application

add5 = add(5).
add5(3).

multiplyBy2 = multiply(2).
multiplyBy2(7).

## Recursion

factorial = n ->
  @if (= n 0) 1
  @else n * factorial(n - 1).

factorial(5).

fib = n ->
  @if (< n 2) 1
  @else fib(n - 1) + fib(n - 2).

fib(10).

## Closures

makeCounter = start =>
  count = @signal start,
  inc = @on count = count + 1,
  dec = @on count = count - 1,
  @html
    <div>
      <span>#{count}</span>
      <button onclick={dec}>-</button>
      <button onclick={inc}>+</button>
    </div>.
