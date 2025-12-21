# GEMINI Agent Guidelines for the Commerce Agent Repository

This document provides a comprehensive, technical guide for the Gemini agent to effectively understand, navigate, and modify the `commerce-agent` codebase. Adhering to these guidelines will ensure that generated responses are high-quality, idiomatic, and align with the project's standards.

## 1. Guiding Principles

These are the foundational rules for all contributions:

- **Favor Readability Over Performance:** Code should be clear, well-structured, and easy for human developers to understand. Avoid overly complex or "clever" solutions if a more straightforward one exists.
- **Add Comments When Necessary:** Use comments to explain the _why_ behind complex logic, business rules, or non-obvious implementations. Do not comment on the _what_ if the code is self-explanatory.

## 2. Tech Stack

The project is a TypeScript monorepo utilizing the following technologies:

| Category              | Technology                                                       | Notes                                                            |
| --------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Package Manager**   | `npm`                                                            | Used for workspace and dependency management.                    |
| **Monorepo Tool**     | [Turborepo](https://turbo.build/repo)                            | Manages tasks and builds across the monorepo.                    |
| **Backend Framework** | [Fastify](https://fastify.dev/)                                  | A high-performance, low-overhead web framework for Node.js.      |
| **Language**          | [TypeScript](https://www.typescriptlang.org/)                    | Provides static typing for JavaScript.                           |
| **LLM Orchestration** | [LangChain.js](https://js.langchain.com/)                        | Used for building and managing the conversational agent's logic. |
| **-- LLM Graph**      | [LangGraph](https://js.langchain.com/docs/langgraph)             | For creating cyclical, agent-like behaviors.                     |
| **-- LLM Provider**   | [OpenAI](https://js.langchain.com/docs/integrations/chat/openai) | Interface for OpenAI models.                                     |
| **Schema/Validation** | [Zod](https://zod.dev/)                                          | For robust schema declaration and validation.                    |
| **Testing**           | [Jest](https://jestjs.io/)                                       | The primary framework for unit and integration testing.          |
| **Linting**           | [ESLint](https://eslint.org/)                                    | Enforces code quality and style rules.                           |
| **Formatting**        | [Prettier](https://prettier.io/)                                 | For consistent, automated code formatting.                       |
| **E-commerce**        | [commercetools](https://commercetools.com/)                      | The core commerce platform integration.                          |
| **Communication**     | [Twilio](https://www.twilio.com/)                                | Used for messaging capabilities (e.g., SMS).                     |

## 3. Project Structure

This is a monorepo managed by Turborepo and npm workspaces.

- **`/apps`**: Contains the main, deployable applications.
  - **`commerce-agent-service`**: The core backend service that powers the conversational agent.
- **`/packages`**: Contains shared code, configurations, or libraries used across different apps.
  - **`typescript-config`**: Shared TypeScript `tsconfig.json` configurations.
- **`/.github`**: CI/CD workflows (e.g., GitHub Actions).
- **`/.husky`**: Git hooks for pre-commit checks.
- **`/bruno`**: API client collections for testing the service's endpoints.

## 4. `commerce-agent-service` Deep Dive

This is the heart of the project.

### Architecture

The service is built with Fastify and uses a plugin-centric architecture.

- **`@fastify/autoload`**: This plugin is key. It automatically loads all plugins and routes from the `src/plugins` and `src/routes` directories. This means to add a new route, you simply create a new file in the `src/routes` directory.
- **`@fastify/sensible`**: Pre-packages several essential utilities, including sensible defaults for HTTP errors. When you need to return a standard error (e.g., `404 Not Found`, `400 Bad Request`), use `fastify.httpErrors`.
- **Plugin-first approach**: Core functionality is encapsulated in Fastify plugins. See the files in `src/plugins` for examples (`commercetools.ts`, `twilio.ts`). When adding new, cross-cutting concerns (like a database connector or a new API client), create it as a plugin and register it.

### Core Directories

- **`src/`**: The main source code for the application.
  - **`app.ts`**: The entry point for assembling the Fastify application, registering plugins, and setting up middleware.
  - **`index.ts`**: The script that starts the server. It handles graceful shutdown via `close-with-grace`.
  - **`llmGraphs/`**: Contains the logic for the LangGraph agent state machine. This is where the core conversational flow is defined.
  - **`llmPrompts/`**: Stores the base prompts and prompt templates used to instruct the LLM.
  - **`llmTools/`**: Defines tools the LangChain agent can use (e.g., `getDocumentationTool`). These are functions the agent can call to interact with the outside world.
  - **`plugins/`**: Custom Fastify plugins for integrating with external services (e.g., `commercetools`, `twilio`).
  - **`routes/`**: The API routes for the service. Each file typically defines a set of related endpoints.
- **`test/`**: Contains Jest tests. The structure mirrors the `src/` directory.

## 5. Development Workflow

### Installation

To install all dependencies for the entire monorepo, run the following from the project root:

```bash
npm install
```

### Running in Development

To start the `commerce-agent-service` in watch mode (restarts on file changes):

```bash
npm run dev
```

This command is defined in the root `package.json` and uses `turbo` to run the `dev` script in the appropriate workspace.

### Building for Production

To build all workspaces:

```bash
npm run build
```

To run the built `commerce-agent-service`:

```bash
npm start --workspace=commerce-agent-service
```

### Testing

To run all tests across the monorepo:

```bash
npm test
```

This will run Jest for all workspaces that have a `test` script.

### Linting & Formatting

To check for linting errors:

```bash
npm run lint
```

To automatically format all files with Prettier:

```bash
npm run format
```

## 6. Coding Conventions

- **TypeScript and Zod**: Use TypeScript for all new code. Define explicit types and interfaces. For API request/response bodies and environment variables, use Zod to define schemas for runtime validation.
- **Fastify Plugins**: When creating a new plugin, use the `fastify-plugin` wrapper to prevent encapsulation issues. Decorate the Fastify instance to expose the plugin's functionality to other parts of the application.
- **Async/Await**: Use `async/await` for all asynchronous operations.
- **Error Handling**: Utilize `@fastify/sensible` (`reply.badRequest()`, `reply.notFound()`, etc.) for standard HTTP errors. For internal errors, throw custom error classes and use a `try...catch` block at the appropriate level to handle them.
- **Environment Variables**: All environment variables must be documented in `.env.example`. Use `dotenv` for local development and access variables via `process.env`. Never commit `.env` files.

## 7. API Testing with Bruno

The `/bruno` directory contains a collection for the [Bruno API client](https://www.usebruno.com/).

- To test the API, open the `commerce-agent` collection in Bruno.
- The `environments/local.bru` file contains environment variables for local testing (e.g., the server address).
- Use the `send-message.bru` request to interact with the agent's primary endpoint.

This provides a structured, repeatable way to test API endpoints during development.

## 8. Commit Messages

While not strictly enforced by a linter, please follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This helps create a more readable and automated git history.

- **`feat`**: A new feature.
- **`fix`**: A bug fix.
- **`docs`**: Documentation only changes.
- **`style`**: Changes that do not affect the meaning of the code (white-space, formatting, etc).
- **`refactor`**: A code change that neither fixes a bug nor adds a feature.
- **`test`**: Adding missing tests or correcting existing tests.
- **`chore`**: Changes to the build process or auxiliary tools.
