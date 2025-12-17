"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Save, ImageIcon } from "lucide-react";
import Link from "next/link";

export default function EditPost({ params }: { params: { id: string } }) {
  const { register, handleSubmit, setValue, watch } = useForm();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);

  // 1. Fetch Post Data
  useEffect(() => {
    if (!session) return;
    const fetchPost = async () => {
      const token = (session as any)?.accessToken;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const post = await res.json();
        // Fill form
        setValue("title", post.title);
        setValue("slug", post.slug);
        setValue("content", post.content);
        setValue("published", post.published);
        if (post.featured_image) {
            setPreview(post.featured_image);
        }
        setLoading(false);
      }
    };
    fetchPost();
  }, [session, params.id, setValue]);

  // 2. Handle Image Preview locally
  const imageFile = watch("image");
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
        setPreview(URL.createObjectURL(imageFile[0]));
    }
  }, [imageFile]);

  // 3. Submit Update
  const onSubmit = async (data: any) => {
    const token = (session as any)?.accessToken;
    let imageUrl = preview; // Keep existing URL if no new file

    // If new file uploaded
    if (data.image && data.image[0]) {
      const formData = new FormData();
      formData.append("file", data.image[0]);
      
      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const uploadData = await uploadRes.json();
      imageUrl = uploadData.url;
    }

    const postPayload = {
      title: data.title,
      slug: data.slug,
      content: data.content,
      published: data.published,
      featured_image: imageUrl,
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(postPayload),
    });

    if (res.ok) router.push("/admin/posts");
  };

  if (loading) return <div className="p-8">Loading editor...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/posts" className="p-2 bg-white rounded-full text-slate-500 hover:text-blue-600 transition">
            <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Edit Post</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 grid gap-6">
            
            {/* Title & Slug */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                    <input {...register("title")} className="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Slug</label>
                    <input {...register("slug")} className="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" />
                </div>
            </div>

            {/* Content */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Content</label>
                <textarea {...register("content")} className="w-full border border-slate-200 p-4 rounded-lg h-64 font-mono text-sm focus:ring-2 focus:ring-blue-100 outline-none" />
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Featured Image</label>
                <div className="flex items-start gap-6">
                    <div className="flex-1">
                        <input type="file" {...register("image")} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"/>
                        <p className="text-xs text-slate-400 mt-2">Leave empty to keep existing image.</p>
                    </div>
                    {preview && (
                        <div className="w-32 h-20 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative group">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Sidebar / Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <input type="checkbox" {...register("published")} id="pub" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                <label htmlFor="pub" className="text-sm font-medium text-slate-700">Publish Immediately</label>
            </div>
            
            <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-all">
                <Save size={18} /> Update Post
            </button>
        </div>
      </form>
    </div>
  );
}