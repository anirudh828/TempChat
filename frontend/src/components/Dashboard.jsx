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
    </div>
  );
};

export default Dashboard;
