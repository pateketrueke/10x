# Data Processing Example

Process and transform data in 10x.

## Data Transformation

# Sample data
users = [
  {name: "Alice", age: 30, city: "NYC"},
  {name: "Bob", age: 25, city: "LA"},
  {name: "Charlie", age: 35, city: "NYC"}
].

# Filter by city
nycUsers = filter(users, u -> (= u.city "NYC")).

# Map to names
names = map(users, u -> u.name).

# Sort by age
sorted = sort(users, (a b) -> (< a.age b.age)).

# Reduce to total age
totalAge = reduce(users, 0, (acc u) -> acc + u.age).

# Average age
avgAge = totalAge / size(users).

## List Operations

# Numbers
nums = [1, 2, 3, 4, 5].

# Double each
doubled = map(nums, n -> n*2).

# Filter evens
evens = filter(nums, n -> (= n % 2 0).

# Sum
sum = reduce(nums, 0, (acc n) -> acc + n).

# Find first
firstEven = find(nums, n -> (= n % 2 0)).

## String Processing

# Split string
words = split("hello world", " ").

# Join strings
sentence = join(words, "-").

# Uppercase
upper = map(words, w -> upper(w)).

# Filter by length
longWords = filter(words, w -> (> size(w) 3)).
