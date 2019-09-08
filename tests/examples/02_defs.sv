# Definitions

Local functions can be achieved too:

sum(a, b)=a + b;
sum(1, 2);

Also, lambdas are supported!

mul=x -> y -> x * y;
mul(2, 3);

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
