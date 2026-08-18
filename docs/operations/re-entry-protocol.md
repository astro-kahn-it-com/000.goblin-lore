# Re-Entry Protocol & Two-Pass Invocation Specification

## Overview

The Re-Entry Protocol enables schema migration and manual edit reconciliation by performing a
two-pass isolated compilation run against manually edited or migrated files.

## Two-Pass Invocation Pipeline

1. **Pass 1 (Isolated Shape Validation)**: Runs shape validation on manually edited files to parse
   frontmatter and ensure structural schema compliance.
2. **Pass 2 (Isolated Relational & Integration Check)**: Re-evaluates relational integrity and
   cross-field references across the updated corpus state.

## Execution Workflow

- Triggers a full isolated compilation run targeting specified manually edited file paths.
- Returns detailed pass results and halts execution if any compilation errors are detected during
  either pass.
