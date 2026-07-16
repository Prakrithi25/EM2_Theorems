import { HashRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ThemeProvider } from './theme/ThemeContext';
import TopNav from './components/TopNav';
import Home from './pages/Home';
import GreensPage from './pages/GreensPage';
import FoundationsPage from './pages/FoundationsPage';

const StokesPage = lazy(() => import('./pages/StokesPage'));
const GaussPage = lazy(() => import('./pages/GaussPage'));

function PageLoading() {
  return (
    <div className="flex-1 flex items-center justify-center text-sm" style={{ color: 'var(--ink-soft)' }}>
      Loading module…
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
          <TopNav />
          <Suspense fallback={<PageLoading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/foundations" element={<FoundationsPage />} />
              <Route path="/greens" element={<GreensPage />} />
              <Route path="/stokes" element={<StokesPage />} />
              <Route path="/gauss" element={<GaussPage />} />
            </Routes>
          </Suspense>
        </div>
      </HashRouter>
    </ThemeProvider>
  );
}
