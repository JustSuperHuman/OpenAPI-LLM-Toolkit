const fs = require("fs");
const path = require("path");

// Global variable for the root URL
const SWAGGER_ROOT_URL = "https://dev.api.justgains.com";

// Load the OpenAPI JSON file
const openApiPath = path.join(__dirname, "..", "justgains-openapi.json");
const openApiData = JSON.parse(fs.readFileSync(openApiPath, "utf8"));

// Function to create a Swagger link
function createSwaggerLink(tag, operationId) {
  const encodedTag = encodeURIComponent(tag);
  const encodedOperationId = encodeURIComponent(operationId);
  return `${SWAGGER_ROOT_URL}/#/${encodedTag}/${encodedOperationId}`;
}

// Function to create the checklist
function createChecklist(data) {
  let checklist = "# API Checklist\n\n";
  const taggedEndpoints = {};

  // Group endpoints by tags
  for (const [path, pathItem] of Object.entries(data.paths)) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (method !== "parameters") {
        const tags = operation.tags || ["Untagged"];
        tags.forEach((tag) => {
          if (!taggedEndpoints[tag]) {
            taggedEndpoints[tag] = [];
          }
          taggedEndpoints[tag].push({
            path,
            method: method.toUpperCase(),
            summary: operation.summary || "No summary",
            responses: operation.responses || {},
            operationId: operation.operationId || "",
          });
        });
      }
    }
  }

  // Sort tags and create checklist
  const sortedTags = Object.keys(taggedEndpoints).sort();
  sortedTags.forEach((tag) => {
    const [mainTag, subTag] = tag.split("|").map((t) => t.trim());

    if (!subTag) {
      checklist += `## ${mainTag}\n\n`;
    } else {
      checklist += `### ${subTag}\n\n`;
    }

    taggedEndpoints[tag].forEach((endpoint) => {
      const swaggerLink = createSwaggerLink(tag, endpoint.operationId);
      checklist += `- [ ] ${endpoint.method} [${endpoint.path}](${swaggerLink}) - ${endpoint.summary}\n`;

      // Add responses to the checklist
      Object.entries(endpoint.responses).forEach(([statusCode, response]) => {
        checklist += `  - [ ] ${statusCode} Response: ${
          response.description || "No description"
        }\n`;
      });

      checklist += "\n";
    });

    checklist += "\n";
  });

  return checklist;
}

// Update the main execution logic
if (process.argv.length < 3) {
  console.error(
    "Please provide the path to the OpenAPI JSON file as an argument."
  );
  process.exit(1);
}

// Generate the checklist
const checklistContent = createChecklist(openApiData);

// Save the checklist as a markdown file
const outputPath = path.join(path.dirname(openApiPath), "api-checklist.md");
fs.writeFileSync(outputPath, checklistContent);

console.log(`API checklist has been created: ${outputPath}`);
