'use client'
import SubsTableItem from '@/Components/AdminComponents/SubsTableItem'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const Page = () => {
  const [emails, setEmails] = useState([]);

  const fetchEmails = async () => {
    const response = await axios.get('/api/email');
    setEmails(response.data.emails)
  }

  const deleteEmail = async (mongoId) => {
    const response = await axios.delete('/api/email', { params: { id: mongoId } })
    if (response.data.success) {
      toast.success(response.data.msg);
      fetchEmails();
    } else {
      toast.error("Error");
    }
  }

  useEffect(() => {
    const loadEmails = async () => {
      const response = await axios.get('/api/email');
      setEmails(response.data.emails)
    }

    loadEmails();
  }, [])

  return (
    <div className="flex-1 px-8 md:px-12 pt-10 pb-16">

      {/* Page heading */}
      <div className="flex items-center gap-4 mb-2">
        <span className="block h-px w-6 bg-[#D4AF37]" aria-hidden="true" />
        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-[#6C6863]">Readers</p>
      </div>
      <h1 className="font-heading text-[#1A1A1A] text-3xl md:text-4xl tracking-tight mb-10">
        Subscriptions
      </h1>

      {/* Table */}
      <div className="border border-[#1A1A1A]/10 overflow-x-auto scrollbar-hide">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr className="border-b border-[#1A1A1A]/10 bg-[#EBE5DE]/30">
              <th scope="col" className="px-6 py-4 text-left font-body text-[9px] uppercase tracking-[0.25em] text-[#6C6863]">
                Email Address
              </th>
              <th scope="col" className="hidden sm:table-cell px-6 py-4 text-left font-body text-[9px] uppercase tracking-[0.25em] text-[#6C6863]">
                Subscribed On
              </th>
              <th scope="col" className="px-6 py-4 text-left font-body text-[9px] uppercase tracking-[0.25em] text-[#6C6863]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {emails.map((item, index) => (
              <SubsTableItem
                key={index}
                mongoId={item._id}
                deleteEmail={deleteEmail}
                email={item.email}
                date={item.date}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Page

