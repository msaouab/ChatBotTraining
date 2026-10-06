# 🤖 Gemini ChatBot Studio (PoC)

An advanced conversational AI interface and Proof of Concept built with **React**, **TypeScript**, and **Vite**, integrated directly with the **Google Gemini API** for real-time streaming dialogue, dynamic session grouping, and customizable prompt contexts.

> 📌 **Project Status: Proof of Concept (PoC) / Active Prototype**  
> Core state architecture, Gemini client streaming, conversation management, and responsive UI components are fully implemented and functional.

---

## ✨ Features

- **⚡ Real-Time AI Generation:** Seamless integration with Google's Gemini models supporting streaming conversation and temperature adjustment.
- **🗂️ Conversation & Session History:** Persistent session state management, chat grouping by date (Today, Yesterday, Previous 7 Days), and thread deletion.
- **🎨 Modern Developer-First UI:**
  - Full **Markdown & LaTeX formatting** support for messages.
  - Interactive **Code Block** component with syntax highlighting and quick-copy functionality.
  - Smart auto-scrolling with user intervention detection (`useSmartScroll`).
- **⚙️ Configurable AI Runtime:** Customizable system instructions, model parameters (temperature, token limits), and API key management stored securely in client storage.
- **📱 Fully Responsive:** Collapsible navigation sidebar and mobile-optimized chat composer.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core:** [React 18+](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling:** [Vite](https://vitejs.dev/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) (Modular stores: `chatStore`, `settingsStore`, `uiStore`)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), `clsx`, `tailwind-merge`
- **AI Engine:** [@google/genai](https://github.com/google-gemini/generative-ai-js) (Google Gemini API)
- **Code Quality:** ESLint Flat Config (`eslint.config.js`), TypeScript Strict Mode

---

## 📂 Project Structure

```text
src/
├── api/             # Gemini SDK wrapper & streaming API clients
├── components/      # Modular UI components (Composer, Message, Sidebar, etc.)
├── data/            # Static suggestion prompts & initial configuration
├── hooks/           # Custom React hooks (e.g., useSmartScroll)
├── lib/             # Utility helpers (classnames / styling)
├── stores/          # Zustand state slices (Chat, Settings, UI)
├── types/           # TypeScript domain interfaces and message types
├── utils/           # Date formatters and grouping logic
└── App.tsx          # Root layout and view composition
