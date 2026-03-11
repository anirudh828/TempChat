import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, User, Clock, Loader2, ArrowRight } from 'lucide-react';

const CreateRoom = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    roomId: '', // Optional custom ID
    password: '',
    expiryMinutes: 60
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
      
      const payload = {
        username: formData.username,
        password: formData.password,
        expiryMinutes: Number(formData.expiryMinutes)
      };

      // Only attach optional custom roomId if it was written
      if (formData.roomId.trim() !== '') {
        payload.roomId = formData.roomId.trim();
      }

      const res = await fetch(`${apiUrl}/rooms/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { throw new Error('Server returned an invalid response. Please try again.'); }

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create room');
      }

      // If successful, pass state to the room to skip joining step
      navigate(`/room/${data.room.roomId}`, { 
        state: { 
          username: formData.username,
          roomId: data.room.roomId,
          isCreator: true
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

      {/* Custom Room ID Input */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Custom Room ID <span className="text-slate-400 font-normal text-xs">(Optional)</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-mono text-sm">
            #
          </div>
          <input
            type="text"
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
            placeholder="Leave blank to auto-generate"
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-bg border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 font-mono"
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
            placeholder="Set a password"
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-bg border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Expiry Slider */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex justify-between">
          <span>Room Expiry</span>
          <span className="text-primary-600 dark:text-primary-400 font-bold">{formData.expiryMinutes} min</span>
        </label>
        <div className="relative flex items-center gap-3">
          <div className="flex-shrink-0 text-slate-400">
            <Clock size={18} />
          </div>
          <input
            type="range"
            name="expiryMinutes"
            min="5"
            max="1440" // 24 hours
            step="5"
            value={formData.expiryMinutes}
            onChange={handleChange}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors focus:ring-4 focus:ring-primary-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <>
            Create & Join <ArrowRight size={18} />
          </>
        )}
      </button>

    </form>
  );
};

export default CreateRoom;
