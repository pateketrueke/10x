:template
  += (a, b -> :let a = a + b),
  -- (a -> :let a = a - 1);

fib = n ->
  :let
    a = 1, b = 0, temp = 0
  :while (>= n-- 0)
    temp = a, a += b, b = temp, b
  ;

fib(20);
