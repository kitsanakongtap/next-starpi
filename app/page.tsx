// src/app/page.tsx
import { fetchStrapi } from '@/lib/strapi';
import Image from 'next/image';

interface StrapiImage {
  url: string;
  alternativeText?: string;
}

interface Blog {
  id: number;
  documentId: string; 
  title: string;
  description: string;
  createdAt: string;
  coverImage?: StrapiImage; 
}

interface StrapiResponse {
  data: Blog[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export default async function HomePage() {
  let articles: Blog[] = [];
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://127.0.0.1:1337';

  try {
    // ดึงข้อมูลผ่าน endpoint 'blogs' ตามชื่อคอลเลกชันใน Strapi
    const response = (await fetchStrapi('blogs?populate=*')) as StrapiResponse;
    articles = response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
  }

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        บล็อกดึงค่าจาก Strapi + TypeScript
      </h1>
      <hr style={{ marginBottom: '2rem' }} />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {articles.length === 0 ? (
          <p>ไม่มีข้อมูลบทความในขณะนี้</p>
        ) : (
          articles.map((article) => {
            return (
              <article 
                key={article.documentId || article.id} 
                style={{ border: '1px solid #eaeaea', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              >
                {article.coverImage && (
                  <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                    <Image
                      src={`${strapiUrl}${article.coverImage.url}`}
                      alt={article.coverImage.alternativeText || article.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized 
                    />
                  </div>
                )}

                <div style={{ padding: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 'semibold', marginBottom: '0.5rem' }}>
                    {article.title}
                  </h2>
                  <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    {article.description}
                  </p>
                  <small style={{ color: '#aaa', marginTop: '1rem', display: 'block' }}>
                    เขียนเมื่อ: {new Date(article.createdAt).toLocaleDateString('th-TH')}
                  </small>
                </div>
              </article>
            );
          })
        )}
      </div>
    </main>
  );
}