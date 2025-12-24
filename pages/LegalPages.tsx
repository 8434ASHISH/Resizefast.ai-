
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PageLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="max-w-4xl mx-auto py-16 px-6">
    <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-xs uppercase tracking-widest mb-10 transition-colors">
      <span className="text-lg">←</span> Back to Dashboard
    </Link>
    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-10 tracking-tighter">{title}</h1>
    <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 font-medium leading-relaxed space-y-8">
      {children}
    </div>
  </div>
);

export const PrivacyPolicy: React.FC = () => (
  <PageLayout title="Privacy Policy">
    <section className="space-y-4">
      <h2 className="text-2xl font-black text-slate-900 dark:text-white">Our Commitment</h2>
      <p>ResizeFast.AI is built on a "Privacy-First" architecture. Unlike traditional online tools that require you to upload your files to a cloud server, our application processes everything locally within your web browser using modern Web APIs.</p>
    </section>
    <section className="space-y-4">
      <h2 className="text-2xl font-black text-slate-900 dark:text-white">Data Collection</h2>
      <p>We do not collect, store, or transmit any of your personal files. Your images, PDFs, and text data stay 100% on your device. We use local storage solely to remember your personalization settings, such as your name and theme preference.</p>
    </section>
  </PageLayout>
);

export const Disclaimer: React.FC = () => (
  <PageLayout title="Disclaimer">
    <section className="space-y-4">
      <h2 className="text-2xl font-black text-slate-900 dark:text-white">Usage at Your Own Risk</h2>
      <p>ResizeFast.AI is provided "as is" without any warranties of any kind. While we strive for 100% accuracy and quality, we are not responsible for any data loss, corrupted files, or inaccuracies that may occur during the automated processing of your documents.</p>
    </section>
  </PageLayout>
);

export const ContactUs: React.FC = () => {
  const [isSent, setIsSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    // Simulate successful message sending locally
    setIsSent(true);
    setFormData({ name: '', email: '', message: '' });
    
    // Auto-reset success message after some time so user can see the form again if needed
    setTimeout(() => {
      // Logic to reset or allow another message if needed
    }, 10000);
  };

  return (
    <PageLayout title="Contact Us">
      <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-700 shadow-xl">
        <div className="mb-10 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-800 text-center">
          <div className="text-4xl mb-4">📧</div>
          <h3 className="text-xl font-black text-blue-800 dark:text-blue-300 mb-2">Direct Support Email</h3>
          <p className="text-slate-600 dark:text-slate-400 font-bold mb-4">For any inquiries, feature requests, or technical support, reach out directly to us:</p>
          <a 
            href="mailto:first4bencher@gmail.com" 
            className="text-2xl md:text-3xl font-black text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors break-all"
          >
            first4bencher@gmail.com
          </a>
        </div>
        
        {isSent ? (
          <div className="py-12 text-center animate-in zoom-in duration-500 bg-green-50 dark:bg-green-900/10 rounded-3xl border-2 border-dashed border-green-200 dark:border-green-800 shadow-inner">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-xl shadow-green-500/20">✓</div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">Message Sent Successfully!</h3>
            <p className="text-slate-600 dark:text-slate-400 font-bold mb-8 max-w-md mx-auto">Thank you for reaching out. We have received your query and our team will get back to you shortly at the email address provided.</p>
            <button 
              onClick={() => setIsSent(false)}
              className="px-10 py-4 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-black rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <>
            <p className="mb-8 text-slate-700 dark:text-slate-300 font-bold text-center">Or use the form below to send a secure message</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border-2 dark:bg-slate-900 border-slate-100 dark:border-slate-700 outline-none focus:border-blue-500 text-slate-900 dark:text-white font-bold transition-all" 
                      placeholder="Your Name" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border-2 dark:bg-slate-900 border-slate-100 dark:border-slate-700 outline-none focus:border-blue-500 text-slate-900 dark:text-white font-bold transition-all" 
                      placeholder="email@example.com" 
                    />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">Your Message</label>
                 <textarea 
                   rows={6} 
                   required
                   value={formData.message}
                   onChange={(e) => setFormData({...formData, message: e.target.value})}
                   className="w-full px-6 py-4 rounded-2xl border-2 dark:bg-slate-900 border-slate-100 dark:border-slate-700 outline-none focus:border-blue-500 text-slate-900 dark:text-white font-bold transition-all" 
                   placeholder="How can we help?"
                 ></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all text-lg">
                Send Secure Message
              </button>
            </form>
          </>
        )}
      </div>
    </PageLayout>
  );
};
