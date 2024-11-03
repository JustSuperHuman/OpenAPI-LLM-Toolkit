# 🛠️ OpenAPI-Toolkit

A collection of handy tools for working with OpenAPI specifications, particularly focused on making them more LLM-friendly. Whether you're documenting APIs, comparing specs, or preparing API context for AI tools, this toolkit has got you covered!

## 🧰 What's in the Box?

### 📋 API Checklist Generator
Turns your OpenAPI spec into a practical Markdown checklist. Perfect for:
- Tracking API implementation progress
- Verifying endpoint functionality
- Organizing testing efforts
- Quick access to Swagger docs for each endpoint

### 🔍 Compare API Docs
Spot the differences between two OpenAPI specs easily. Super useful when:
- Comparing generated Swagger specs with your maintained docs
- Tracking API evolution over time
- Catching unintended API changes
- Ensuring documentation stays in sync with implementation

### 🌳 File Tree Generator with OpenAPI Components
Creates a structured view of your project's OpenAPI components. Great for:
- Providing context to LLMs about your API structure
- Understanding component relationships
- Navigating large API specifications
- Visualizing the organization of your API docs

### 📝 Minimal API Documentation Generator
Generates clean, focused Markdown documentation from your OpenAPI spec. Features:
- Human-readable format
- Sample response data generation
- Minimized examples perfect for LLM context
- Clear endpoint organization

### ✂️ Split OpenAPI by Tag
Breaks down your OpenAPI spec into smaller, tag-based documents. Ideal for:
- Feeding specific API sections to LLMs
- Working with microservices
- Managing large API specifications
- Creating focused documentation sets

## 🚀 Getting Started

Each tool lives in its own directory with specific instructions. Here's the quick rundown:

1. **Generate a Checklist**:
```bash
cd "API Checklist Generator"
node create-api-checklist.js path/to/openapi.json
```

2. **Compare API Specs**:
```bash
cd "Compare API Docs"
node compare-openapi-docs.js <old-spec> <new-spec>
```

3. **Generate File Tree**:
```bash
cd "Generate File Tree with OpenAPI Component Structure"
node build-open-api-file-tree.js
```

4. **Create Minimal Docs**:
```bash
cd "Minimal API Documentation Generator"
node generate-minimal-api-docs.js path/to/openapi.json
```

5. **Split by Tags**:
```bash
cd "Split OpenAPI by Tag Script"
node split-api-docs.js path/to/openapi.json [output-dir]
```

## 🤖 LLM Integration

These tools are designed to work great with LLMs (Large Language Models) like ChatGPT:

- Use the file tree generator to give LLMs context about your API structure
- Feed minimized API docs to LLMs for more focused responses
- Use split specs to work with specific parts of your API
- Generate checklists for systematic API reviews
- Track changes between spec versions for maintenance

## 📚 Learn More

Each tool has its own detailed readme in its directory. Check them out for:
- Detailed usage instructions
- Example outputs
- Configuration options
- Dependencies and setup

## 🤝 Contributing

Feel free to contribute! Whether it's adding new tools, improving existing ones, or fixing bugs, all contributions are welcome.

## 📄 License

This toolkit is available under the MIT License.
