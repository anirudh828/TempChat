import { Users, MessageSquare, Clock, Info } from 'lucide-react';

const Dashboard = ({ roomInfo, userCount, messageCount }) => {
  if (!roomInfo) return null;

  // Calculate remaining time
  const expiryTime = new Date(roomInfo.expiryTime).getTime();
  const now = new Date().getTime();
  const diffMinutes = Math.max(0, Math.floor((expiryTime - now) / (1000 * 60)));
  const diffHours = Math.floor(diffMinutes / 60);
  const remainingMins = diffMinutes % 60;

  let timeDisplay = `${diffMinutes} mins`;
  if (diffHours > 0) {
    timeDisplay = `${diffHours}h ${remainingMins}m`;
  }

  return (
    <div className="bg-white dark:bg-dark-card border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800 w-full sm:w-64 md:w-80 flex-shrink-0 flex flex-col transition-all">
      
      {/* Header Info */}
      <div className="p-4 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          Room Info
        </h2>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800/50 p-2 rounded-lg mt-3">
          <Info size={16} className="text-primary-500" />
          ID: <span className="text-slate-800 dark:text-slate-200 font-bold tracking-wide">{roomInfo.roomId}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-1 gap-4 flex-1">
        
        {/* Creator Name */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Users size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Creator</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">{roomInfo.creator}</p>
          </div>
        </div>

        {/* Active Users */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
            <Users size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Users</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{userCount}</p>
          </div>
        </div>

        {/* Total Messages */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
            <MessageSquare size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Messages</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{messageCount}</p>
          </div>
        </div>

        {/* Time Remaining */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
            <Clock size={18} />
          </div>
          <div>
            <p className="text-xs text-red-600/70 dark:text-red-400/80 font-medium">Time Remaining</p>
            <p className="text-sm font-bold text-red-700 dark:text-red-400">{timeDisplay}</p>
          </div>
        </div>

      </div>

      {/* Credit Footer */}
      <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800 text-center flex flex-col items-center gap-4">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Made with <span className="text-red-500">❤️</span> By{' '}
          <span className="font-semibold text-slate-500 dark:text-slate-400">S.Anirudh Reddy</span>
        </p>
        <a
          href="https://github.com/anirudh828"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          My GitHub Repo
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
