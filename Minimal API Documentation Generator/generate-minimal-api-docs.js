#!/usr/bin/env node
const fs = require("fs");
const openapiSampler = require("openapi-sampler");
const path = require("path");
const $RefParser = require("@apidevtools/json-schema-ref-parser");

// Check for input file argument
if (process.argv.length < 3) {
  console.error("Usage: node generate-api-doc.js <openapi-spec-file.json>");
  process.exit(1);
}

const specFilePath = process.argv[2];

// Function to generate markdown documentation
function generateMarkdown(spec) {
  let md = "";
  const paths = spec.paths;

  for (const route in paths) {
    const methods = paths[route];
    for (const method in methods) {
      const operation = methods[method];
      md += `## ${method.toUpperCase()} \`${route}\`\n\n`;

      if (operation.summary) {
        md += `**Summary**: ${operation.summary}\n\n`;
      }

      if (operation.description) {
        md += `${operation.description}\n\n`;
      }

      // Add parameters section if present
      if (operation.parameters && operation.parameters.length > 0) {
        md += `**Parameters**:\n\n`;
        operation.parameters.forEach((param) => {
          md += `- \`${param.name}\` (${param.in}) ${
            param.required ? "(Required)" : "(Optional)"
          }: ${param.description || ""}\n`;
        });
        md += "\n";
      }

      md += `**Success Responses**:\n\n`;
      const responses = operation.responses;

      for (const statusCode in responses) {
        // Check if status code is a success code (200-299)
        if (/^2\d{2}$/.test(statusCode)) {
          const response = responses[statusCode];
          md += `- **Status ${statusCode}**\n`;

          if (response.description) {
            md += `  - Description: ${response.description}\n`;
          }

          // Handle response content
          if (response.content) {
            for (const contentType in response.content) {
              const mediaTypeObject = response.content[contentType];
              if (mediaTypeObject.schema) {
                try {
                  // Generate example using openapi-sampler with full spec
                  const sample = openapiSampler.sample(mediaTypeObject.schema, {
                    spec: spec,
                  });
                  const exampleJson = JSON.stringify(sample, null, 2);
                  md += `  - Content-Type: \`${contentType}\`\n`;
                  md += "  - Example:\n";
                  md += "    ```json\n";
                  md +=
                    exampleJson
                      .split("\n")
                      .map((line) => "    " + line)
                      .join("\n") + "\n";
                  md += "    ```\n";
                } catch (error) {
                  md += `  - Content-Type: \`${contentType}\`\n`;
                  md += `  - Schema available but example generation failed: ${error.message}\n`;
                }
              }
            }
          }
          md += "\n";
        }
      }
      md += "\n";
    }
  }
  return md;
}

// Main async function to handle the process
async function main() {
  try {
    // Read and parse the OpenAPI JSON spec file
    const specContent = fs.readFileSync(specFilePath, "utf8");
    const rawSpec = JSON.parse(specContent);

    // Dereference all $refs
    const spec = await $RefParser.dereference(rawSpec);

    // Generate the markdown
    const markdownOutput = generateMarkdown(spec);

    // Output the markdown
    console.log(markdownOutput);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

// Run the main function
main();
