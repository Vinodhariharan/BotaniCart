import React from "react";
import ReactDOM from "react-dom/client";  // ✅ Correct import for Vite
import App from "./App";
import {CartProvider}  from "./component/AllComp/CardContext";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error here
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// Then use it:


const root = ReactDOM.createRoot(document.getElementById("root")); 
root.render(
  <React.StrictMode>
    <ErrorBoundary>
    <CartProvider>
      <App />
      </CartProvider>
      </ErrorBoundary>

  </React.StrictMode>
);
