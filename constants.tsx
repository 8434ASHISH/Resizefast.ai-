
import { Tool } from './types';

export const TOOLS: Tool[] = [
  {
    id: 'image-resizer-px',
    name: 'Resolution Scaler',
    description: 'Adjust image dimensions while maintaining crisp details and perfect aspect ratios.',
    category: 'Image',
    icon: '📏',
    features: ['Pixel-perfect scaling', 'Bicubic interpolation', 'High-res output']
  },
  {
    id: 'image-compressor',
    name: 'Precision KB Compressor',
    description: 'Hit exact file size targets (e.g. 10KB) with our smart sharpness-retaining engine.',
    category: 'Image',
    icon: '📉',
    features: ['Exact KB Targeting', 'Anti-Blur scaling', 'Binary Search optimization']
  },
  {
    id: 'image-converter',
    name: 'Format Converter',
    description: 'Convert between PNG, JPG, WebP, and BMP formats with aspect-ratio cropping.',
    category: 'Image',
    icon: '🔄',
    features: ['WebP support', 'Aspect ratio presets', 'KB targeting']
  },
  {
    id: 'pdf-merger',
    name: 'Professional PDF Merger',
    description: 'Combine multiple PDF files with optional post-merge compression and reordering.',
    category: 'PDF',
    icon: '📄',
    features: ['Reorder documents', 'Metadata optimization', '100% Client-side']
  },
  {
    id: 'pdf-remover',
    name: 'PDF Page Remover',
    description: 'Delete specific pages from your PDF documents instantly and securely.',
    category: 'PDF',
    icon: '✂️',
    features: ['Page selection', 'Batch removal', 'Instant download']
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to Image',
    description: 'Extract every page from a PDF as a high-quality JPG or PNG image.',
    category: 'PDF',
    icon: '🖼️',
    features: ['Page extraction', 'ZIP bundling', 'High DPI support']
  },
  {
    id: 'qr-generator',
    name: 'Vector QR Creator',
    description: 'Generate customizable QR codes for links, text, or business cards.',
    category: 'Utility',
    icon: '🔲',
    features: ['SVG support', 'Error correction', 'Branded colors']
  },
  {
    id: 'json-formatter',
    name: 'Developer JSON Suite',
    description: 'Beautify, validate, or minify raw JSON data for cleaner code.',
    category: 'Utility',
    icon: '{}',
    features: ['Linting', 'Auto-fix', 'High-speed parsing']
  },
  {
    id: 'text-converter',
    name: 'Text Architect',
    description: 'Manipulate string casing, spacing, and formatting with one-click presets.',
    category: 'Text',
    icon: 'Aa',
    features: ['Title Case', 'Regex replace', 'Word counting']
  },
  {
    id: 'base64-tool',
    name: 'Base64 Processor',
    description: 'Securely encode or decode files and text strings for data transmission.',
    category: 'Utility',
    icon: '🔗',
    features: ['Data URI generation', 'Binary safe', 'Local processing']
  }
];
