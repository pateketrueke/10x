# Server-Side Examples

Examples for server-side (Bun/Node) usage.

## File Reading

# Read a file
content = @read "example.txt".

# Read and parse JSON
data = @read "data.json" @as :json.

## File Writing

# Write to a file
@write "output.txt" "Hello, World!".

# Write JSON
@write "data.json" data @as :json.

## HTTP Server

# Simple HTTP server
@server 3000 =>
  @get "/" => @html <h1>Hello, World!</h1>.
  @get "/api" => @json {status: "ok"}.

## CLI Arguments

# Get command line arguments
args = @args.

# First argument (after script name)
script = args[0].

# Remaining arguments
rest = args[1..].

## Environment Variables

# Get environment variable
home = @env "HOME".

# Set environment variable
@env "DEBUG" "true".

## Process

# Exit with code
@exit 0.

# Get current directory
cwd = @cwd.

# Change directory
@cd "/path/to/dir".
