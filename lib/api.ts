import { getServerSession } from "next-auth";

export async function fetchAPI(path: string, options: RequestInit = {}) {
  const session = await getServerSession(); // Get token from session
  const token = (session as any)?.accessToken;

  const headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`,
  };

  // Handle FormData (Image Uploads) vs JSON
  if (!(options.body instanceof FormData)) {
    (headers as any)["Content-Type"] = "application/json";
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) throw new Error("API Error");
  return res.json();
}