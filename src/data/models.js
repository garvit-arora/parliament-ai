export const AVAILABLE_MODELS = [
  { id: 'gpt', name: 'GPT-4o', provider: 'OpenAI', color: '#10b981', icon: '🧠', category: 'General' },
  { id: 'grok', name: 'Grok', provider: 'xAI', color: '#f43f5e', icon: '🚀', category: 'General' },
  { id: 'deepseek', name: 'DeepSeek', provider: 'DeepSeek AI', color: '#0ea5e9', icon: '🐋', category: 'Reasoning' }
];

export const getModelById = (id) => AVAILABLE_MODELS.find(m => m.id === id);
