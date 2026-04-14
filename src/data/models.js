export const AVAILABLE_MODELS = [
  { id: 'gpt', name: 'GPT-4o', provider: 'OpenAI', color: '#10b981', icon: '/chatgpt-icon.webp', category: 'General', bg: 'bg-white' },
  { id: 'grok', name: 'Grok', provider: 'xAI', color: '#f43f5e', icon: '/grok-icon.webp', category: 'General', bg: 'bg-black' },
  { id: 'deepseek', name: 'DeepSeek', provider: 'DeepSeek AI', color: '#0ea5e9', icon: '/deepseek-logo-icon.webp', category: 'Reasoning', bg: 'bg-[#001428]' },
  { id: 'phi', name: 'Phi-4', provider: 'Microsoft', color: '#8b5cf6', icon: '/chatgpt-icon.webp', category: 'Reasoning', bg: 'bg-white' },
  { id: 'ministral', name: 'Ministral', provider: 'Mistral', color: '#f59e0b', icon: '/grok-icon.webp', category: 'General', bg: 'bg-black' }
];

export const getModelById = (id) => AVAILABLE_MODELS.find(m => m.id === id);
