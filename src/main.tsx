import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);

// Remove the previously deployed installable-PWA worker so existing users
// return to the original website experience after the PWA feature is disabled.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
    if ('caches' in window) {
      caches.keys().then((keys) => {
        keys
          .filter((key) => key.startsWith('lumixa-shell-'))
          .forEach((key) => caches.delete(key));
      });
    }
  });
}
