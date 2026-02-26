import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, CheckCircle, XCircle, TrendingUp, ArrowRight, RefreshCw } from 'lucide-react'
import { employeeAPI, attendanceAPI } from '../services/api'
import { useGreeting } from '../hooks/useGreeting'
import { PageLoader } from '../components/ui/Spinner'
import { format } from 'date-fns'

export default function Dashboard() {
  const navigate = useNavigate()
  const { greeting, dateTime } = useGreeting()
  const [stats,           setStats]           = useState(null)
  const [recentEmployees, setRecentEmployees] = useState([])
  const [loading,         setLoading]         = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, empRes] = await Promise.all([
        employeeAPI.getStats(),
        employeeAPI.getAll(),
      ])
      setStats(statsRes.data)
      setRecentEmployees(empRes.data.slice(0, 5))
    } catch {
      // API might be sleeping on free Render tier - show zero state
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const attendanceRate = stats && stats.total_employees > 0
    ? Math.round((stats.today_present / stats.total_employees) * 100)
    : 0

  if (loading) return <PageLoader />

  return (
    <div className="p-6 space-y-6">

      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Overview of your HR operations</p>
        </div>
        <button onClick={fetchData} className="btn-secondary text-sm">
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white relative overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute right-20 bottom-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />

        <div className="relative flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">{greeting}, Welcome Back! 👋</h2>
            <p className="text-blue-200 text-sm font-medium">{dateTime}</p>

            {/* Attendance progress bar */}
            <div className="mt-5">
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2">
                Today's Attendance
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white/20 rounded-full h-2 max-w-xs">
                  <div
                    className="h-2 bg-white rounded-full transition-all duration-700"
                    style={{ width: `${attendanceRate}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">
                  {stats?.today_present ?? 0} / {stats?.total_employees ?? 0}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-4xl font-bold">{attendanceRate}%</p>
            <p className="text-blue-200 text-sm mt-1">Attendance Rate Today</p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users size={22} className="text-blue-600" />}
          bg="bg-blue-50"
          label="Total Employees"
          value={stats?.total_employees ?? 0}
          sub={`${stats?.departments?.length ?? 0} departments`}
        />
        <StatCard
          icon={<CheckCircle size={22} className="text-green-600" />}
          bg="bg-green-50"
          label="Present Today"
          value={stats?.today_present ?? 0}
          sub="Marked present"
        />
        <StatCard
          icon={<XCircle size={22} className="text-red-500" />}
          bg="bg-red-50"
          label="Absent Today"
          value={stats?.today_absent ?? 0}
          sub="Marked absent"
        />
        <StatCard
          icon={<TrendingUp size={22} className="text-orange-500" />}
          bg="bg-orange-50"
          label="Attendance Rate"
          value={`${attendanceRate}%`}
          sub="Today"
        />
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent employees list */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Employees</h3>
            <button
              onClick={() => navigate('/employees')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </button>
          </div>
          {recentEmployees.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No employees yet</p>
          ) : (
            <ul className="space-y-3">
              {recentEmployees.map(emp => (
                <li key={emp.id} className="flex items-center gap-3 py-2">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm flex-shrink-0">
                    {emp.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{emp.full_name}</p>
                    <p className="text-xs text-gray-400">{emp.department} · {emp.employee_id}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick actions + department breakdown */}
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <QuickAction
              onClick={() => navigate('/employees')}
              icon={<Users size={20} className="text-blue-600" />}
              bg="bg-blue-50"
              title="Manage Employees"
              desc="Add or view records"
            />
            <QuickAction
              onClick={() => navigate('/attendance')}
              icon={<CheckCircle size={20} className="text-green-600" />}
              bg="bg-green-50"
              title="Mark Attendance"
              desc="Track daily attendance"
            />
          </div>

          {stats?.departments?.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Departments
              </p>
              <ul className="space-y-2">
                {stats.departments.map(d => (
                  <li key={d.name} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{d.name}</span>
                    <span className="font-semibold text-blue-600">{d.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, bg, label, value, sub }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`${bg} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-400">{sub}</p>
      </div>
    </div>
  )
}

function QuickAction({ onClick, icon, bg, title, desc }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-left group"
    >
      <div className={`${bg} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-400">{desc}</p>
      </div>
      <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
    </button>
  )
}