export async function apiJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const body = await response.text();
  let data: unknown;

  try {
    data = JSON.parse(body);
  } catch {
    throw new Error(
      `The AI service returned a non-JSON response (HTTP ${response.status}). Check the Vercel API deployment and try again.`
    );
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'error' in data &&
      typeof data.error === 'string'
        ? data.error
        : `AI request failed (HTTP ${response.status}).`;
    throw new Error(message);
  }

  return data as T;
}
