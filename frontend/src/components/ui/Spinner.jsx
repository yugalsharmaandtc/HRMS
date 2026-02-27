export default function Spinner({ size = 'md' }) {
  const s = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6'
  return (
    <div className={`${s} border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin`} />
  )
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-10 h-10 border-t-blue-600 border-blue-200 rounded-full animate-spin"
          style={{ borderWidth: '3px', borderStyle: 'solid' }}
        />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  )
}