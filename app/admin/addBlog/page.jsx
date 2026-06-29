'use client'
import axios from 'axios'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const inputClass = `w-full sm:w-[520px] h-12 bg-transparent border-0 border-b border-[#1A1A1A]/40
  text-sm text-[#1A1A1A] font-body
  placeholder:font-heading placeholder:italic placeholder:text-[#6C6863]
  outline-none focus:border-[#D4AF37] transition-colors duration-300 pb-2`

const labelClass = `block font-body text-[10px] uppercase tracking-[0.25em] text-[#6C6863] mb-3 mt-8`

const page = () => {
    const [image, setImage] = useState(false);
    const [user, setUser] = useState(null);
    const [data, setData] = useState({
        title: "",
        description: "",
        category: "Startup"
    })

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/api/auth/me');
                if (response.data.success) {
                    setUser(response.data.user);
                }
            } catch (err) {
                console.error("Failed to load user session", err);
            }
        };
        fetchUser();
    }, []);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('image', image);
        const response = await axios.post('/api/blog', formData);
        if (response.data.success) {
            toast.success(response.data.msg);
            setImage(false);
            setData({
                title: "",
                description: "",
                category: "Startup"
            });
        } else {
            toast.error("Error");
        }
    }

    return (
        <div className="flex-1 px-8 md:px-12 pt-10 pb-16">

            {/* Page heading */}
            <div className="flex items-center gap-4 mb-2">
                <span className="block h-px w-6 bg-[#D4AF37]" aria-hidden="true" />
                <p className="font-body text-[10px] uppercase tracking-[0.3em] text-[#6C6863]">Content</p>
            </div>
            <h1 className="font-heading text-[#1A1A1A] text-3xl md:text-4xl tracking-tight mb-10">
                Add New Article
            </h1>

            <form onSubmit={onSubmitHandler} className="max-w-[580px]">

                {/* Image upload */}
                <p className={labelClass}>Thumbnail Image</p>
                <label
                    htmlFor="image"
                    className="flex items-center justify-center w-full sm:w-[240px] h-36 border border-dashed border-[#1A1A1A]/30 cursor-pointer hover:border-[#D4AF37] transition-colors duration-500 bg-[#EBE5DE]/20 overflow-hidden"
                >
                    {image ? (
                        <Image
                            src={URL.createObjectURL(image)}
                            width={240}
                            height={144}
                            alt="Preview"
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="text-center">
                            <span className="block font-body text-[10px] uppercase tracking-[0.2em] text-[#6C6863]">Click to upload</span>
                            <span className="block font-body text-[10px] text-[#6C6863]/60 mt-1">JPG, PNG, WEBP</span>
                        </div>
                    )}
                </label>
                <input
                    onChange={(e) => setImage(e.target.files[0])}
                    type="file"
                    id="image"
                    accept="image/*"
                    hidden
                    required
                />

                {/* Author Info */}
                <p className={labelClass}>Publishing As</p>
                <div className="font-body text-xs text-[#1A1A1A] border-b border-[#1A1A1A]/10 pb-3">
                    {user ? `${user.name} (${user.email})` : "Loading session..."}
                </div>

                {/* Title */}
                <p className={labelClass}>Blog Title</p>
                <input
                    name="title"
                    onChange={onChangeHandler}
                    value={data.title}
                    className={inputClass}
                    type="text"
                    placeholder="Type your title here"
                    required
                />

                {/* Description */}
                <p className={labelClass}>Content</p>
                <textarea
                    name="description"
                    onChange={onChangeHandler}
                    value={data.description}
                    className={`${inputClass} h-auto resize-none py-2`}
                    placeholder="Write your article here..."
                    rows={6}
                    required
                />

                {/* Category */}
                <p className={labelClass}>Category</p>
                <select
                    name="category"
                    onChange={onChangeHandler}
                    value={data.category}
                    className={`${inputClass} cursor-pointer`}
                    style={{ borderRadius: 0 }}
                >
                    <option value="Startup">Startup</option>
                    <option value="Technology">Technology</option>
                    <option value="Lifestyle">Lifestyle</option>
                </select>

                {/* Submit */}
                <div className="mt-12">
                    <button
                        type="submit"
                        id="submit-blog"
                        className="relative inline-flex items-center justify-center overflow-hidden h-12 px-10 group shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow duration-500"
                        style={{ backgroundColor: '#1A1A1A', borderRadius: 0 }}
                    >
                        <span
                            className="absolute inset-0 -translate-x-full group-hover:translate-x-0"
                            style={{
                                backgroundColor: '#D4AF37',
                                transition: 'transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                            }}
                            aria-hidden="true"
                        />
                        <span className="relative z-10 text-white text-[10px] uppercase tracking-[0.2em] font-medium font-body">
                            Publish Article
                        </span>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default page

