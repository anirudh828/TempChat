import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, User, Hash, Loader2, LogIn } from 'lucide-react';

const JoinRoom = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    roomId: '',
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const res = await fetch(`${apiUrl}/rooms/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to join room');
      }

      // If successful, navigate to the room
      navigate(`/room/${data.room.roomId}`, { 
        state: { 
          username: formData.username,
          roomId: data.room.roomId,
          isCreator: false,
          initialMessages: data.room.messages
        } 
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-fade-in">
      
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800/50">
          {error}
        </div>
      )}

      {/* Room ID Input */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Room ID
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Hash size={18} />
          </div>
          <input
            type="text"
            name="roomId"
            required
            value={formData.roomId}
            onChange={handleChange}
            placeholder="e.g. abcd1234"
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-bg border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all font-mono placeholder:font-sans placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Username Input */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Your Username
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <User size={18} />
          </div>
          <input
            type="text"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-bg border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Password Input */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Room Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <KeyRound size={18} />
          </div>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter room password"
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-bg border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg font-medium transition-colors focus:ring-4 focus:ring-slate-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <>
            Join Room <LogIn size={18} />
          </>
        )}
      </button>

    </form>
  );
};

export default JoinRoom;
