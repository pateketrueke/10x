# Definitions

Local functions can be achieved too:

sum(a, b)=a + b;
sum(1, 2);

Also, lambdas are supported!

mul=x -> y -> x * y;
mul(2, 3);

# Recursion

Recursive functions are supported as well:

fact(n)=
  :if (< n 1) 1
  :else n * fact(n - 1);

fact(5);

# Memoization

Add an exclamation mark right after a definition to memoize its input/output, e.g.

fib!(n)=
  :if (< n 2) 1, (< n 1) 0
  :else (fib(n - 1) + fib(n - 2));

// self-references are possible too!
:import (:fib F) :from "./02_defs.sv";

F(99);

> This technique is powerful but has its own limits, be careful.

# Bindings

Foreign bindings are also supported, e.g.

:import (concat, :to-upper-case caps) :from "String";

concat("foo", caps("bar"));

Lambdas are supported arguments too:

:import (map) :from "Array";

map((1, 2, 3), mul(2));

Also, you can :import symbols from other modules:

:import
  (:x y) :from "./00_basics.sv",
  (:default hi, :the-truth ok) :from "./hello.js";

hi("John Doe"), "Got: #{ok} & #{2y}";
