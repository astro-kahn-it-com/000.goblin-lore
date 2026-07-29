#!/usr/bin/env bash

get_repo_root() {
    git rev-parse --show-toplevel
}

get_package_manager() {
    if [ -n "${PACKAGE_MANAGER:-}" ]; then
        printf '%s\n' "$PACKAGE_MANAGER"
        return
    fi

    repo_root="$(get_repo_root)"
    node -e '
        const fs = require("node:fs")
        const packageJson = JSON.parse(fs.readFileSync(process.argv[1], "utf8"))
        const packageManager = packageJson.packageManager?.split("@")[0] ?? "pnpm"

        console.log(packageManager)
    ' "$repo_root/package.json"
}

run_package_script() {
    package_manager="$(get_package_manager)"
    script_name="$1"
    shift

    if [ "$#" -eq 0 ]; then
        "$package_manager" run "$script_name"
        return
    fi

    "$package_manager" run "$script_name" -- "$@"
}

run_package_binary() {
    package_manager="$(get_package_manager)"
    binary="$1"
    shift

    case "$package_manager" in
        npm)
            npm exec -- "$binary" "$@"
            ;;
        pnpm)
            pnpm exec "$binary" "$@"
            ;;
        *)
            printf 'Unsupported package manager: %s\n' "$package_manager" >&2
            return 1
            ;;
    esac
}

run_snail_sh() {
    run_package_binary snail-sh "$@"
}

show_hook_section() {
    hook_name="$1"
    run_snail_sh spacer 1
    run_snail_sh kabob "🐌 Running: $hook_name ..." '90%' magenta true
    run_snail_sh spacer 1
}

get_current_branch() {
    git rev-parse --abbrev-ref HEAD
}

check_protected_branch() {
    operation="$1"
    branch="$(get_current_branch)"

    if printf '%s\n' "$branch" | grep -Eq '^(master|main)$'; then
        run_snail_sh critical "Direct $operation on protected branch '$branch' is not allowed."
        run_snail_sh status_pair 'Branch' "$branch" critical
        return 1
    fi

    run_snail_sh status_pair 'Protected branch check' passed success
}

validate_branch_name() {
    branch="$(get_current_branch)"

    if printf '%s\n' "$branch" | grep -Eq '^[a-zA-Z0-9]+([/-][a-zA-Z0-9]+)*$'; then
        run_snail_sh status_pair 'Branch name' "$branch" success
        return
    fi

    run_snail_sh critical "Invalid branch name: $branch"
    run_snail_sh status_pair 'Allowed separators' '/ and -' info
    return 1
}

check_staged_filenames() {
    bad_filename_pattern='[^A-Za-z0-9._/@ +\-]'
    bad_files="$(
        git diff --cached --name-only \
            | LC_ALL=C grep -nE "$bad_filename_pattern" || true
    )"

    if [ -z "$bad_files" ]; then
        run_snail_sh status_pair 'Staged filenames' passed success
        return
    fi

    run_snail_sh critical 'Bad characters found in staged filenames.'
    run_snail_sh status_pair 'Allowed characters' 'A-Z a-z 0-9 space . _ - + @ /' info
    run_snail_sh status_pair 'Rename these files' "$bad_files" error
    return 1
}

run_lint_staged_if_needed() {
    if [ "${SCOPE_COMMIT_MANAGES_LINT_STAGED:-0}" = '1' ]; then
        run_snail_sh spacer 1
        run_snail_sh status_pair 'lint-staged' 'handled by scope-commit' success
        run_snail_sh spacer 1
        return
    fi
    show_hook_section 'lint-staged'
    run_package_script lint:staged
}

print_usage() {
    printf '%s\n' \
        'Usage: functions.sh <command> [arguments]' \
        '' \
        'Commands:' \
        '  get_repo_root' \
        '  get_package_manager' \
        '  run_package_script <script> [arguments...]' \
        '  run_package_binary <binary> [arguments...]' \
        '  run_snail_sh <command> [arguments...]' \
        '  show_hook_section <hook-name>' \
        '  check_protected_branch <commit|push>' \
        '  validate_branch_name' \
        '  check_staged_filenames' \
        '  run_lint_staged_if_needed'
}

run_git_hook_function() {
    command_name="${1:-}"

    if [ -z "$command_name" ]; then
        print_usage
        return 2
    fi

    shift

    case "$command_name" in
        get_repo_root | get_package_manager)
            if [ "$#" -ne 0 ]; then
                print_usage
                return 2
            fi
            "$command_name"
            ;;
        run_package_script | run_package_binary | run_snail_sh | show_hook_section)
            if [ "$#" -lt 1 ]; then
                print_usage
                return 2
            fi
            "$command_name" "$@"
            ;;
        check_protected_branch)
            if [ "$#" -ne 1 ]; then
                print_usage
                return 2
            fi
            check_protected_branch "$1"
            ;;
        validate_branch_name | check_staged_filenames | run_lint_staged_if_needed)
            if [ "$#" -ne 0 ]; then
                print_usage
                return 2
            fi
            "$command_name"
            ;;
        help | --help | -h)
            print_usage
            ;;
        *)
            printf 'Unknown command: %s\n\n' "$command_name" >&2
            print_usage >&2
            return 2
            ;;
    esac
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
    run_git_hook_function "$@"
fi
