// src/lib/strapi.ts

// 1. ดึง URL จาก Environment Variable
const STRAPI_URL: string = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://127.0.0.1:1337';

/**
 * ฟังก์ชันสากลสำหรับดึงข้อมูลจาก Strapi API
 * @param endpoint - พาธของ API เช่น 'blogs?populate=*'
 * @returns คืนค่าเป็น Promise ของข้อมูลประเภท T (Generic) ตามที่เราส่งเข้าไปกำหนด
 */
export async function fetchStrapi<T = any>(endpoint: string): Promise<T> {
  const res = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
    next: { revalidate: 10 } // ทำ ISR อัปเดตข้อมูลทุกๆ 10 วินาที
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch Strapi data from ${endpoint} (Status: ${res.status})`);
  }
  
  return res.json() as Promise<T>;
}