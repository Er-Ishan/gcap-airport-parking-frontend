import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import '../public/assets/scss/main.scss'
import App from './App.tsx'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { apiFetch } from './services/parkingApi.ts';

const API = import.meta.env.VITE_API_URL as string;
const FALLBACK_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

// Prefer the key stored in DB (per-company); fall back to the env var if the DB row isn't saved yet
const stripePromise = apiFetch(`${API}/api/payment-config`)
  .then(r => r.json())
  .then(data => {
    const key = data.publishable_key || FALLBACK_PK;
    return key ? loadStripe(key) : null;
  })
  .catch(() => FALLBACK_PK ? loadStripe(FALLBACK_PK) : null);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </StrictMode>,
)
