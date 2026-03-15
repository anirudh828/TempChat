import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChatRoom from './pages/ChatRoom';

function App() {
  // Removed theme toggling - enforcing Dark Mode implicitly.
  return (
    <Router>
      <div className="w-full h-screen font-sans flex flex-col relative overflow-hidden bg-dark-bg text-dark-text">
        <main className="w-full h-full flex flex-col flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:roomId" element={<ChatRoom />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
