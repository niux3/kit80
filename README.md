# kit80

A lightweight, zero-dependency JavaScript framework for Single Page Applications (SPA), built entirely on top of modern W3C standards, native Web Components, and an explicit dependency injection architecture—without the overhead of a Virtual DOM.

---

## Key Features

- **Zero Virtual DOM:** Relies on direct, high-performance native DOM updates (`replaceChildren` / atomic renders).
- **Native Web Components First:** Encapsulate all UI interactivity into native Custom Elements with standard lifecycle hooks (`connectedCallback`, `disconnectedCallback`).
- **IoC Container:** Built-in Dependency Injection container to keep services (View renderer, Router, custom APIs) decoupled and easily testable.
- **Pipeline-Based Dispatcher:** Lifecycle-driven routing with built-in middleware support (`beforeLoad`, `beforeRender`, `afterRender`, `beforeDestroy`, `afterDestroy`).
- **Flicker-Free Transitions:** Smart view swapping that keeps the current view visible while asynchronous assets or controller actions resolve.
- **Fully Documented & Tested:** Strict JSDoc typing throughout the codebase and comprehensive unit tests powered by Vitest and Happy DOM.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          kit80 Core                             │
│   Router  •  Dispatcher  •  Middleware  •  IoC Container        │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                    Dispatches routes & lifecycle
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Controllers & Views                        │
│         Handle context, fetch data, render templates            │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                     Instantiates UI interactivity
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Native Custom Elements                       │
└─────────────────────────────────────────────────────────────────┘
```
---

## Getting Started

### Prerequisites

- Node.js (>= 18.0.0)
- Modern browser supporting ES Modules and Custom Elements v1

### Installation

Clone the repository and install dependencies:

```bash
git clone [https://github.com/niuxe/kit80.git](https://github.com/niuxe/kit80.git)
cd kit80
npm install
```