import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { AuthProvider } from "./context/AuthContext.tsx";

// <-- import

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
  
  <Provider store={store}> 
    <AuthProvider>
      <App />
      </AuthProvider>
      </Provider>
    
    
  </React.StrictMode>
);
