import { Component, ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Kutilmagan xatoda oq ekran o'rniga do'stona xabar ko'rsatadi va saqlangan eski ma'lumotni tozalaydi
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(e: unknown) {
    console.error(e);
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="p-10 text-center">
        <p className="mb-4">Sahifani ko'rsatishda xatolik yuz berdi. Iltimos, sahifani yangilang.</p>
        <button
          className="rounded-lg bg-brand-600 px-5 py-2.5 text-white"
          onClick={() => {
            try { localStorage.removeItem("apexedu:site:v1"); } catch { /* ignore */ }
            location.reload();
          }}
        >
          Yangilash
        </button>
      </div>
    );
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Boundary>
      <App />
    </Boundary>
  </StrictMode>
);
