# Commerce Agent

> A conversational AI agent that enables seamless purchasing experiences directly within chat applications like WhatsApp.

This project aims to create a customizable, multi-tenant platform that allows any business to sell its products through a smart, conversational assistant.

## ✨ Vision

To make buying from any business in Argentina and beyond as easy and natural as texting a friend.

## 🚧 Project Status: Proof of Concept (POC)

**This project is currently in the Proof of Concept (POC) phase.**

The primary objective is to validate the core user journey and the proposed technical architecture. The focus is on functionality and learning, not on creating a production-ready application at this stage.

_Last updated: September 2025_

## 🎯 POC Goals

The specific goals for this initial version are:

1.  **Validate User Experience:** Prove that users are willing and able to complete a purchase via a chat interface, and that the experience is simple and smooth.
2.  **Technical Feasibility:** Confirm the end-to-end technical flow: `WhatsApp -> AI Service -> Stripe Payment -> Confirmation`.
3.  **AI Effectiveness:** Test the ability of a Large Language Model (LLM) to act as an effective sales assistant for a limited product catalog.
4.  **Architectural Foundation:** Establish a modular backend that can be extended to other channels (like Telegram) in the future.

## 🛠️ Technology Stack

This project is being built with a modern, scalable stack:

* **Backend:** TypeScript, Node.js
* **AI / LLM:** OpenAI / Google Gemini
* **Payments:** Stripe
* **Messaging Platform:** WhatsApp Business Platform API
* **Database:** PostgreSQL (using a simple JSON file for the initial POC)
* **Containerization:** Docker

## 🚀 Getting Started

Instructions on how to set up and run the project locally will be added here once the initial services are built.

### Prerequisites

* Node.js (v22 or higher)
* Docker
* A Stripe account and API keys
* A Meta for Developers account for WhatsApp API access

### Installation

```bash
# 1. Clone the repository
git clone [https://github.com/marcelogsoria/commerce-agent.git](https://github.com/marcelogsoria/commerce-agent.git)

# 2. Navigate to the project directory
cd commerce-agent

# 3. Install dependencies (assuming a monorepo setup)
npm install

# 4. Set up environment variables
cp .env.example .env

# 5. Run the application
docker-compose up --build
```

## 🗺️ Roadmap

The development of this POC is broken down into several phases, from initial planning to deployment. For a detailed breakdown of tasks and current progress, please refer to the repository's **[GitHub Issues](https://github.com/marcelogsoria/commerce-agent/issues)** and **[Project Board](https://github.com/marcelogsoria/commerce-agent/projects)**.

## 📚 Documentation

For detailed documentation, including:

* Architectural Diagrams
* Phase 0 Definitions (Product, Audience, etc.)
* Architecture Decision Records (ADR)

Please see the **[Official Project Wiki](https://github.com/marcelogsoria/commerce-agent/wiki)**.