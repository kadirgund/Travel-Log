const API_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:1337'
    : 'https://travel-log-api.kadirgund.vercel.app';

export async function listLogEntries() {
  const response = await fetch(`${API_URL}/api/logs`);
  return response.json();
}

export async function createLogEntry(entry) {
  const apiKey = entry.apiKey;
  delete entry.apiKey;
  const response = await fetch(`${API_URL}/api/logs`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-API-KEY': apiKey,
    },
    body: JSON.stringify(entry),
  });
  const json = await response.json();
  if (response.ok) {
    return json;
  }
  const error = new Error(json.message);
  error.response = json;
  throw error;
}

export async function updateLogEntry(entry) {
  const apiKey = entry.apiKey;
  delete entry.apiKey;
  const response = await fetch(`${API_URL}/api/logs`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      'X-API-KEY': apiKey,
    },
    body: JSON.stringify(entry),
  });
  const json = await response.json();
  if (response.ok) {
    return json;
  }
  const error = new Error(json.message);
  error.response = json;
  throw error;
}

export async function deleteLogEntry(id, apiKey) {
  const response = await fetch(`${API_URL}/api/logs/${id}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      'X-API-KEY': apiKey,
    },
  });
  const json = await response.json();
  if (response.ok) {
    return json;
  }
  const error = new Error(json.message);
  error.response = json;
  throw error;
}
