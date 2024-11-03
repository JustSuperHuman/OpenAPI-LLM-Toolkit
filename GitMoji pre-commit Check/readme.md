Here’s a sample `README.md` for your script:

---

# Commit Message Validator

This script enforces commit message standards by requiring that each message starts with a Gitmoji (emoji) or is a merge commit. It helps maintain consistent commit messages across the project, making them easier to read and improving collaboration.

## Purpose

When working in a collaborative environment, it's essential to keep commit messages consistent and informative. This script enforces a commit message style where:

1. Every commit message begins with a Gitmoji, or
2. The commit is identified as a merge commit.

Using a Gitmoji at the start of each message helps developers quickly understand the purpose of each commit. For instance, a 🐛 emoji might represent a bug fix, while ✨ could represent a new feature. This visual cue makes navigating commit history clearer.

![Screenshot of gitmoji](https://just-super-human.us-east-1.linodeobjects.com/screenshots/gitmoji-is-great.png)


## How It Works

1. The script reads the commit message from a file (passed as an argument when invoked).
2. It checks:
   - If the first character of the commit message is an emoji.
   - If the commit message contains the word "merge" (case-insensitive), indicating it’s a merge commit.
3. If neither condition is met, the script outputs an error and exits with a non-zero status, which can prevent the commit if integrated with a pre-commit hook.

## Usage

### Prerequisites

Ensure Node.js is installed on your machine.

### Installation

1. Place this script in your project directory.
2. Name it `validate-commit.js` (or any name you prefer).

### Adding to a Pre-commit Hook

To enforce this check on every commit:

1. Open the `.git/hooks/commit-msg` file (or create it if it doesn’t exist).
2. Add the following line, replacing `validate-commit.js` with the path to the script if different:

   ```bash
   node path/to/validate-commit.js "$1"
   ```

3. Make sure the hook file is executable:

   ```bash
   chmod +x .git/hooks/commit-msg
   ```

### Running Manually

To test a commit message, run:

```bash
node validate-commit.js path/to/commit_message_file
```

Replace `path/to/commit_message_file` with the path to the file containing the commit message.

## Example

If the commit message is `✨ Add new feature`, it passes the check.

If the commit message is `Add new feature` (without an emoji), the script will return an error:

```
❌ Commit message must start with a gitmoji (emoji) or be a merge commit. Please follow the gitmoji style.
```
