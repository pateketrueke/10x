# CLI Tool Example: Calculator

A simple command-line calculator in 10x.

## Usage

```bash
bun run calc.md add 1 2
bun run calc.md multiply 3 4
bun run calc.md help
```

## Implementation

# Get arguments
args = @args.

# Parse command
cmd = args[1].

# Parse numbers
a = @parse args[2] @as :number.
b = @parse args[3] @as :number.

# Define operations
add = (x y) -> x + y.
subtract = (x y) -> x - y.
multiply = (x y) -> x* y.
divide = (x y) -> x / y.

# Execute command
result = @match cmd
  "add" -> add(a, b)
  "subtract" -> subtract(a, b)
  "multiply" -> multiply(a, b)
  "divide" -> divide(a, b)
  "help" -> "Usage: calc.md <add|subtract|multiply|divide> <a> <b>"
  @else "Unknown command".

# Output result
@print result.
