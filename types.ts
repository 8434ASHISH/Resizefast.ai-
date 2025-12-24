
export type ToolCategory = 'Image' | 'PDF' | 'Utility' | 'Batch' | 'Text';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  features: string[];
}

export interface AdProps {
  size: '728x90' | '300x250' | '320x100';
  label?: string;
}
