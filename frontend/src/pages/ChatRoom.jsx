import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Dashboard from '../components/Dashboard';
import ChatBox from '../components/ChatBox';
import { LogOut, X, Sun, Moon, Info } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const ChatRoom = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);
  const [userCount, setUserCount] = useState(location.state?.initialUserCount || 1);
  const [activeTypers, setActiveTypers] = useState(new Set());
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const username = location.state?.username;
  const isCreator = location.state?.isCreator || false;

  useEffect(() => {
    if (!username || !roomId) {
      navigate('/');
      return;
    }

    if (location.state?.initialMessages) {
      setMessages(location.state.initialMessages);
    }

    const apiUrl = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? `${window.location.origin}/api` : 'http://localhost:5000/api');
    const socketUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;

    if (location.state?.roomInfo) {
      setRoomInfo(location.state.roomInfo);
    } else {
      // Fetch public room metadata from backend
      fetch(`${apiUrl}/rooms/${roomId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.room) {
            setRoomInfo(data.room);
          }
        })
        .catch(err => console.error('Failed to load room details:', err));
    }
    
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join_room', { roomId, username });
    });

    newSocket.on('user_joined', (data) => {
      setMessages(prev => [...prev, { isSystem: true, text: data.message }]);
      setUserCount(prev => prev + 1);
    });

    newSocket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('receive_reaction', ({ messageIndex, reaction }) => {
      setMessages(prev => {
        const newMsgs = [...prev];
        if (newMsgs[messageIndex]) {
          const currentReactions = newMsgs[messageIndex].reactions || {};
          const currentCount = currentReactions[reaction] || 0;
          currentReactions[reaction] = currentCount + 1;
          newMsgs[messageIndex].reactions = currentReactions;
        }
        return newMsgs;
      });
    });

    newSocket.on('user_typing', ({ username: typingUser, isTyping }) => {
      setActiveTypers(prev => {
        const newSet = new Set(prev);
        if (isTyping) newSet.add(typingUser);
        else newSet.delete(typingUser);
        return newSet;
      });
    });

    newSocket.on('user_left', (data) => {
      setMessages(prev => [...prev, { isSystem: true, text: data.message }]);
      setUserCount(prev => Math.max(1, prev - 1));
    });

    return () => {
      newSocket.emit('leave_room', { roomId, username });
      newSocket.disconnect();
    };
  }, [roomId, username, navigate, location.state]);

  const handleSendMessage = (text) => {
    if (socket) {
      const msgData = { roomId, sender: username, text };
      socket.emit('send_message', msgData);
      setMessages(prev => [...prev, { 
        ...msgData, 
        timestamp: new Date().toISOString(),
        reactions: {}
      }]);
    }
  };

  const handleReaction = (messageIndex, reaction) => {
    if (socket) {
      socket.emit('send_reaction', { roomId, messageIndex, reaction });
      setMessages(prev => {
        const newMsgs = [...prev];
        if (newMsgs[messageIndex]) {
          const currentReactions = newMsgs[messageIndex].reactions || {};
          const currentCount = currentReactions[reaction] || 0;
          currentReactions[reaction] = currentCount + 1;
          newMsgs[messageIndex].reactions = currentReactions;
        }
        return newMsgs;
      });
    }
  };

  const handleTyping = (isTyping) => {
    if (socket) {
      socket.emit('typing', { roomId, username, isTyping });
    }
  };

  const leaveRoom = () => {
    navigate('/');
  };

  if (!username) return null;

  return (
    <div className="h-full w-full flex flex-col sm:flex-row overflow-hidden bg-white dark:bg-dark-bg">
      
      {/* Leave Room Confirmation Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-700 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Leave Room?</h3>
              <button 
                onClick={() => setShowLeaveModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Are you sure you want to leave this room? You can rejoin later with the room ID and password.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLeaveModal(false)}
                className="flex-1 py-2 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={leaveRoom}
                className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-500/30"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Header */}
      <div className="sm:hidden flex items-center justify-between p-3 bg-white dark:bg-dark-card border-b border-slate-200 dark:border-slate-800 z-10">
        <h1 className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600">
          Room {roomId}
        </h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowInfoModal(true)}
            title="App Info"
            className="p-1.5 text-slate-500 hover:text-primary-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Info size={16} />
          </button>
          <button
            onClick={toggleTheme}
            className="p-1.5 text-slate-500 hover:text-primary-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button 
            onClick={() => setShowLeaveModal(true)}
            className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Sidebar Dashboard */}
      <div className="hidden sm:block sm:w-64 md:w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card z-10 sticky top-0 h-full overflow-y-auto">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md z-20">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600">
            TempChat
          </h1>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowInfoModal(true)}
              title="App Info"
              className="p-2 text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Info size={18} />
            </button>
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              onClick={() => setShowLeaveModal(true)}
              title="Leave Room"
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
        <Dashboard 
          roomInfo={roomInfo || { roomId, creator: isCreator ? username : 'Unknown', expiryTime: Date.now() + 3600000 }} 
          userCount={userCount} 
          messageCount={messages.filter(m => !m.isSystem).length} 
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#0b1120] relative">
        <div className="flex-1 overflow-hidden">
          <ChatBox 
            messages={messages} 
            currentUser={username} 
            onSendMessage={handleSendMessage}
            onReact={handleReaction}
            isTyping={activeTypers.size > 0}
            onTyping={handleTyping}
          />
        </div>
      </div>

      {/* Info Popup Modal */}
      {showInfoModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setShowInfoModal(false)}
        >
          <div 
            className="w-full max-w-xs glass-panel rounded-2xl p-6 shadow-2xl relative animate-slide-up bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-700/80"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Cross Button */}
            <button
              onClick={() => setShowInfoModal(false)}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close"
            >
              <X size={18} />
            </button>

            {/* Info Content */}
            <div className="flex flex-col items-center text-center pt-2">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-3 shadow-inner">
                <Info size={24} />
              </div>
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 mb-1">
                TempChat
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Secure Temporary Chat Rooms
              </p>

              <div className="w-full py-3 px-4 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  By: <span className="text-primary-600 dark:text-primary-400 font-bold">AniRed</span>
                </p>
                <p className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                  v1.2.7
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
