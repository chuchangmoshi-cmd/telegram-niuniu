const BASE_URL = "http://localhost:3001";

export async function request(
  url: string,
  options?: RequestInit
) {
  const res = await fetch(BASE_URL + url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Request Error"
    );
  }

  return data;
}