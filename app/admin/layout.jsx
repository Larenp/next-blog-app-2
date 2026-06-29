import Sidebar from "@/Components/AdminComponents/Sidebar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout({ children }) {
    return (
        <>
            <div className="flex min-h-screen bg-[#F9F8F6]">
                <ToastContainer theme="dark" />
                <Sidebar />
                <div className="flex flex-col w-full overflow-hidden">
                    {/* Top bar */}
                    <div className="flex items-center justify-between w-full py-4 px-8 md:px-12 border-b border-[#1A1A1A]/15 bg-[#F9F8F6] shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="block h-4 w-px bg-[#D4AF37]" aria-hidden="true" />
                            <p className="font-body text-[10px] uppercase tracking-[0.25em] text-[#6C6863]">
                                Admin Panel
                            </p>
                        </div>
                        <div className="w-8 h-8 bg-[#1A1A1A] flex items-center justify-center">
                            <span className="font-heading text-[#F9F8F6] text-xs">A</span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}