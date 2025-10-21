ls
# Auto Planner: Your AI-Powered To-Do List

Auto Planner is a smart to-do list application that uses artificial intelligence to help you break down complex tasks into simple, manageable steps. Just describe what you need to do in plain English, and let the AI handle the planning for you.

## ✨ Features

- **AI Task Breakdown**: Describe your task in natural language (e.g., "plan a birthday party for my friend") and the AI will generate a detailed, step-by-step checklist.
- **Conversational Clarification**: If a task is ambiguous, the AI will ask follow-up questions to ensure the generated to-do list is accurate and complete.
- **Dynamic To-Do Lists**: Create, manage, and track the progress of your to-do lists with a clean and intuitive interface.
- **Search and Filter**: Easily find specific to-do lists using the search bar.
- **Modern UI**: Built with a sleek and responsive design that looks great on all devices.

## 🚀 Tech Stack

This project is built with a modern, production-ready tech stack:

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **UI Library**: [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit)
- **Platform**: Firebase Studio

## ⚙️ Getting Started

Follow these instructions to get a local copy up and running for development and testing.

### Prerequisites

Make sure you have Node.js and npm (or yarn) installed on your machine.
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```sh
   git clone <your-repository-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd auto-planner
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```

### Running the Development Server

To start the local development server, run the following command:

```sh
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser to see the application.

## 📁 Project Structure

Here's a brief overview of the key directories in this project:

- **/src/app**: Contains the core application logic, pages, and layouts using the Next.js App Router.
- **/src/ai**: Houses the AI-related code, including Genkit flows for task generation.
- **/src/components**: Includes all the reusable React components, organized by feature (e.g., `todo`, `layout`) and the `ui` components from ShadCN.
- **/src/lib**: Contains shared utilities, type definitions (`types.ts`), and other helper functions.
- **/public**: Stores static assets like images and fonts.
