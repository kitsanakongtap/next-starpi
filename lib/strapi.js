// src/lib/strapi.js
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://127.0.0.1:1337';

export async function fetchStrapi(endpoint) {
  const res = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
    next: { revalidate: 10 } 
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch Strapi data from ${endpoint}`);
  }
  
  return res.json();
}