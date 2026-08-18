# Round-Trip Catalog

### Relational Merge Limitation

The `linked_grievances` merge logic is strictly additive. An author cannot remove a seeded grievance
link by simply omitting its tag from the markdown body. This is a known, tested limitation favoring
data safety over authoring flexibility.

### Resolution Condition Format Constraint

The extraction regex currently expects the Resolution Condition to be a single unbroken line.
Multi-line descriptions will result in truncation at the first newline. Authors must keep conditions
on one line.
