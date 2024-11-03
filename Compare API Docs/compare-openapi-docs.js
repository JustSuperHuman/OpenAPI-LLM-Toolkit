const { exec } = require("child_process");
const fs = require("fs");
const https = require("https");
const path = require("path");
const util = require("util");
const $RefParser = require("json-schema-ref-parser");

const execPromise = util.promisify(exec);
const writeFilePromise = util.promisify(fs.writeFile);

function isUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const tempPath = `temp-${Date.now()}.json`;
    const file = fs.createWriteStream(tempPath);

    https
      .get(url, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve(tempPath);
        });
      })
      .on("error", (err) => {
        fs.unlink(tempPath, () => reject(err));
      });
  });
}

async function getFilePath(input) {
  if (isUrl(input)) {
    console.log(`Downloading ${input}...`);
    return await downloadFile(input);
  }
  return input;
}

function resolveJsonPointer(obj, pointer) {
  const parts = pointer.split("/").slice(1);
  let current = obj;
  for (let part of parts) {
    part = part.replace(/~1/g, "/").replace(/~0/g, "~");
    if (current[part] === undefined) {
      throw new Error(`Invalid JSON pointer: ${pointer}`);
    }
    current = current[part];
  }
  return current;
}

function replaceCircularRefs(obj, schema, refChain = []) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if ("$ref" in obj) {
    const refValue = obj["$ref"];
    if (refChain.includes(refValue)) {
      return { type: "string", example: `Circular reference to ${refValue}` };
    }

    try {
      const resolved = resolveJsonPointer(schema, refValue);
      return replaceCircularRefs(resolved, schema, [...refChain, refValue]);
    } catch (error) {
      console.warn(`Failed to resolve $ref: ${refValue}`, error);
      return {
        type: "string",
        example: `Failed to resolve reference: ${refValue}`,
      };
    }
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => replaceCircularRefs(item, schema, refChain));
  }

  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    newObj[key] = replaceCircularRefs(value, schema, refChain);
  }

  return newObj;
}

async function preprocessSpec(inputPath) {
  console.log(`Preprocessing ${inputPath}...`);
  let schema = await $RefParser.parse(inputPath);
  schema = replaceCircularRefs(schema, schema);
  const outputPath = `preprocessed-${path.basename(inputPath)}`;
  await writeFilePromise(outputPath, JSON.stringify(schema, null, 2));
  return outputPath;
}

async function bundleSpec(inputPath) {
  const outputPath = `bundled-${path.basename(inputPath)}`;
  console.log(`Bundling ${inputPath}...`);
  await execPromise(
    `redocly bundle --dereferenced ${inputPath} --output ${outputPath}`
  );
  return outputPath;
}

async function compareSpecs(oldSpec, newSpec) {
  let oldPath,
    newPath,
    oldPreprocessed,
    newPreprocessed,
    oldBundled,
    newBundled;

  try {
    oldPath = await getFilePath(oldSpec);
    newPath = await getFilePath(newSpec);

    oldPreprocessed = await preprocessSpec(oldPath);
    newPreprocessed = await preprocessSpec(newPath);

    oldBundled = await bundleSpec(oldPreprocessed);
    newBundled = await bundleSpec(newPreprocessed);

    console.log("Comparing specs...");
    const { stdout, stderr } = await execPromise(
      `openapi-diff ${oldBundled} ${newBundled}`
    );

    if (stderr) {
      console.error(`Stderr: ${stderr}`);
    }
    console.log(stdout);
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // Clean up temporary files
    [
      oldPath,
      newPath,
      oldPreprocessed,
      newPreprocessed,
      oldBundled,
      newBundled,
    ].forEach((file) => {
      if (
        file &&
        (file.startsWith("temp-") ||
          file.startsWith("preprocessed-") ||
          file.startsWith("bundled-"))
      ) {
        //fs.unlinkSync(file);
      }
    });
  }
}

// Check if both arguments are provided
if (process.argv.length < 4) {
  console.log("Usage: node script.js <old-spec> <new-spec>");
  process.exit(1);
}

if (process.argv.length > 1) {
  console.log(
    "Oh yeah... this script really doesn't work... but it's a good start!"
  );
  process.exit(1);
}

const oldSpec = process.argv[2];
const newSpec = process.argv[3];

compareSpecs(oldSpec, newSpec);
