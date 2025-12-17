"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NewPost() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const { data: session } = useSession();

  const onSubmit = async (data: any) => {
    // 1. Upload Image (Optional)
    let imageUrl = null;
    if (data.image[0]) {
      const formData = new FormData();
      formData.append("file", data.image[0]);
      
      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${(session as any)?.accessToken}` },
        body: formData,
      });
      const uploadData = await uploadRes.json();
      imageUrl = uploadData.url;
    }

    // 2. Create Post
    const postPayload = {
      title: data.title,
      slug: data.slug,
      content: data.content,
      published: data.published,
      featured_image: imageUrl
    };

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${(session as any)?.accessToken}`
      },
      body: JSON.stringify(postPayload),
    });

    router.push("/admin/posts");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input {...register("title")} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Slug</label>
          <input {...register("slug")} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Image</label>
          <input type="file" {...register("image")} className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Content</label>
          <textarea {...register("content")} className="w-full border p-2 rounded h-32" required />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" {...register("published")} id="pub" />
          <label htmlFor="pub">Publish Immediately</label>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Save Post</button>
      </form>
    </div>
  );
}