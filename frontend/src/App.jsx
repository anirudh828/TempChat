import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import Home from './pages/Home';
import ChatRoom from './pages/ChatRoom';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="w-full h-screen font-sans flex flex-col relative overflow-hidden bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-dark-text">
          <main className="w-full h-full flex flex-col flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/room/:roomId" element={<ChatRoom />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
