# Commerce Agent

> A conversational AI agent that enables seamless purchasing experiences directly within chat applications like WhatsApp.

This project aims to create a customizable, multi-tenant platform that allows any business to sell its products through a smart, conversational assistant.

## ✨ Vision

To make buying from any business in Argentina and beyond as easy and natural as texting a friend.

## 🚧 Project Status: Proof of Concept (POC)

**This project is currently in the Proof of Concept (POC) phase.**

The primary objective is to validate the core user journey and the proposed technical architecture. The focus is on functionality and learning, not on creating a production-ready application at this stage.

_Last updated: October 2025_

## 🎯 POC Goals

The specific goals for this initial version are:

1.  **Validate User Experience:** Prove that users are willing and able to complete a purchase via a chat interface, and that the experience is simple and smooth.
2.  **Technical Feasibility:** Confirm the end-to-end technical flow: `WhatsApp -> AI Service -> Commercetools -> Confirmation`.
3.  **AI Effectiveness:** Test the ability of a Large Language Model (LLM) to act as an effective sales assistant for a limited product catalog.
4.  **Architectural Foundation:** Establish a modular backend that can be extended to other channels (like Telegram) in the future.

## 🛠️ Technology Stack

This project is being built with a modern, scalable stack:

*   **Backend:** TypeScript, Node.js, Fastify
*   **AI / LLM:** LangChain.js, OpenAI / Google Gemini
*   **Commerce Platform:** Commercetools (via `@commercetools/agent-essentials`)
*   **Messaging Platform:** Twilio (for WhatsApp)
*   **Database:** The POC currently uses an in-memory store for conversation history. PostgreSQL is planned for future development.
*   **Containerization:** Docker (Note: Docker setup is planned but not yet implemented in the POC).

## 🏢 Project Structure

This project is a monorepo using npm workspaces.

*   `apps/`: Contains the individual, runnable applications.
    *   `commerce-agent-service`: The main backend service that handles incoming messages and orchestrates the AI agent.
*   `packages/`: Contains shared code, configurations, and utilities.
    *   `typescript-config`: Shared TypeScript configurations for the monorepo.

## 🚀 Getting Started

Follow these instructions to set up and run the project locally for development.

### Prerequisites

*   Node.js (v22 or higher)
*   Docker
*   A Twilio account with a WhatsApp-enabled number.
*   A Commercetools project.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/marcelogsoria/commerce-agent.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd commerce-agent
    ```
3.  **Install dependencies:**
    This will install dependencies for all packages in the monorepo.
    ```bash
    npm install
    ```

### Configuration

1.  **Create the environment file:**
    Navigate to the `apps/commerce-agent-service` directory and copy the example environment file.
    ```bash
    cd apps/commerce-agent-service
    cp .env.example .env
    ```
2.  **Edit the environment variables:**
    Open the newly created `.env` file and fill in the required values.

| Variable                  | Description                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| `OPENAI_MODEL_NAME`       | The name of the OpenAI model to use (e.g., `gpt-4o-mini`).                                                |
| `TWILIO_ACCOUNT_SID`      | Your Twilio Account SID.                                                                                |
| `TWILIO_AUTH_TOKEN`       | Your Twilio Auth Token.                                                                                 |
| `TWILIO_NUMBER`           | Your Twilio phone number associated with the WhatsApp sender.                                           |
| `CT_PROJECT_KEY`          | The project key of your Commercetools project.                                                          |
| `CT_CLIENT_ID`            | The client ID for your Commercetools API client.                                                        |
| `CT_CLIENT_SECRET`        | The client secret for your Commercetools API client.                                                    |
| `CT_AUTH_URL`             | The authentication URL for your Commercetools project.                                                  |
| `CT_API_URL`              | The API URL for your Commercetools project.                                                             |

### Running the Application

1.  **Start the development server:**
    From the root of the project, run the following command:
    ```bash
    npm run dev
    ```
    This command starts the `commerce-agent-service` in development mode with hot-reloading, so it will automatically restart when you make changes to the code.

### Testing and Linting

This project is set up with Jest for testing and ESLint for linting.

**Running Tests**

To run the test suite, run the following command from the root of the project:

```bash
npm test
```

**Running Linting**

To check the code for linting errors, run the following command from the root of the project:

```bash
npm run lint
```

### CI/CD

This project uses GitHub Actions to run linting and testing on every pull request and on every push to the `main` branch. You can see the workflow configuration in `.github/workflows/ci.yml`.

### Local Test Interface

This project includes a web-based chat interface for local testing and development. This allows you to interact with the commerce agent directly in your browser without needing to configure Twilio or use WhatsApp.

Once the development server is running, you can access the chat interface at:

[http://localhost:3000/](http://localhost:3000/)

The interface also displays useful environment information to help with debugging.

## 🗺️ Roadmap

The development of this POC is broken down into several phases, from initial planning to deployment. For a detailed breakdown of tasks and current progress, please refer to the repository's **[GitHub Issues](https://github.com/marcelogsoria/commerce-agent/issues)** and **[Project Board](https://github.com/marcelogsoria/commerce-agent/projects)**.

## 📚 Documentation

For detailed documentation, including:

*   Architectural Diagrams
*   Phase 0 Definitions (Product, Audience, etc.)
*   Architecture Decision Records (ADR)

Please see the **[Official Project Wiki](https://github.com/marcelogsoria/commerce-agent/wiki)**.
