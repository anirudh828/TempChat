import { useState, useRef, useEffect } from 'react';
import { Send, SmilePlus } from 'lucide-react';

const ChatBox = ({ messages, currentUser, onSendMessage, onReact, isTyping, onTyping }) => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeReactionIdx, setActiveReactionIdx] = useState(null); // tracks which message's picker is open
  const messagesEndRef = useRef(null);
  
  const chatEmojis = [
    '😀','😁','😂','🤣','😅','😊','😍','🥰','😘','😜',
    '😎','🤩','🥳','😢','😭','😤','😡','🤯','🥺','🙏',
    '👍','👎','👏','🙌','🤝','✌️','🤞','❤️','💔','🔥',
    '✨','🎉','🎊','💯','🚀','👀','💀','🤔','🤡','👻'
  ];

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
      // Need to notify backend we stopped typing immediately
      onTyping(false);
    }
  };

  // Debounce typing indicator
  const handleTyping = (e) => {
    setText(e.target.value);
    
    // Always notify typing
    onTyping(true);
    
    // Clear typing status if input is empty
    if (e.target.value === '') {
      onTyping(false);
    }
  };

  const addEmoji = (emoji) => {
    setText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50/50 dark:bg-[#0b1120] relative max-h-screen overflow-hidden">
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-2">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`animate-fade-in flex flex-col w-full`}>
              {/* Add system messages if needed, currently skipping them for pure chat */}
              {msg.isSystem ? (
                <div className="flex justify-center my-4">
                  <span className="px-3 py-1 bg-slate-200/50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs rounded-full inline-block backdrop-blur-sm">
                    {msg.text}
                  </span>
                </div>
              ) : (
                <Message 
                  msg={msg} 
                  isOwn={msg.sender === currentUser} 
                  onReact={(reaction) => { onReact(idx, reaction); setActiveReactionIdx(null); }}
                  isPickerOpen={activeReactionIdx === idx}
                  onTogglePicker={() => setActiveReactionIdx(prev => prev === idx ? null : idx)}
                />
              )}
            </div>
          ))
        )}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start my-4 animate-fade-in pl-12">
            <div className="bg-slate-200 dark:bg-slate-800 px-4 py-3 rounded-full rounded-bl-sm inline-flex gap-1 items-center max-w-[80px]">
              <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-white dark:bg-dark-card border-t border-slate-200 dark:border-slate-800 backdrop-blur-md relative">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          
          <div className="relative">
            <button 
              type="button" 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <SmilePlus size={22} />
            </button>

            {/* Emoji Popover */}
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-2 flex flex-wrap gap-1 z-50 w-64 animate-fade-in">
                {chatEmojis.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => addEmoji(emoji)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-xl"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            type="text"
            value={text}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 bg-slate-100 dark:bg-slate-800 border-none px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
          />

          <button
            type="submit"
            disabled={!text.trim()}
            className="p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-all disabled:opacity-50 disabled:scale-95 active:scale-95 flex items-center justify-center shadow-lg shadow-primary-500/30"
          >
            <Send size={20} className="ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

// Import Message component here to fix dependencies
import Message from './Message';

export default ChatBox;
