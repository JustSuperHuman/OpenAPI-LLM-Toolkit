# OpenAPI Tree Structure Generator

## Overview

This Node.js script generates a file tree structure of your project, including specific references to OpenAPI components within YAML files. It scans the directory, reads `.gitignore` rules to skip unnecessary files, and identifies components in OpenAPI YAML files, creating a structured output in a `tree.list` file.

This structure provides a hierarchical view of the project's layout and OpenAPI components, detailing where each component resides. Such a file tree can be helpful in feeding data into a Large Language Model (LLM) by providing an organized view of the project's layout and the relationships between files and components. This detailed structure helps an LLM to understand the context and dependencies within the project, making it easier for the model to navigate and answer questions about specific components.

## Features

- **Generates File Tree Structure:** Outputs a tree structure representing the file hierarchy.
- **Integrates `.gitignore` Rules:** Excludes files and folders based on `.gitignore` rules.
- **Identifies OpenAPI Components:** Scans YAML files for OpenAPI components and appends them to the file structure.
- **File Output:** Saves the generated structure to `tree.list` for easy reference.

## Example Output

The script produces an output similar to the following:

```
└── JustGainsOpenAPI
    ├── components
    │   ├── responses
    │   └── schemas
    │       ├── auth
    │       │   ├── Auth.yaml
    │       │       └── #UserRegisterRequest
    │       │       └── #UserLoginRequest
    │       │       └── #ConfirmEmailRequest
    ...
    ├── paths
    │   ├── Auth
    │   │   ├── auth.yaml
    │   │   └── ban.yaml
    ...
```

## Installation and Usage

1. **Install Dependencies:**

   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```

2. **Run the Script:**

   ```bash
   node script.js
   ```

   By default, it reads from the root of the project, so place this script in a `scripts` directory under the root.

3. **Output File:**

   The generated structure will be saved to `tree.list` in the root of your project.

## How It Works

1. **Parsing `.gitignore`:** The script reads `.gitignore` to avoid unnecessary files.
2. **Directory Traversal:** It recursively explores each directory, generating a tree structure.
3. **Component Extraction:** YAML files are parsed, and components (e.g., OpenAPI schemas) are listed under each file in the tree.

## Benefits for LLM Data Feeds

This organized output can be directly fed to an LLM to:
- Provide a clear project overview for navigation and context understanding.
- Help the LLM locate specific components within the file structure.
- Offer a useful reference for generating or answering questions about specific parts of the project.

This script enhances the LLM’s ability to work with your project structure, making it an invaluable tool for developers and AI applications alike.