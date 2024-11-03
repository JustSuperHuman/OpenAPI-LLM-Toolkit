#Minimal API Documentation Generator

This script generates Markdown documentation from an OpenAPI JSON specification, simplifying the task of creating detailed, human-readable documentation for your API.

![Generated API Documentation Example](https://just-super-human.us-east-1.linodeobjects.com/screenshots/generated-docs.png)

## How It Works

The script processes your OpenAPI spec file, extracting routes, HTTP methods, parameters, and response examples. It utilizes [`openapi-sampler`](https://www.npmjs.com/package/openapi-sampler) to create sample data for each endpoint’s response. This allows for both full and minimized examples, which are especially useful for understanding large schemas or seeing the most relevant fields when working with large language models (LLMs).

## Usage

Run the script with the following command:

```bash
node generate-api-doc.js <openapi-spec-file.json>
```

Replace `<openapi-spec-file.json>` with the path to your OpenAPI JSON file.

Example:
```bash
node generate-api-doc.js openapi-spec.json
```

If no file is provided, the script will prompt you with usage instructions.

## Example Output

When the script runs successfully, you’ll see output like this for each endpoint:

---

### **POST** `/exercise-metrics`

**Summary**: Create a new exercise metric

**Success Responses**:

- **Status 201**
  - Description: Exercise metric created successfully
  - Content-Type: `application/json`
  - Example:
    ```json
    {
      "status": "OK",
      "message": "Exercise metric created successfully"
    }
    ```

### **PUT** `/exercise-metrics/{metricCode}`

**Summary**: Update an exercise metric

**Parameters**:

- `metricCode` (path) (Required): Code of the metric to update

**Success Responses**:

- **Status 204**
  - Description: Exercise metric updated successfully
  - Content-Type: `application/json`
  - Example:
    ```json
    {
      "status": "OK",
      "message": "Exercise metric updated successfully",
      "data": {}
    }
    ```

---

## Using Minimized Data for LLMs

With APIs that return extensive data, using minimized response samples is a great way to help LLMs, like ChatGPT, focus on the essential structure and content. This script, by using `openapi-sampler`, generates streamlined examples that highlight the key parts of a response—ideal for making it easy for LLMs to interpret and work with your API responses.

## Dependencies

This script requires the following npm packages:
- `fs` (File System, native to Node.js)
- [`openapi-sampler`](https://www.npmjs.com/package/openapi-sampler) - Generates sample data from OpenAPI schema
- [`@apidevtools/json-schema-ref-parser`](https://www.npmjs.com/package/@apidevtools/json-schema-ref-parser) - Resolves `$ref` references in the OpenAPI file

Install dependencies with:
```bash
npm install openapi-sampler @apidevtools/json-schema-ref-parser
```

