const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function queryLayer1(prompt, models) {
  const response = await fetch(`${API_BASE_URL}/ask/layer1`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, models }),
  });
  if (!response.ok) throw new Error('Layer 1 query failed');
  return response.json();
}

export async function queryLayer2(prompt, l1_responses, model) {
  const response = await fetch(`${API_BASE_URL}/ask/layer2`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, l1_responses, model }),
  });
  if (!response.ok) throw new Error('Layer 2 query failed');
  return response.json();
}

export async function queryLayer3(prompt, l2_response, model) {
  const response = await fetch(`${API_BASE_URL}/ask/layer3`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, l2_response, model }),
  });
  if (!response.ok) throw new Error('Layer 3 query failed');
  return response.json();
}

export async function queryLayer4(prompt, l3_response, model) {
  const response = await fetch(`${API_BASE_URL}/ask/layer4`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, l3_response, model }),
  });
  if (!response.ok) throw new Error('Layer 4 query failed');
  return response.json();
}

export const queryStreamGraph = async (uid, prompt, history, modelsL1, modelL2, modelL3, modelL4, onEvent, signal) => {
  const response = await fetch(`${API_BASE_URL}/ask/stream_graph`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
    body: JSON.stringify({
      uid: uid,
      prompt: prompt,
      history: history,
      modelsL1: modelsL1,
      modelL2: modelL2,
      modelL3: modelL3,
      modelL4: modelL4
    })
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.detail || 'Failed to start stream');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    
    const lines = buffer.split('\n\n');
    buffer = lines.pop(); // Keep the last incomplete chunk in the buffer
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.error) throw new Error(data.error);
          onEvent(data);
        } catch (e) {
          console.error('Error parsing SSE:', e);
        }
      }
    }
  }
};

export async function authProfile(uid, email, displayName) {
  const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, email, display_name: displayName })
  });
  return response.json();
}

export async function getChats(uid) {
  const response = await fetch(`${API_BASE_URL}/api/chats/${uid}`);
  return response.json();
}

export async function saveChat(uid, sessionId, title, messages) {
  const response = await fetch(`${API_BASE_URL}/api/chats/${uid}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, title, messages })
  });
  return response.json();
}

export async function getSharedChat(sessionId) {
  const response = await fetch(`${API_BASE_URL}/api/chats/shared/${sessionId}`);
  if (!response.ok) throw new Error('Shared chat not found');
  return response.json();
}

export async function saveFeedback(uid, sessionId, messageIdx, feedback) {
  const response = await fetch(`${API_BASE_URL}/api/chats/${uid}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, message_idx: messageIdx, feedback })
  });
  return response.json();
}

export async function deleteChat(uid, sessionId) {
  const response = await fetch(`${API_BASE_URL}/api/chats/${uid}/${sessionId}`, {
    method: 'DELETE'
  });
  return response.json();
}

export async function generateChatTitle(prompt, modelId) {
  const response = await fetch(`${API_BASE_URL}/api/chats/generate_title`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model: modelId })
  });
  return response.json();
}
