---
title: "Using Workspaces in Deno"
description: "Learn how to set up and manage Deno workspaces to create monorepos with multiple interconnected packages. Understand configuration, dependency sharing, and best practices."
url: /examples/workspaces_tutorial/
---

Deno workspaces (also known as monorepos) allow you to manage multiple related
packages in a single repository. This makes it easier to share code, manage
dependencies, and maintain consistency across your projects. In this tutorial,
we'll create a simple workspace with multiple packages that depend on each
other.

## What are workspaces?

A workspace is a collection of packages that are developed and maintained
together. Each package has its own `deno.json` configuration file, and the
workspace root also has a `deno.json` file that defines which directories are
part of the workspace.

Workspaces provide several benefits:

- Share dependencies across projects
- Import packages using simple names rather than relative paths
- Apply configuration consistently or customize per package
- Simplify development of interconnected packages

## Setting up a basic workspace

Let's create a simple calculator workspace with three packages:

- A package for adding numbers (`add`)
- A package for subtracting numbers (`subtract`)
- A main application that uses both packages

### 1. Create the workspace structure

First, let's create our directory structure:

```bash
mkdir deno-workspace-demo
cd deno-workspace-demo
mkdir add subtract
```

### 2. Configure the root workspace

Create a `deno.json` file in the root directory to define the workspace:

```json
{
  "workspace": ["./add", "./subtract"],
  "imports": {
    "chalk": "npm:chalk@5"
  }
}
```

This configuration:

- Specifies that `add` and `subtract` directories are workspace members
- Sets up a shared dependency (`chalk`) that all workspace members can use

### 3. Create the add package

In the `add` directory, create a `deno.json` file:

```json
{
  "name": "@calc/add",
  "version": "1.0.0",
  "exports": "./mod.ts",
  "fmt": {
    "semiColons": false
  }
}
```

Then create a `mod.ts` file with this content:

```ts
export function add(a: number, b: number): number {
  return a + b;
}
```

Notice we're not using semicolons in this file because of the `fmt`
configuration in our `deno.json`.

### 4. Create the subtract package

In the `subtract` directory, create a `deno.json` file:

```json
{
  "name": "@calc/subtract",
  "version": "1.0.0",
  "exports": "./mod.ts"
}
```

Create a `mod.ts` file that actually uses our `add` package:

```ts
import { add } from "@calc/add";

export function subtract(a: number, b: number): number {
  return add(a, -b);
}
```

Notice how we're importing from `@calc/add` using a bare specifier instead of a
relative path like `../add/mod.ts`. This is one of the benefits of workspaces!

### 5. Create a main application

In the root directory, create a `main.ts` file:

```ts
import chalk from "chalk";
import { add } from "@calc/add";
import { subtract } from "@calc/subtract";

console.log(chalk.green(`5 + 3 = ${add(5, 3)}`));
console.log(chalk.red(`10 - 7 = ${subtract(10, 7)}`));
```

### 6. Run the application

Now we can run our application:

```bash
deno run main.ts
```

You should see colorful output showing:

```
5 + 3 = 8
10 - 7 = 3
```

## Understanding workspace resolution

When Deno sees an import like `@calc/add`, it follows these steps to resolve it:

1. Looks for a workspace configuration in the current directory and parent
   directories
2. Checks each workspace member for a matching package name
3. Resolves the import using the `exports` field in the package's `deno.json`

This allows you to use simple import specifiers instead of complex relative
paths, making your code more maintainable.

## Advanced workspace features

### Multiple entry points

You can expose multiple entry points from a package by using an object in the
`exports` field:

```json
{
  "name": "@calc/utils",
  "version": "1.0.0",
  "exports": {
    ".": "./mod.ts",
    "./helpers": "./helpers.ts",
    "./constants": "./constants.ts"
  }
}
```

This allows users to import from:

- `@calc/utils` (main entry)
- `@calc/utils/helpers`
- `@calc/utils/constants`

### Mixing Deno and npm packages

Deno workspaces can include both Deno packages and npm packages. Let's create a
simple example:

1. Create a `log` directory for an npm package:

```bash
mkdir log
```

2. Create a `package.json` in the `log` directory:

```json
{
  "name": "@calc/log",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js"
}
```

3. Create an `index.js` file in the `log` directory:

```js
export function log(message) {
  console.log(`[LOG] ${message}`);
}
```

4. Update the root `deno.json` to include the npm package:

