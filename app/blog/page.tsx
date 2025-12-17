import Link from "next/link";
import { ArrowLeft, Calendar, Clock, ArrowUpRight } from "lucide-react";

// Define the shape of data coming from Python
interface Post {
  id: number;
  title: string;
  excerpt?: string;
  slug: string;
  content: string;
  published: boolean;
  featured_image?: string;
  created_at: string;
  author_id: number;
}

// Fetch data on the server
async function getPosts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
      cache: "no-store", // Ensure fresh data on every visit
    });
    if (!res.ok) return [];
    
    const posts: Post[] = await res.json();
    // Only show published posts to the public
    return posts.filter((post) => post.published);
  } catch (error) {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="font-bold text-xl tracking-tight">Synapse<span className="text-emerald-600">Blog.</span></div>
          <Link href="/login" className="text-sm font-medium px-4 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition">
            Admin Login
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="py-24 px-6 text-center bg-slate-50 border-b border-slate-100">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6">
          Writings & <span className="text-emerald-600 font-serif italic">Thoughts</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Read the latest stories, guides, and news from our blog.
        </p>
      </header>

      {/* Blog Grid */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post) => (
              <article key={post.id} className="group flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 hover:-translate-y-1">
                
                {/* Image */}
                <Link href={`/blog/${post.id}`} className="block overflow-hidden h-56 bg-slate-100 relative">
                  {post.featured_image ? (
                    <img 
                      src={post.featured_image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 font-serif text-4xl italic bg-slate-50">
                      {post.title.charAt(0)}
                    </div>
                  )}
                  {/* Category Badge (Static for now) */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Article
                  </div>
                </Link>

                {/* Content */}
                <div className="flex flex-col flex-1 p-8">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 font-medium uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                        <Calendar size={12} /> {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={12} /> 5 min read
                    </span>
                  </div>

                  <Link href={`/blog/${post.id}`} className="block">
                    <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors leading-tight">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-slate-500 leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt || post.content.substring(0, 120) + "..."}
                  </p>

                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                            A
                        </div>
                        <span className="text-sm font-semibold text-slate-900">Author</span>
                    </div>
                    <Link href={`/blog/${post.id}`} className="text-emerald-600 p-2 rounded-full hover:bg-emerald-50 transition-colors">
                        <ArrowUpRight size={20} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-slate-300 mb-2">No posts found</h3>
            <p className="text-slate-500">Check back later or log in to create content.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 py-12 text-center border-t border-slate-200">
        <p className="text-slate-500 text-sm">© 2025 Synapse Blog.</p>
      </footer>
    </div>
  );
}