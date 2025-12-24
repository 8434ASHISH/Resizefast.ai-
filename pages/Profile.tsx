
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface ProfileProps {
  userName: string;
  updateName: (name: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ userName, updateName }) => {
  const [newName, setNewName] = useState(userName);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      updateName(newName.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-xs uppercase tracking-widest mb-10 transition-colors">
        <span className="text-lg">←</span> Back to Dashboard
      </Link>
      
      <div className="bg-white dark:bg-slate-800 p-12 rounded-[3rem] border-2 border-slate-50 dark:border-slate-700 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-bl-full -z-0"></div>
        <div className="relative z-10">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black mb-8 shadow-xl shadow-blue-500/30">
            {userName.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">Your Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold mb-10">Personalize how you appear in ResizeFast.AI</p>
          
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Display Name</label>
              <input 
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-2 dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white font-black outline-none focus:border-blue-500 transition-all"
                required
              />
            </div>
            <button 
              type="submit"
              className={`w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 ${saved ? 'bg-green-600 shadow-green-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'}`}
            >
              {saved ? 'Changes Saved! ✅' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
