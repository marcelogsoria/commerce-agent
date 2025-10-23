# Commerce Agent Service

> The core backend service that orchestrates the conversational AI agent.

This service is the heart of the Commerce Agent project. It is a Node.js application built with Fastify that exposes an API to receive incoming messages, process them with an AI agent, and interact with the Commercetools platform.

## ⚙️ Key Functionalities

*   **Receives Webhooks:** Listens for incoming messages from messaging platforms (initially Twilio for WhatsApp).
*   **AI Agent Orchestration:** Initializes and runs the LangChain-based AI agent.
*   **State Management:** Manages conversation history for each user.
*   **Commerce Platform Integration:** Connects to the Commercetools API via the `@commercetools/agent-essentials` package to fetch product data and manage carts.

## Endpoints

### `POST /message`

This is the primary endpoint for the service. It is designed to be used as a webhook for the Twilio WhatsApp API.

*   **Payload:** Expects a Twilio message object, which includes the user's message (`Body`) and their WhatsApp ID (`WaId`).
*   **Functionality:** When a message is received, it is passed to the AI agent for processing. The agent's response is then sent back to the user via the Twilio API.

## 🧪 Testing with Bruno

This project includes a [Bruno](https://www.usebruno.com/) collection for easy API testing. Bruno is an open-source API client that allows you to make requests to the service's endpoints.

The collection is located in the `bruno/` directory and includes a pre-configured request for the `/message` endpoint.

To use it:
1.  Open the Bruno API client.
2.  Open the collection from the `bruno/` directory in this service.
3.  The "Send Message" request will be available for you to use. You can modify the `Body` and `WaId` in the request body to simulate different user messages.

## 🛠️ Configuration

This service requires a set of environment variables to be configured in a `.env` file within this directory (`apps/commerce-agent-service/.env`).

Please refer to the **[Configuration section in the main project README](../../README.md#configuration)** for a detailed list of all required variables and how to set them up.

## 🚀 Running the Service

This service is managed as part of the root project's monorepo. To run it in development mode, navigate to the root of the `commerce-agent` project and run:

```bash
npm run dev
```

This command will start the service with hot-reloading enabled.