import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Dashboard from '../components/Dashboard';
import ChatBox from '../components/ChatBox';
import { LogOut } from 'lucide-react';

const ChatRoom = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);
  const [userCount, setUserCount] = useState(1);
  const [activeTypers, setActiveTypers] = useState(new Set());
  const [hostWarning, setHostWarning] = useState(null); // Warning banner text

  // Extracted state from location
  const username = location.state?.username;
  const isCreator = location.state?.isCreator || false;

  useEffect(() => {
    // If user navigates directly without joining/creating, kick them out
    if (!username || !roomId) {
      navigate('/');
      return;
    }

    // Set initial messages if available (from join-room API response)
    if (location.state?.initialMessages) {
      setMessages(location.state.initialMessages);
    }

    // Optional: Fetch full room info if we only have initial data
    if (location.state?.isCreator) {
      setRoomInfo({
        roomId,
        creator: username,
        expiryTime: new Date(Date.now() + 60 * 60 * 1000) // Dummy for immediate render
      });
    }

    // Initialize Socket
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    // Remove /api for socket connection
    const socketUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
    
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    // Socket Event Listeners
    newSocket.on('connect', () => {
      // Join the specific room via socket
      newSocket.emit('join_room', { roomId, username });
    });

    newSocket.on('user_joined', (data) => {
      setMessages(prev => [...prev, { isSystem: true, text: data.message }]);
      setUserCount(prev => prev + 1);
    });

    newSocket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('receive_reaction', ({ messageIndex, reaction, username: reactorUser }) => {
      setMessages(prev => {
        const newMsgs = [...prev];
        if (newMsgs[messageIndex]) {
          const prevReactions = newMsgs[messageIndex].reactions || {};
          const reactors = prevReactions[reaction] || [];
          if (!reactors.includes(reactorUser)) {
            newMsgs[messageIndex] = {
              ...newMsgs[messageIndex],
              reactions: {
                ...prevReactions,
                [reaction]: [...reactors, reactorUser]
              }
            };
          }
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

    // Host disconnected — show warning banner
    newSocket.on('host_disconnected', (data) => {
      setHostWarning(data.message);
    });

    // Host reconnected — clear warning banner
    newSocket.on('host_reconnected', (data) => {
      setHostWarning(null);
      setMessages(prev => [...prev, { isSystem: true, text: data.message }]);
    });

    // Room deleted — kick everyone back home after a short delay
    newSocket.on('room_deleted', (data) => {
      setHostWarning(data.message);
      setTimeout(() => navigate('/'), 3000); // 3s so they can read the message
    });

    // Cleanup on unmount
    return () => {
      newSocket.emit('leave_room', { roomId, username });
      newSocket.disconnect();
    };
  }, [roomId, username, navigate, location.state]);

  const handleSendMessage = (text) => {
    if (socket) {
      const msgData = { roomId, sender: username, text };
      socket.emit('send_message', msgData);
      // Optimistically append message
      setMessages(prev => [...prev, { 
        ...msgData, 
        timestamp: new Date().toISOString(),
        reactions: {}
      }]);
    }
  };

  const handleReaction = (messageIndex, reaction) => {
    if (socket) {
      // Check if already reacted with this emoji
      const msg = messages[messageIndex];
      const reactors = msg?.reactions?.[reaction] || [];
      if (reactors.includes(username)) return; // already reacted

      socket.emit('send_reaction', { roomId, messageIndex, reaction });
      // Optimistically update
      setMessages(prev => {
        const newMsgs = [...prev];
        if (newMsgs[messageIndex]) {
          const prevReactions = newMsgs[messageIndex].reactions || {};
          const prevReactors = prevReactions[reaction] || [];
          newMsgs[messageIndex] = {
            ...newMsgs[messageIndex],
            reactions: {
              ...prevReactions,
              [reaction]: [...prevReactors, username]
            }
          };
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
    if (window.confirm("Are you sure you want to leave this room?")) {
      navigate('/');
    }
  };

  if (!username) return null; // Prevent flicker before redirect

  return (
    <div className="h-full w-full flex flex-col sm:flex-row overflow-hidden bg-white dark:bg-dark-bg">
      
      {/* Mobile Header / Quick Info */}
      <div className="sm:hidden flex items-center justify-between p-3 bg-white dark:bg-dark-card border-b border-slate-200 dark:border-slate-800 z-10">
        <h1 className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600">
          Room {roomId}
        </h1>
        <button 
          onClick={leaveRoom}
          className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* Sidebar Dashboard */}
      <div className="hidden sm:block sm:w-64 md:w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card z-10 sticky top-0 h-full overflow-y-auto">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md z-20">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600">
            TempChat
          </h1>
          <button 
            onClick={leaveRoom}
            title="Leave Room"
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
        <Dashboard 
          roomInfo={roomInfo || { roomId, creator: isCreator ? username : 'Unknown', expiryTime: Date.now() + 3600000 }} 
          userCount={userCount} 
          messageCount={messages.filter(m => !m.isSystem).length} 
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#0b1120] relative">

        {/* Host Disconnect Warning Banner */}
        {hostWarning && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-red-600/90 text-white text-sm font-medium text-center justify-center z-20 animate-fade-in backdrop-blur-sm border-b border-red-500">
            <span>⚠️</span>
            <span>{hostWarning}</span>
          </div>
        )}

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
    </div>
  );
};

export default ChatRoom;
