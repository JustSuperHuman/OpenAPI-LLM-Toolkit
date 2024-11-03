# Split OpenAPI by Tag Script

## Overview

This script is designed to split an OpenAPI specification into separate, fully self-contained documents based on tags. By separating the OpenAPI documentation, it becomes easier to feed these smaller units into Large Language Models (LLMs) for tasks like documentation generation, testing, or other purposes. Each output document contains all relevant paths, components, and metadata related to a specific tag, ensuring that the document remains valid and self-contained.

## Features

- **Tag-Based Separation**: The script splits the paths and operations by their respective tags. If an operation has multiple tags, it will appear in all related files.
- **$ref and allOf Resolution**: Recursively resolves `$ref` references and `allOf` schemas, ensuring each output file is fully independent and does not rely on any references to the original document.
- **Components Handling**: Identifies and includes only the components (schemas, parameters, request bodies, responses, etc.) that are actually used by the paths and operations for each tag, reducing the overall size of each document.
- **Handles Complex OpenAPI Elements**: Supports the entire OpenAPI specification, including security definitions, servers, external documentation, and callbacks.
- **Hierarchical Tag Support**: Supports `|` characters in tags, which indicate hierarchical relationships. For instance, `Workouts|example` will be grouped into a base tag (`Workouts`), making sure that all child paths are kept together in the same file.

## Usage

### Prerequisites

- Node.js installed on your system.
- An OpenAPI specification file in JSON format.

### Running the Script

1. Save the script to a file, for example, `splitOpenApiByTag.js`.
2. Run the script using Node.js from the command line:

   ```bash
   node splitOpenApiByTag.js <inputFilePath> [outputDir]
   ```

   - `<inputFilePath>`: The path to your OpenAPI JSON file.
   - `[outputDir]` (optional): The directory where the output files will be saved. Defaults to `./output` if not provided.

### Example

```bash
node splitOpenApiByTag.js openapi.json output
```

This command will read the OpenAPI spec from `openapi.json` and create separate files for each tag in the `output` directory.

## Output

The output will be a set of JSON files, each named after a tag from the OpenAPI specification. Each file will include:

- **Metadata**: Common elements such as `info`, `servers`, `security`, `tags`, and `externalDocs`.
- **Paths**: Only the paths that correspond to the respective tag.
- **Components**: Only the components that are directly used in the relevant paths.

This ensures that each output file is a valid OpenAPI document, which can be utilized independently for different use cases.

## Use Cases

- **LLM Integration**: By splitting the OpenAPI spec into smaller, self-contained documents, it is easier to feed the data into Large Language Models for context-based tasks such as documentation generation or QA automation.
- **Microservices**: Useful for teams developing microservices, as it allows each team to work with the part of the spec that is relevant to them.
- **API Documentation Tools**: Smaller OpenAPI files can be directly used with API documentation tools to generate tag-specific documentation.

## Key Considerations

- **Complete Self-Containment**: Each output file contains all the information required to understand the API paths, including resolved schemas and other components.
- **Error Handling**: The script will stop and log an error if it encounters any unresolved `$ref` or invalid paths in the original specification.
- **Hierarchical Tags**: The script supports hierarchical tags, allowing related paths to be grouped effectively.

## License

This script is available under the MIT License.