```json
{
  "workspace": ["./add", "./subtract"],
  "imports": {
    "chalk": "npm:chalk@5",
    "@calc/log": "npm:@calc/log@1.0.0"
  }
}
```

5. Now you can use this npm package in your Deno code:

```ts
import { log } from "@calc/log";
log("Hello from npm package!");
```

### Configuration options in workspaces

Different configuration options can be applied at the workspace root level,
package level, or both. Here are some examples:

#### Shared configuration (root level)

- Import maps (`imports`)
- Node modules directory setting (`nodeModulesDir`)
- Lock file configuration (`lock`)
- Unstable flags (`unstable`)

#### Per-package configuration

- Package metadata (`name`, `version`, `exports`)
- Formatting preferences (`fmt`)
- Linting rules (`lint`)

#### Mixed configuration (inheritable with overrides)

- Compiler options (`compilerOptions`)
- Task definitions (`tasks`)
- Test settings (`test`)

## Real-world workspace structure

For larger projects, you might structure your workspace like this:

```
my-project/
├── deno.json                # Workspace configuration
├── main.ts                  # Main application entry point
├── packages/
│   ├── core/                # Core package
│   │   ├── deno.json        # Package configuration
│   │   └── mod.ts           # Package entry point
│   ├── api/                 # API package
│   │   ├── deno.json
│   │   └── mod.ts
│   └── ui/                  # UI package
│       ├── deno.json
│       └── mod.ts
└── tests/                   # Integration tests
    └── integration.test.ts
```

You would then update the root `deno.json` to include all packages:

```json
{
  "workspace": [
    "./packages/core",
    "./packages/api",
    "./packages/ui"
  ],
  "imports": {
    // Shared dependencies
  }
}
```

## Hybrid Node.js/Deno monorepo setup

Many teams need to work with both Node.js and Deno environments simultaneously,
especially during migration periods or when building applications with different
requirements. This example shows how to set up a monorepo with a Vite frontend
(Node.js-based) and a Deno backend while sharing code between them.

### Project structure

```
hybrid-monorepo/
├── deno.json                  # Root workspace config for Deno
├── package.json               # Root package.json with Node.js workspaces
├── packages/
│   ├── shared/                # Shared code used by both frontend and backend
│   │   ├── deno.json          # Deno package config
│   │   ├── package.json       # Node.js package config
│   │   └── src/
│   │       ├── types.ts       # Shared types
│   │       └── utils.ts       # Shared utilities
│   ├── backend/               # Deno backend
│   │   ├── deno.json
│   │   └── src/
│   │       └── server.ts      # Deno server
│   └── frontend/              # Vite/React frontend
│       ├── package.json
│       ├── vite.config.ts
│       └── src/
│           └── App.tsx        # React components
└── README.md
```

### 1. Set up the root configuration

Create a root `deno.json` for Deno workspace:

```json
{
  "workspace": ["./packages/shared", "./packages/backend"],
  "tasks": {
    "dev:backend": "cd packages/backend && deno run -A --watch src/server.ts",
    "dev:frontend": "cd packages/frontend && npm run dev",
    "dev": "deno task dev:backend & deno task dev:frontend"
  }
}
```

Create a root `package.json` for Node.js workspace:

```json
{
  "name": "hybrid-monorepo",
  "private": true,
  "workspaces": ["packages/shared", "packages/frontend"],
  "scripts": {
    "dev:frontend": "cd packages/frontend && npm run dev",
    "dev:backend": "cd packages/backend && deno run -A --watch src/server.ts",
    "dev": "npm-run-all --parallel dev:*"
  },
  "devDependencies": {
    "npm-run-all": "^4.1.5"
  }
}
```

### 2. Create the shared package

This package will be usable from both Deno and Node.js environments.

In `packages/shared/deno.json`:

```json
{
  "name": "@monorepo/shared",
  "version": "1.0.0",
  "exports": {
    ".": "./src/mod.ts",
    "./types": "./src/types.ts",
    "./utils": "./src/utils.ts"
  }
}
```

In `packages/shared/package.json`:

```json
{
  "name": "@monorepo/shared",
  "version": "1.0.0",
  "type": "module",
  "main": "./src/mod.ts",
  "exports": {
    ".": "./src/mod.ts",
    "./types": "./src/types.ts",
    "./utils": "./src/utils.ts"
  }
}
```

In `packages/shared/src/types.ts`:

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

In `packages/shared/src/utils.ts`:

```typescript
import type { ApiResponse } from "./types.ts";

export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  };
}

export function createErrorResponse(error: string): ApiResponse<never> {
  return {
    success: false,
    error,
  };
}
```

