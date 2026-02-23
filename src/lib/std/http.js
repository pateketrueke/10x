export async function get(url, options) {
  const res = await fetch(url, {
    method: 'GET',
    headers: options?.headers,
  });
  
  return {
    ok: res.ok,
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
    text: () => res.text(),
    json: () => res.json(),
    blob: () => res.blob(),
  };
}

export async function post(url, body, options) {
  const headers = { 'Content-Type': 'application/json', ...options?.headers };
  
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
  
  return {
    ok: res.ok,
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
    text: () => res.text(),
    json: () => res.json(),
    blob: () => res.blob(),
  };
}

export async function put(url, body, options) {
  const headers = { 'Content-Type': 'application/json', ...options?.headers };
  
  const res = await fetch(url, {
    method: 'PUT',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
  
  return {
    ok: res.ok,
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
    text: () => res.text(),
    json: () => res.json(),
  };
}

export async function del(url, options) {
  const res = await fetch(url, {
    method: 'DELETE',
    headers: options?.headers,
  });
  
  return {
    ok: res.ok,
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
    text: () => res.text(),
    json: () => res.json(),
  };
}

export default {
  get,
  post,
  put,
  del,
};
