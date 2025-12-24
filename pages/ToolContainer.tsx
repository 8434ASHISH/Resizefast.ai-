
import React, { useEffect } from 'react';
import { useParams, Link, Navigate, useLocation } from 'react-router-dom';
import { TOOLS } from '../constants';
import ImageResizer from '../components/tools/ImageResizer';
import ImageCompressor from '../components/tools/ImageCompressor';
import QRCodeGenerator from '../components/tools/QRCodeGenerator';
import JsonFormatter from '../components/tools/JsonFormatter';
import Base64Tool from '../components/tools/Base64Tool';
import TextConverter from '../components/tools/TextConverter';
import PdfMerger from '../components/tools/PdfMerger';
import PdfToImage from '../components/tools/PdfToImage';
import FormatConverter from '../components/tools/FormatConverter';
import PdfPageRemover from '../components/tools/PdfPageRemover';

const ToolContainer: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const { pathname } = useLocation();
  const tool = TOOLS.find(t => t.id === toolId);

  // Auto scroll to top when tool changes
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.scrollTop = 0;
  }, [pathname]);

  if (!tool) {
    return <Navigate to="/" replace />;
  }

  const renderTool = () => {
    switch (tool.id) {
      case 'image-resizer-px':
        return <ImageResizer />;
      case 'image-compressor':
        return <ImageCompressor />;
      case 'qr-generator':
        return <QRCodeGenerator />;
      case 'json-formatter':
        return <JsonFormatter />;
      case 'base64-tool':
        return <Base64Tool />;
      case 'text-converter':
        return <TextConverter />;
      case 'pdf-merger':
        return <PdfMerger />;
      case 'pdf-remover':
        return <PdfPageRemover />;
      case 'pdf-to-jpg':
        return <PdfToImage />;
      case 'image-converter':
        return <FormatConverter />;
      default:
        return (
          <div className="p-20 text-center bg-white dark:bg-slate-800 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-slate-700">
            <h3 className="text-3xl font-black mb-4">Module Initializing...</h3>
            <p className="text-slate-500 dark:text-slate-400 font-bold">
              The {tool.name} is currently being optimized for your device. 
              Check our <Link to="/" className="text-blue-600 underline">other tools</Link> in the meantime.
            </p>
          </div>
        );
    }
  };

  const faqs = [
    { q: `Is ${tool.name} safe to use?`, a: `Absolutely. Unlike most online tools, ResizeFast.AI processes all your files locally in your browser. No data is ever uploaded to a server.` },
    { q: "Do I need an internet connection?", a: "Once the app is loaded, you can perform most operations offline. Our tools use your local system's CPU and GPU resources." },
    { q: "What's the maximum file size?", a: "The limit is based on your computer's RAM. Generally, files up to 100MB process instantly, while larger files might take a few extra seconds." }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-32">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-xs uppercase tracking-widest mb-6 transition-colors">
            <span className="text-lg">←</span> Back to Dashboard
          </Link>
          <div className="flex items-center gap-6">
            <div className="text-6xl p-5 bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-100 dark:shadow-none border border-slate-50 dark:border-slate-700">{tool.icon}</div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">{tool.name}</h1>
              <p className="text-slate-500 dark:text-slate-400 font-semibold text-lg">{tool.description}</p>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex gap-3">
          {TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 2).map(related => (
            <Link key={related.id} to={`/tool/${related.id}`} title={related.name} className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-500 transition-all shadow-sm">
              <span className="text-2xl">{related.icon}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-20">
        {renderTool()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Short Article */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">About {tool.name}</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 font-medium leading-relaxed space-y-4">
            <p>The {tool.name} is a high-performance utility designed for professionals who prioritize both quality and privacy. By leveraging standard Web APIs like Canvas and the PDF.js engine, we ensure that every pixel and document is handled with extreme care.</p>
            <p>Whether you're preparing assets for a high-traffic website or merging sensitive internal documents, this tool provides the balance of speed and control you need. Our {tool.id.includes('image') ? 'image engine' : 'document processor'} uses advanced algorithms to maintain structural integrity while minimizing file footprint.</p>
          </div>
          <div className="flex flex-wrap gap-3 pt-4">
            {tool.features.map((f, i) => (
              <span key={i} className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-xl">
                ✓ {f}
              </span>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-50 dark:border-slate-700 shadow-sm">
                <h4 className="font-black text-slate-900 dark:text-white mb-2">{faq.q}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-800">
            <h4 className="font-black text-indigo-700 dark:text-indigo-300 mb-2">Need a different tool?</h4>
            <div className="flex flex-wrap gap-4 pt-2">
              {TOOLS.filter(t => t.id !== tool.id).slice(0, 4).map(other => (
                <Link key={other.id} to={`/tool/${other.id}`} className="text-xs font-black text-indigo-500 hover:text-indigo-700 underline uppercase tracking-widest">
                  {other.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ToolContainer;
