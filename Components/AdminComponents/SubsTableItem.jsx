import React from 'react'

const SubsTableItem = ({ email, date, deleteEmail, mongoId }) => {
  const emailDate = new Date(date);
  return (
    <tr className="border-b border-[#1A1A1A]/10 hover:bg-[#EBE5DE]/20 transition-colors duration-300">
      <th scope="row" className="px-6 py-5 font-heading text-[#1A1A1A] text-sm font-normal whitespace-nowrap">
        {email ? email : "No Email"}
      </th>
      <td className="hidden sm:table-cell px-6 py-5 font-body text-[10px] text-[#6C6863] uppercase tracking-[0.1em] whitespace-nowrap">
        {emailDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </td>
      <td
        onClick={() => deleteEmail(mongoId)}
        className="px-6 py-5 cursor-pointer font-body text-[10px] uppercase tracking-[0.15em] text-[#6C6863] hover:text-[#D4AF37] transition-colors duration-500"
      >
        Remove
      </td>
    </tr>
  )
}

export default SubsTableItem
