# API Checklist Generator

This script generates a checklist in Markdown format based on an OpenAPI specification file. It organizes endpoints by tags and provides direct links to the Swagger documentation for easy access to each endpoint’s details. The checklist is ideal for developers to use as a guide when building or verifying API endpoints.

## Purpose

The checklist created by this script helps ensure that each endpoint in the API has been implemented and tested. By organizing the endpoints into categories (tags), it provides a structured, task-based approach to API development, allowing developers to track the progress of building or reviewing each endpoint.

## How It Works

1. **Load OpenAPI JSON**: The script reads an OpenAPI JSON file (e.g., `justgains-openapi.json`) that describes the API structure, including paths, methods, tags, responses, and summaries.
  
2. **Group Endpoints by Tags**: Each endpoint is categorized by tags defined in the OpenAPI spec. If no tags are specified, the endpoint is grouped under "Untagged."

3. **Generate Checklist**: 
   - For each tag and endpoint, the script creates a checklist item with:
     - HTTP method and path
     - Link to the Swagger documentation for easy access
     - Summary of the endpoint
   - **Responses**: For each endpoint, the expected responses are listed as sub-items, indicating the status codes and descriptions (e.g., 200 for success, 401 for unauthorized access).

4. **Save Checklist**: The generated checklist is saved as `api-checklist.md` in the same directory as the OpenAPI JSON file.

## How to Use

1. **Prerequisites**:
   - Ensure you have Node.js installed.
   - Place the OpenAPI JSON file (`justgains-openapi.json`) in the directory structure expected by the script.

2. **Run the Script**:
   - Execute the script from the command line, providing the path to the OpenAPI file as an argument:
     ```bash
     node <script_name>.js <path_to_openapi.json>
     ```
   - For example:
     ```bash
     node api-checklist-generator.js ../justgains-openapi.json
     ```

3. **View the Checklist**:
   - After the script runs, it creates a file named `api-checklist.md` in the specified output location.
   - Open this file to view a checklist of endpoints, each grouped by category and linked to the Swagger documentation.

## Example Checklist

Here’s an example of the output:

```markdown
# API Checklist

## Authentication

- [ ] GET [/auth/user](https://dev.api.justgains.com/#/Authentication/getUserInfo) - Get current user information
  - [ ] 200 Response: User information retrieved successfully
  - [ ] 401 Response: Failed to retrieve user information

- [ ] PUT [/auth/user](https://dev.api.justgains.com/#/Authentication/updateUserInfo) - Update user information
  - [ ] 201 Response: User information updated successfully
  - [ ] 400 Response: Failed to update user information

- [ ] POST [/auth/signup](https://dev.api.justgains.com/#/Authentication/registerUser) - Register a new user
  - [ ] 204 Response: User registered successfully
  - [ ] 400 Response: Invalid parameters
```

## Notes

- **Swagger Link**: Each endpoint includes a link to its corresponding Swagger documentation for quick reference.
- **Checkable Items**: Each endpoint and its possible responses are represented as checkable items, which can help track the completion status for each endpoint during development or testing.

This script provides an efficient way to transform OpenAPI documentation into a useful, actionable checklist that can aid in API planning, implementation, and verification.