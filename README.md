<div align="center">
  <h1>Signature Verification System</h1>
  <p>An AI-Powered Handwritten & Digital Signature Verification application built with React, Vite, and Tailwind CSS.</p>

  [![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-success?style=for-the-badge&logo=render)](https://signature-verification-system-l5bu.onrender.com)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
</div>

---

## 🚀 Live Demo

Experience the live application here: **[Signature Verification System on Render](https://signature-verification-system-l5bu.onrender.com)**

## 📖 Overview

The **Signature Verification System** provides a highly secure and intuitive interface to verify handwritten signatures using artificial intelligence. Once a signature is verified as genuine, it allows the user to securely generate a cryptographic digital signature (RSA-SHA256) for a target document, ensuring non-repudiation and document integrity.

## ✨ Key Features

- **AI Handwritten Signature Analysis**: Evaluates strokes, pressure patterns, and line variations to detect forgeries.
- **Cryptographic Digital Signatures**: Generates 2048-bit RSA keys and SHA-256 hashes to digitally sign documents.
- **Controlled Workflow**: Ensures a digital signature can only be generated after the handwritten signature successfully passes the AI verification.
- **Modern User Interface**: A clean, responsive, and accessible interface built with shadcn-ui and Tailwind CSS.

## 🛠️ Technologies Used

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, shadcn-ui, Radix UI
- **Cryptography**: Web Crypto API (RSA-PSS, SHA-256)
- **Backend/AI (Optional)**: Supabase Edge Functions (with a robust local fallback for demonstrations)

## 💻 Getting Started

### Prerequisites

Ensure you have Node.js and npm installed. You can download them [here](https://nodejs.org/).

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/mohdadnanmohi/-Signature-Verification-System.git
   ```
2. Navigate to the project directory:
   ```sh
   cd -Signature-Verification-System
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
