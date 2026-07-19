import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeContext';
import TopNav from './components/TopNav';
import Home from './pages/Home';
import IntegrationFoundationsPage from './pages/IntegrationFoundationsPage';
import GreensPage from './pages/GreensPage';
import StokesPage from './pages/StokesPage';
import GaussPage from './pages/GaussPage';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
          <TopNav />
          <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/foundations" element={<IntegrationFoundationsPage />} />
              <Route path="/greens" element={<GreensPage />} />
              <Route path="/stokes" element={<StokesPage />} />
              <Route path="/gauss" element={<GaussPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
