:import puts, input :from "IO";
:import getopts :from "Proc";

:template
  => (k, v -> :if ([argv.flags]:(k)) v);

:let argv = getopts(
  :boolean [:ask, :help],
  :alias (:h :help),
);

usageInfo = "
  Usage info:

  -h, --help  Display this info
      --ask   Prompts user for input
";

messageOutput =
  :help => usageInfo | :ask => (
    puts("\nPlease ask a few questions:\n\n");

    :let ask = input([
      (:type :text, :name :foo, :message "A"),
      (:type "text" :name "bar" :message "B"),
    ]);

    "\nGot: #{ask.bar} (#{(~ ask.foo 42) ? "Gotcha!" | ":("})\n";
  ) | "\nMissing input.\n#{usageInfo}";

puts(messageOutput, "\n");
