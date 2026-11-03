import { useState } from 'react';
import CreateRoom from '../components/CreateRoom';
import JoinRoom from '../components/JoinRoom';
import { MessageSquare, Sun, Moon, Info, X } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const Home = () => {
  const [activeTab, setActiveTab] = useState('join');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
      
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/20 dark:bg-primary-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 dark:bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Theme Toggle - Top Left */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 left-4 p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 transition-all hover:scale-105 shadow-sm z-20"
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Info Button - Top Right */}
      <button
        onClick={() => setShowInfoModal(true)}
        className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 transition-all hover:scale-105 shadow-sm z-20"
        title="App Info"
      >
        <Info size={20} />
      </button>

      {/* Main Card */}
      <div className="w-full max-w-md glass-panel rounded-2xl p-6 sm:p-8 animate-slide-up relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4 shadow-inner">
            <MessageSquare size={32} />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 mb-2">
            TempChat
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Secure, temporary chat rooms for instant communication.
          </p>
        </div>

        {/* Custom Tabs */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl mb-6">
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === 'join' 
                ? 'bg-white dark:bg-dark-card shadow-sm text-primary-600 dark:text-primary-400' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
            }`}
          >
            Join Room
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === 'create' 
                ? 'bg-white dark:bg-dark-card shadow-sm text-primary-600 dark:text-primary-400' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
            }`}
          >
            Create Room
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px] animate-fade-in relative">
          {activeTab === 'join' ? <JoinRoom /> : <CreateRoom />}
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

export default Home;
