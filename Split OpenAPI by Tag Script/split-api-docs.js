const fs = require("fs");
const path = require("path");

// Utility to deep clone objects
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// Load the OpenAPI document
const loadOpenApiSpec = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error("Error loading OpenAPI spec:", error);
    process.exit(1);
  }
};

// Write a JSON object to a specified file
const writeToFile = (dir, fileName, data) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(dir, fileName),
    JSON.stringify(data, null, 2),
    "utf8"
  );
};

// Resolve $ref references in the OpenAPI spec
const resolveRef = (ref, spec) => {
  const refPath = ref.replace(/^#\//, "").split("/");
  let result = spec;
  for (const part of refPath) {
    result = result[part];
    if (!result) {
      throw new Error(`Reference ${ref} could not be resolved.`);
    }
  }
  return result;
};

// Recursively resolve all $refs and allOf in the given schema
const resolveSchema = (schema, spec) => {
  if (schema.$ref) {
    return resolveSchema(resolveRef(schema.$ref, spec), spec);
  }

  if (schema.allOf) {
    return schema.allOf.reduce((acc, part) => {
      return { ...acc, ...resolveSchema(part, spec) };
    }, {});
  }

  const resolvedSchema = deepClone(schema);
  for (const key in resolvedSchema) {
    if (typeof resolvedSchema[key] === "object") {
      resolvedSchema[key] = resolveSchema(resolvedSchema[key], spec);
    }
  }

  return resolvedSchema;
};

// Split OpenAPI spec by tags
const splitByTag = (spec, outputDir) => {
  const {
    paths,
    components,
    servers,
    security,
    externalDocs,
    info,
    openapi,
    tags,
  } = spec;
  const tagsMap = {};

  // Iterate over paths and split by tag
  for (const [pathKey, pathItem] of Object.entries(paths)) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (
        [
          "get",
          "post",
          "put",
          "delete",
          "patch",
          "options",
          "head",
          "trace",
        ].includes(method)
      ) {
        if (operation.tags) {
          operation.tags.forEach((tag) => {
            // Handle | character in tags
            const baseTag = tag.split("|")[0];
            if (!tagsMap[baseTag]) {
              tagsMap[baseTag] = {
                openapi,
                info,
                servers: servers ? deepClone(servers) : [],
                security: security ? deepClone(security) : [],
                externalDocs: externalDocs
                  ? deepClone(externalDocs)
                  : undefined,
                tags: tags ? tags.filter((t) => t.name === baseTag) : [],
                paths: {},
                components: {
                  schemas: {},
                  responses: {},
                  parameters: {},
                  requestBodies: {},
                  headers: {},
                  securitySchemes: {},
                  examples: {},
                  links: {},
                  callbacks: {},
                },
              };
            }
            if (!tagsMap[baseTag].paths[pathKey]) {
              tagsMap[baseTag].paths[pathKey] = {};
            }
            tagsMap[baseTag].paths[pathKey][method] = deepClone(operation);
          });
        }
      }
    }
  }

  // Filter components used by each tag
  const findUsedComponents = (obj, spec, usedComponents) => {
    if (obj && typeof obj === "object") {
      for (const key in obj) {
        if (key === "$ref") {
          const ref = obj[key];
          const refPath = ref.replace(/^#\//, "").split("/");
          if (refPath[0] === "components") {
            const componentType = refPath[1];
            const componentName = refPath[2];
            if (!usedComponents[componentType]) {
              usedComponents[componentType] = {};
            }
            if (!usedComponents[componentType][componentName]) {
              usedComponents[componentType][componentName] = resolveRef(
                ref,
                spec
              );
              findUsedComponents(
                usedComponents[componentType][componentName],
                spec,
                usedComponents
              );
            }
          }
        } else {
          findUsedComponents(obj[key], spec, usedComponents);
        }
      }
    }
  };

  // Write each tag's OpenAPI spec to a separate file
  for (const [tag, tagSpec] of Object.entries(tagsMap)) {
    const usedComponents = {
      schemas: {},
      responses: {},
      parameters: {},
      requestBodies: {},
      headers: {},
      securitySchemes: {},
      examples: {},
      links: {},
      callbacks: {},
    };

    // Resolve all $refs in paths and find used components
    for (const [pathKey, pathItem] of Object.entries(tagSpec.paths)) {
      for (const [method, operation] of Object.entries(pathItem)) {
        if (operation.requestBody) {
          findUsedComponents(operation.requestBody, spec, usedComponents);
          operation.requestBody = resolveSchema(operation.requestBody, spec);
        }
        if (operation.responses) {
          for (const [statusCode, response] of Object.entries(
            operation.responses
          )) {
            findUsedComponents(response, spec, usedComponents);
            tagSpec.paths[pathKey][method].responses[statusCode] =
              resolveSchema(response, spec);
          }
        }
        if (operation.parameters) {
          operation.parameters.forEach((param) => {
            findUsedComponents(param, spec, usedComponents);
            param = resolveSchema(param, spec);
          });
        }
        if (operation.security) {
          operation.security.forEach((sec) =>
            findUsedComponents(sec, spec, usedComponents)
          );
        }
        if (operation.callbacks) {
          for (const [callbackName, callback] of Object.entries(
            operation.callbacks
          )) {
            findUsedComponents(callback, spec, usedComponents);
            operation.callbacks[callbackName] = resolveSchema(callback, spec);
          }
        }
      }
    }

    // Add used components to the tag spec
    tagSpec.components = usedComponents;

    writeToFile(outputDir, `${tag}.json`, tagSpec);
  }
};

// Main function to execute the script
const main = () => {
  const inputFilePath = process.argv[2];
  const outputDir = process.argv[3] || "./output";

  if (!inputFilePath) {
    console.error(
      "Usage: node splitOpenApiByTag.js <inputFilePath> [outputDir]"
    );
    process.exit(1);
  }

  const openApiSpec = loadOpenApiSpec(inputFilePath);
  splitByTag(openApiSpec, outputDir);
  console.log("OpenAPI spec split by tags successfully.");
};

main();
