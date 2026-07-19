import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeContext';
import TopNav from './components/TopNav';
import Home from './pages/Home';
import IntegrationFoundationsPage from './pages/IntegrationFoundationsPage';
import GreensPage from './pages/GreensPage';
import StokesPage from './pages/StokesPage';
import GaussPage from './pages/GaussPage';
import { MathJaxContext } from 'better-react-mathjax';

const mathJaxConfig = {
  loader: { load: ['[tex]/ams', '[tex]/esint', '[tex]/physics', '[tex]/boldsymbol'] },
  tex: {
    packages: { '[+]': ['ams', 'esint', 'physics', 'boldsymbol'] },
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    macros: {
      oiint: '{\\mathop{\\vcenter{\\mathchoice{\\huge\\bigcirc}{\\large\\bigcirc}{\\bigcirc}{\\bigcirc}}\\kern-1.5em\\iint}}',
      oiiint: '{\\mathop{\\vcenter{\\mathchoice{\\huge\\bigcirc}{\\large\\bigcirc}{\\bigcirc}{\\bigcirc}}\\kern-1.6em\\iiint}}'
    }
  },
  svg: {
    fontCache: 'global',
  },
};

export default function App() {
  return (
    <ThemeProvider>
      <MathJaxContext config={mathJaxConfig}>
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
      </MathJaxContext>
    </ThemeProvider>
  );
}
