# Sanity MCP Server

A Model Context Protocol (MCP) server for interacting with Sanity.io content management system.

## 🌟 Overview

This server implements the Model Context Protocol (MCP) to provide Large Language Models (LLMs) with secure, controlled access to Sanity.io's content management system. It enables AI assistants to query, create, update, and manage content in Sanity through a standardized interface.

## 🔧 Features

- **GROQ Queries**: Execute GROQ queries and subscribe to real-time updates
- **Document Management**: Create, read, update, and delete documents
- **Content Publishing**: Publish and unpublish documents
- **Release Management**: Create and manage content releases
- **Schema Inspection**: List and inspect schema types
- **Embeddings**: Perform semantic search on embeddings indices
- **Project Management**: List organizations, projects, and studios

## 🚀 Installation

### NPX (Recommended)

Run directly without installation:

```bash
npx sanity-mcp-server
```

### Global Installation

```bash
npm install -g sanity-mcp-server
sanity-mcp-server
```

### Local Installation

```bash
# Clone the repository
git clone https://github.com/anttoon/sanity-mcp.git
cd sanity-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Run the server
npm start
```

### Docker

```bash
# Run with Docker
docker run -it --env-file .env anttoon/sanity-mcp-server

# Or build and run locally
docker build -t sanity-mcp-server .
docker run -it --env-file .env sanity-mcp-server
```

## ⚙️ Configuration

Create a `.env` file with the following variables:

```
SANITY_TOKEN=your_sanity_api_token
SANITY_PROJECT_ID=your_sanity_project_id
SANITY_DATASET=your_sanity_dataset
SANITY_API_VERSION=your_sanity_api_version
```

## 🔌 Integration with Claude AI

### Basic Configuration

```json
{
  "mcpServers": {
    "sanity": {
      "command": "npx",
      "args": ["-y", "sanity-mcp-server"],
      "env": {
        "SANITY_TOKEN": "your_sanity_api_token",
        "SANITY_PROJECT_ID": "your_sanity_project_id",
        "SANITY_DATASET": "your_sanity_dataset",
        "SANITY_API_VERSION": "2025-03-15"
      }
    }
  }
}
```

### Using Docker

```json
{
  "mcpServers": {
    "sanity": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "anttoon/sanity-mcp-server"],
      "env": {
        "SANITY_TOKEN": "your_sanity_api_token",
        "SANITY_PROJECT_ID": "your_sanity_project_id",
        "SANITY_DATASET": "your_sanity_dataset",
        "SANITY_API_VERSION": "2025-03-15"
      }
    }
  }
}
```

## 🛠️ Available Tools

### GROQ Queries
- `query`: Execute GROQ queries
- `subscribeToUpdates`: Subscribe to real-time updates
- `getGroqSpecification`: Get GROQ language specification

### Document Retrieval
- `getDocument`: Get document(s) by ID
- `getDocuments`: Get multiple documents by IDs

### Document Mutations
- `createDocument`: Create a new document
- `updateDocument`: Update existing document(s)
- `mutateDocument`: Perform multiple operations on a document
- `deleteDocument`: Delete document(s)
- `batchMutations`: Perform multiple mutations across documents
- `updatePortableText`: Update Portable Text fields

### Document Actions
- `publishDocument`: Publish document(s)
- `unpublishDocument`: Unpublish document(s)
- `createRelease`: Create a content release
- `addDocumentToRelease`: Add document to a release
- `removeDocumentFromRelease`: Remove document(s) from a release
- `listReleaseDocuments`: List documents in a release
- `createDocumentVersion`: Create document version(s) in a release
- `unpublishDocumentWithRelease`: Mark document(s) for unpublishing

### Schema Management
- `listSchemaTypes`: List available schema types
- `getTypeSchema`: Get detailed schema for a type

### Embeddings and Semantic Search
- `semanticSearch`: Perform semantic search on embeddings
- `listEmbeddingsIndices`: List available embeddings indices

### Project Management
- `listOrganizationsAndProjects`: List organizations and projects
- `listStudios`: List studios for a project

## 💻 Development

### Project Structure

```
sanity-mcp-server/
├── config/            # Configuration files for tools
├── src/
│   ├── controllers/   # Feature controllers
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   └── index.ts       # Entry point
├── test/              # Test files
└── scripts/           # Development scripts
```

### Development Commands

```bash
# Start development server with auto-reload
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Build for production
npm run build
```

## 📄 License

MIT

## 🔗 Links

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Sanity.io](https://www.sanity.io/)
- [GitHub Repository](https://github.com/anttoon/sanity-mcp)
