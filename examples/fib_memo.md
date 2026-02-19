fib = n ->
  :if (< n 2) 1, (< n 1) 0
  :else fib(n - 1) + fib(n - 2)
  ;

fib!(20);
