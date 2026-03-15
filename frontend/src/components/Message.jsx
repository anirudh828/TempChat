import { Smile, User } from 'lucide-react';

// isPickerOpen and onTogglePicker are controlled by parent (ChatBox) to ensure only one picker at a time
const Message = ({ msg, isOwn, onReact, isPickerOpen, onTogglePicker }) => {
  const reactionsList = ['👍', '❤️', '😂', '🔥', '🎉'];

  // Format time
  const time = new Date(msg.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`flex flex-col mb-4 w-full ${isOwn ? 'items-end' : 'items-start'} animate-slide-up`}>
      <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[75%] ${isOwn ? 'flex-row-reverse self-end' : 'flex-row self-start'}`}>
        
        {/* Avatar Placeholder */}
        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
          <User size={16} />
        </div>

        {/* Message Bubble container */}
        <div className={`group relative flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
          {/* Sender Name */}
          {!isOwn && (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 ml-1">
              {msg.sender}
            </span>
          )}

          {/* Bubble */}
          <div 
            className={`relative px-4 py-2.5 rounded-2xl ${
              isOwn 
                ? 'bg-primary-600 text-white rounded-br-sm' 
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-sm shadow-sm'
            }`}
          >
            <p className="text-[15px] leading-relaxed break-words">{msg.text}</p>
            
            {/* Hover Reaction Button */}
            <button
              onClick={onTogglePicker}
              className={`absolute top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white dark:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-600 transition-opacity ${
                isOwn ? '-left-10' : '-right-10'
              } opacity-0 group-hover:opacity-100`}
            >
              <Smile size={16} />
            </button>

            {/* Reaction Picker Popover — controlled by parent */}
            {isPickerOpen && (
              <div className={`absolute top-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg px-2 py-1.5 flex flex-row flex-nowrap gap-0.5 z-50 ${
                isOwn ? 'right-0' : 'left-0'
              } animate-fade-in`}>
                {reactionsList.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onReact(r);
                    }}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors active:scale-95"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            {/* Timestamp */}
            <span className="text-[11px] text-slate-400 dark:text-slate-500 px-1">
              {time}
            </span>

            {/* Render Active Reactions */}
            {msg.reactions && Object.keys(msg.reactions).length > 0 && (
              <div className={`flex gap-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                {Object.entries(msg.reactions).filter(([, users]) => Array.isArray(users) ? users.length > 0 : users > 0).map(([reaction, users]) => (
                  <span 
                    key={reaction}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700"
                  >
                    <span>{reaction}</span>
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{Array.isArray(users) ? users.length : users}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
