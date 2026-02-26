const statusStyles = {
  Present:    'bg-green-50  text-green-700  border-green-200',
  Absent:     'bg-red-50    text-red-700    border-red-200',
  'Half Day': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Late:       'bg-orange-50 text-orange-700 border-orange-200',
}

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || 'bg-gray-50 text-gray-700 border-gray-200'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      {status}
    </span>
  )
}