# PyDSA - Master Python Data Structures & Algorithms

<div align="center">
  
  **The best free, open source platform to master Data Structures & Algorithms with Python**
  
  [Live Demo](https://pydsa.dev/) · [Documentation](#features) · [Report Bug](https://github.com/iambiniyam/PyDSA/issues)

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Open Source](https://img.shields.io/badge/Open_Source-100%25_Free-brightgreen?style=flat-square)
![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen?style=flat-square)

</div>

---

## ✨ Features

- **15+ Algorithms** - From basic sorting to advanced dynamic programming
- **Interactive Visualizations** - Watch algorithms execute step-by-step with beautiful animations
- **AI Tutor** - Get instant help powered by AI
- **Scientific Learning Method** - Learn through prediction, experimentation, and analysis
- **Progress Tracking** - Streaks, achievements, and detailed analytics
- **Learning Paths** - Structured courses for systematic learning
- **Dark Mode** - Beautiful responsive UI with light/dark theme support
- **No Sign-up Required** - Just open and start learning immediately
- **100% Free** - All features available to everyone
- **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- **Fast & Modern** - Built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4

## Quick Start

### Prerequisites

- Node.js 18+ or 20+
- pnpm (recommended) or npm
- A modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/iambiniyam/PyDSA.git
cd PyDSA

# Install dependencies
pnpm install

# Set up environment variables (optional - for AI tutor)
cp .env.example .env.local
# Edit .env.local and add your Aliyun DashScope API key if you want AI tutor

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Configuration

### Environment Variables (Optional)

Create a `.env.local` file for AI tutor functionality:

```env
# AI Tutor (Optional - for AI assistance feature)
# Get your API key from: https://dashscope.console.aliyun.com/
DASHSCOPE_API_KEY=your_aliyun_dashscope_api_key
```

> **Note:** The platform works fully without any API keys. AI tutor is an optional enhancement powered by Aliyun's Qwen models.

## Algorithms Included

### Searching Algorithms
- Linear Search - O(n)
- Binary Search - O(log n)
- Jump Search - O(√n)
- Interpolation Search - O(log log n)

### Sorting Algorithms
- Bubble Sort - O(n²)
- Selection Sort - O(n²)
- Insertion Sort - O(n²)
- Quick Sort - O(n log n)
- Merge Sort - O(n log n)
- Heap Sort - O(n log n)
- Counting Sort - O(n + k)

### Data Structures
- Stack (LIFO)
- Queue (FIFO)
- Binary Tree
- Graph Traversal (BFS, DFS)
- Dynamic Programming Algorithms

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run with coverage
pnpm test:coverage

# Run type checking
pnpm type-check

# Run linting
pnpm lint
```

## Tech Stack

- **Framework:** Next.js 16 (App Router with Turbopack)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **AI:** Aliyun DashScope API integration (optional)
- **Testing:** Vitest + Testing Library
- **Deployment:** Vercel

## 🤝 Contributing

Contributions are welcome! This is an open source project and we love community involvement.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Aliyun DashScope](https://dashscope.console.aliyun.com/) for AI capabilities
- [Vercel](https://vercel.com/) for hosting

---

<div align="center">
  <p>Built with ❤️ for developers who want to master algorithms</p>
  <p><strong>100% Free • Open Source • No Sign-up Required</strong></p>
  <a href="https://pydsa.dev">pydsa.dev</a>
</div>