In `packages/shared/src/mod.ts`:

```typescript
export * from "./types.ts";
export * from "./utils.ts";
```

### 3. Create the Deno backend

In `packages/backend/deno.json`:

```json
{
  "name": "@monorepo/backend",
  "version": "1.0.0",
  "imports": {
    "@monorepo/shared": "../shared/src/mod.ts",
    "@monorepo/shared/types": "../shared/src/types.ts",
    "@monorepo/shared/utils": "../shared/src/utils.ts",
    "hono": "jsr:@hono/hono@^4",
    "hono/cors": "jsr:@hono/hono@^4/middleware/cors"
  }
}
```

In `packages/backend/src/server.ts`:

```typescript
import { Hono } from "hono";
import { cors } from "hono/cors";
import { User, createSuccessResponse, createErrorResponse } from "@monorepo/shared";

const app = new Hono();

// Set up CORS to allow requests from frontend
app.use(cors({
  origin: "http://localhost:5173", // Vite dev server
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

/ / Sample data
const users: User[] = [
  { id: "1", name: "Alice", email: "alice@example.com" },
  { id: "2", name: "Bob", email: "bob@example.com" }
];

app.get("/", (c) => c.text("Deno Backend API"));

app.get("/api/users", (c) => {
  return c.json(createSuccessResponse(users));
});

app.get("/api/users/:id", (c) => {
  const id = c.req.param("id");
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return c.json(createErrorResponse("User not found"), 404);
  }
  
  return c.json(createSuccessResponse(user));
});

console.log("Server running at http://localhost:8000");
await Deno.serve({ port: 8000 }, app.fetch).finished;
```

### 4. Create the Node.js frontend with Vite

In `packages/frontend/package.json`:

```json
{
  "name": "@monorepo/frontend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@monorepo/shared": "workspace:*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.10"
  }
}
```

In `packages/frontend/vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    // This helps Vite understand the imports from the shared package
    preserveSymlinks: true,
  },
});
```

In `packages/frontend/src/App.tsx`:

```tsx
import { useEffect, useState } from "react";
import { ApiResponse, User } from "@monorepo/shared/types";
import { createErrorResponse } from "@monorepo/shared/utils";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users");
        const result = await response.json() as ApiResponse<User[]>;

        if (result.success && result.data) {
          setUsers(result.data);
        } else {
          setError(result.error || "Unknown error");
        }
      } catch (err) {
        setError("Failed to fetch users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App">
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

### 5. Running the hybrid monorepo

To start both the backend and frontend:

```bash
# Using Deno
deno task dev

# Using npm
npm run dev
```

This will start both the Deno backend server on port 8000 and the Vite
development server on port 5173.

### Key points about this setup

1. **Shared TypeScript code**: TypeScript types and utility functions are shared
   between environments.

2. **Import strategies**:
   - In Deno, we use direct imports via the import map defined in `deno.json`
   - In Node.js, we use the workspace dependency
     (`"@monorepo/shared": "workspace:*"`)

3. **Cross-environment compatibility**:
   - The shared package has both `deno.json` and `package.json`
   - Core types and utilities work in both environments
   - TypeScript paths in Deno map directly to files, while in Node.js they're
     resolved through package.json exports

4. **Development workflow**: Start both environments simultaneously with a
   single command

5. **API consistency**: Using shared types ensures that API contracts remain
   consistent between frontend and backend

This hybrid approach allows you to gradually migrate from Node.js to Deno, or
maintain parts of your application in different runtimes while sharing code
between them.

## Best practices for workspaces

1. **Use consistent naming**: Choose a naming convention for your packages (like
   `@scope/package-name`) and stick with it.

2. **Share dependencies at root level**: Define common dependencies in the root
   `deno.json` import map.

3. **Be explicit about exports**: Only expose what you intend users to import by
   specifying them in the `exports` field.

4. **Consider containerization needs**: When containerizing a workspace, include
   the root `deno.json` and all dependent packages with the same directory
   structure.

5. **Use tasks for workspace operations**: Define common tasks in the root
   `deno.json` that apply to the whole workspace.

## Next steps

Now that you understand workspaces, you can:

- Convert an existing multi-repository project into a Deno workspace
- Create a new project with multiple interconnected packages
- Gradually migrate npm packages to Deno by including both in the same workspace

Workspaces are particularly useful for large applications, libraries with
multiple components, or when you want to organize your code base into logical,
maintainable units.

🦕 Happy coding with Deno workspaces!
