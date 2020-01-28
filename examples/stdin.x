:import puts, err, input :from "IO";

:let buffer = input();

:if (= buffer :nil)
  err("No input provided.\n")
:else
  puts("Thank you! Your input:\n<![[CDATA[\n#{buffer}\n]>");
