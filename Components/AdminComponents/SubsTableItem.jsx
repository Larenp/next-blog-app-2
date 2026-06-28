import React from 'react'

const SubsTableItem = ({ email, date, deleteEmail, mongoId }) => {
  const emailDate = new Date(date);
  return (
    <tr className="bg-white border-b border-gray-400 text-left">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
        {email ? email : "No Email"}
      </th>
      <td className="hidden sm:table-cell px-6 py-4">
        {emailDate.toDateString()}
      </td>
      <td onClick={() => deleteEmail(mongoId)} className="px-6 py-4 cursor-pointer text-red-500 hover:text-red-700 font-bold">
        x
      </td>
    </tr>
  )
}

export default SubsTableItem
