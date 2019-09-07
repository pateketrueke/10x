# Definitions

Local functions can be achieved too:

sum(a, b)=a + b;
sum(1, 2);

Also, lambdas are supported!

mul=x -> y -> x * y;
mul(2, 3);

# Binding

Foreign bindings are also supported, e.g.

:import (concat, :to-upper-case caps) :from "String";

concat("foo", caps("bar"));
