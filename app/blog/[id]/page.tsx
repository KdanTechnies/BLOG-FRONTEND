import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { notFound } from "next/navigation";

// Fetch single post
async function getPost(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

// UPDATE: 'params' is now a Promise in Next.js 15
export default async function SinglePostPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Await the params to get the ID
  const { id } = await params;
  
  // 2. Fetch the post
  const post = await getPost(id);

  if (!post || !post.published) {
    notFound(); 
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-100">
      
      {/* Navigation */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <Link href="/blog" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft size={18} /> Back to Articles
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Post Header */}
        <header className="mb-12 text-center">
            {/* Meta Info */}
            <div className="flex items-center justify-center gap-6 text-sm text-slate-400 mb-6 uppercase tracking-widest font-medium">
                <span className="flex items-center gap-2">
                    <Calendar size={14} /> {new Date(post.created_at).toLocaleDateString()}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="flex items-center gap-2">
                    <User size={14} /> Admin
                </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
                {post.title}
            </h1>

            {/* Featured Image */}
            {post.featured_image && (
                <div className="w-full h-64 md:h-[500px] bg-slate-100 rounded-2xl overflow-hidden shadow-2xl mb-12 border border-slate-100">
                    <img 
                        src={post.featured_image} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
        </header>

        {/* Post Content */}
        <article className="prose prose-lg prose-slate md:prose-xl mx-auto">
            <div className="whitespace-pre-wrap text-slate-600 leading-loose">
                {post.content}
            </div>
        </article>

        {/* Tags / Footer */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex items-center gap-2">
            <Tag size={18} className="text-slate-400" />
            <span className="text-slate-500 text-sm font-medium">Filed under: General</span>
        </div>
      </main>
    </div>
  );
}