
# BotaniCart - Full Stack Garden eCommerce Platform

Welcome to **BotaniCart**, a refreshed and fully functional full-stack eCommerce web application for garden and plant lovers. Built with **Vite**, **React.js**, and **MUI Joy UI**, it leverages **Firebase** for authentication, database, and backend services.

**[Live Demo →](https://botani-cart.vercel.app/)**

---

## Features

- Modern UI with MUI Joy for a clean and minimal experience
- Firebase Authentication (Sign up / Sign in / Secure routing)
- Product catalog powered by Firebase Firestore
- Fully functional shopping cart
- Search and filter plants
- Admin support for product management
- Fully responsive design (Coming soon)
- Review and Comments section (Coming soon)

---

## Tech Stack

- **Frontend**: React.js (with Vite), MUI Joy UI
- **Backend**: Firebase (Firestore, Auth)
- **Deployment**: Vercel

---

## Screenshots

*(You can insert screenshots here later)*

---

## Folder Structure (Simplified)

```
botanicar-cart/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/      # Firebase config and API helpers
│   ├── context/       # Auth and Cart Context
│   ├── App.jsx
│   └── main.jsx
├── .env
├── vite.config.js
└── README.md
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/botanicar-cart.git
cd botanicar-cart
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add Firebase config

Create a `.env` file at the root and include your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run locally

```bash
npm run dev
```

---

## Coming Soon

- Admin dashboard for inventory management  
- Personalized plant recommendations  
- AI-based chatbot using Gemini API or similar  

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

MIT License

---

## Author

Built with love by Vinodhariharan Ravi
