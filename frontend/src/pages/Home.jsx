import { useState } from 'react';
import CreateRoom from '../components/CreateRoom';
import JoinRoom from '../components/JoinRoom';
import { MessageSquare } from 'lucide-react';

const Home = () => {
  const [activeTab, setActiveTab] = useState('join');

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/20 dark:bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      
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
    </div>
  );
};

export default Home;
