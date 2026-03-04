@import map, take @from "Prelude".

meta = (
  :title "Fizz-ish",
  :version "0.1",
  :note "range + pipe + @match + maps"
).

classify = @match{0 "fizz", @else "plain"}.
fmt = n -> "#{meta.title}: n=#{n} kind=#{classify(n % 3)}".

1.. |> map(fmt) |> take(20).
