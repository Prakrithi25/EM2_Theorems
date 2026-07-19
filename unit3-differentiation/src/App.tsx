import { ThemeProvider } from './theme/ThemeContext';
import TopNav from './components/TopNav';
import Unit3Page from './pages/Unit3Page';
import { MathJaxContext } from 'better-react-mathjax';

const mathJaxConfig = {
  loader: { load: ['[tex]/ams'] },
  tex: {
    packages: { '[+]': ['ams'] },
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
  },
  svg: {
    fontCache: 'global',
  },
};

export default function App() {
  return (
    <ThemeProvider>
      <MathJaxContext config={mathJaxConfig}>
        <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
          <TopNav />
          <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <Unit3Page />
          </main>
        </div>
      </MathJaxContext>
    </ThemeProvider>
  );
}
