'use client'
import React, { useState, Suspense } from 'react'
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import Link from 'next/link'

const inputClass = `w-full h-12 bg-transparent border-0 border-b border-[#1A1A1A]/40
  text-sm text-[#1A1A1A] font-body
  placeholder:font-heading placeholder:italic placeholder:text-[#6C6863]
  outline-none focus:border-[#D4AF37] transition-colors duration-300 pb-2`

const labelClass = `block font-body text-[10px] uppercase tracking-[0.25em] text-[#6C6863] mb-3 mt-8`

function LoginForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/dashboard/addBlog';

    const onChangeHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const payload = isLogin 
                ? { email: formData.email, password: formData.password }
                : formData;

            const response = await axios.post(endpoint, payload);

            if (response.data.success) {
                toast.success(response.data.msg);
                router.push(redirectUrl);
                router.refresh();
            } else {
                toast.error(response.data.msg || "Something went wrong");
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || "Authentication failed");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-[420px] z-10 bg-[#F9F8F6] border border-[#1A1A1A]/10 p-8 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
            
            {/* Heading */}
            <div className="flex items-center gap-4 mb-2">
                <span className="block h-px w-6 bg-[#D4AF37]" aria-hidden="true" />
                <p className="font-body text-[10px] uppercase tracking-[0.3em] text-[#6C6863]">
                    {isLogin ? "Welcome Back" : "Join the Community"}
                </p>
            </div>
            <h1 className="font-heading text-[#1A1A1A] text-3xl tracking-tight mb-8">
                {isLogin ? "Sign In" : "Register"}
            </h1>

            <form onSubmit={onSubmitHandler}>
                {!isLogin && (
                    <div>
                        <label className={labelClass}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={onChangeHandler}
                            placeholder="Write your full name"
                            className={inputClass}
                            required
                        />
                    </div>
                )}

                <div>
                    <label className={labelClass}>Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={onChangeHandler}
                        placeholder="Write your email address"
                        className={inputClass}
                        required
                    />
                </div>

                <div>
                    <label className={labelClass}>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={onChangeHandler}
                        placeholder="••••••••"
                        className={inputClass}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full h-12 mt-10 overflow-hidden group shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-shadow duration-500"
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
                        {isLoading ? "Authenticating..." : (isLogin ? "Sign In" : "Register")}
                    </span>
                </button>
            </form>

            {/* Toggle Link */}
            <div className="mt-8 text-center">
                <button
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setFormData({ name: "", email: "", password: "" });
                    }}
                    className="font-body text-[10px] uppercase tracking-[0.15em] text-[#6C6863] hover:text-[#D4AF37] transition-colors duration-300"
                >
                    {isLogin ? "Create an account instead" : "Have an account? Log In"}
                </button>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <div className="relative min-h-screen bg-[#F9F8F6] flex flex-col justify-center items-center px-6 py-12">
            
            {/* Paper grain noise texture */}
            <div className="noise-overlay" aria-hidden="true" />

            {/* Brand Logo Header */}
            <div className="absolute top-10 left-8 md:left-16">
                <Link href="/" className="font-heading text-[#1A1A1A] text-xl tracking-tight font-normal select-none">
                    The Editorial
                </Link>
            </div>

            <Suspense fallback={
                <div className="text-center font-heading text-xl text-[#6C6863] italic">
                    Loading login interface...
                </div>
            }>
                <LoginForm />
            </Suspense>
        </div>
    );
}
