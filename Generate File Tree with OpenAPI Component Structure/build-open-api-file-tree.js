const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const ignore = require("ignore");

function parseGitignore(gitignorePath) {
  const ig = ignore();
  try {
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
    ig.add(gitignoreContent);
  } catch (error) {
    console.warn(`Warning: Could not read .gitignore file: ${error.message}`);
  }
  ig.add("**/*justgains*");
  ig.add(".*/**");
  return ig;
}

function generateTree(
  dir,
  ig,
  projectRoot,
  components,
  prefix = "",
  isLast = true
) {
  const basename = path.basename(dir);
  const newPrefix = prefix + (isLast ? "    " : "│   ");
  let result = prefix + (isLast ? "└── " : "├── ") + basename + "\n";

  try {
    const list = fs.readdirSync(dir).filter((file) => {
      const fullPath = path.join(dir, file);
      const relativePath = path.relative(projectRoot, fullPath);
      if (fs.statSync(fullPath).isDirectory() && file.startsWith(".")) {
        return false;
      }
      return !ig.ignores(relativePath);
    });

    list.forEach((file, index) => {
      const filePath = path.join(dir, file);
      const isDirectory = fs.statSync(filePath).isDirectory();
      const isLastItem = index === list.length - 1;

      if (isDirectory) {
        result += generateTree(
          filePath,
          ig,
          projectRoot,
          components,
          newPrefix,
          isLastItem
        );
      } else {
        result += newPrefix + (isLastItem ? "└── " : "├── ") + file + "\n";

        // If this file has components, list them
        const relativePath = path.relative(projectRoot, filePath);
        if (components[relativePath]) {
          components[relativePath].forEach((component) => {
            result += newPrefix + "    └── #" + component + "\n";
          });
        }
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }

  return result;
}

function findOpenAPIComponents(dir, ig, projectRoot) {
  const components = {};

  function traverse(currentDir) {
    const list = fs.readdirSync(currentDir).filter((file) => {
      const fullPath = path.join(currentDir, file);
      const relativePath = path.relative(projectRoot, fullPath);
      if (fs.statSync(fullPath).isDirectory() && file.startsWith(".")) {
        return false;
      }
      return !ig.ignores(relativePath);
    });

    list.forEach((file) => {
      const filePath = path.join(currentDir, file);
      const isDirectory = fs.statSync(filePath).isDirectory();

      if (isDirectory) {
        traverse(filePath);
      } else if (file.endsWith(".yaml") || file.endsWith(".yml")) {
        try {
          const content = fs.readFileSync(filePath, "utf8");
          const parsedYaml = yaml.load(content);
          const relativeFilePath = path.relative(projectRoot, filePath);
          components[relativeFilePath] = extractComponents(parsedYaml);
        } catch (error) {
          console.error(`Error parsing ${filePath}:`, error);
        }
      }
    });
  }

  traverse(dir);
  return components;
}

function extractComponents(obj) {
  const componentNames = [];

  if (typeof obj === "object" && obj !== null) {
    Object.keys(obj).forEach((key) => {
      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        "type" in obj[key]
      ) {
        componentNames.push(key);
      }
    });
  }

  return componentNames;
}

// Set to the root of the project, assuming the script is inside a "scripts" directory
const projectRoot = path.join(__dirname, "..");
const gitignorePath = path.join(projectRoot, ".gitignore");

// Parse .gitignore
const ig = parseGitignore(gitignorePath);

// Find OpenAPI components
const openAPIComponents = findOpenAPIComponents(projectRoot, ig, projectRoot);

// Generate the tree from the project root, including components
const tree = generateTree(projectRoot, ig, projectRoot, openAPIComponents);

// Write to file
fs.writeFileSync(path.join(projectRoot, "tree.list"), tree);

console.log(
  "Tree structure with integrated OpenAPI components has been written to tree.list"
);
