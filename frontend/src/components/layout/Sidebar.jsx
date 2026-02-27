import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, CalendarCheck, Briefcase, ChevronRight } from 'lucide-react'
import { useGreeting } from '../hooks/useGreeting'

const navItems = [
  { to: '/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/employees', label: 'Employees',  icon: Users },
  { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
]

export default function Sidebar() {
  const { greeting } = useGreeting()

  // Determine active color based on greeting
  const getActiveColor = () => {
    if (greeting.includes('Morning')) return 'rgb(143, 154, 179)' // #8f9ab3
    if (greeting.includes('Afternoon')) return 'rgb(91, 102, 129)' // #5b6681
    if (greeting.includes('Evening')) return 'rgb(49, 59, 82)' // #313b52
    return 'rgb(143, 154, 179)'
  }

  const activeColor = getActiveColor()

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">

      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <Briefcase size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-tight">HRMS</p>
            <p className="text-xs text-gray-400 font-medium">PORTAL V2</p>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
          Main Menu
        </p>
        <ul className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
                style={({ isActive }) => isActive ? { backgroundColor: activeColor } : {}}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                    {label}
                    {isActive && (
                      <ChevronRight size={18} className="ml-auto text-white" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Admin info at bottom */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
            A
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Admin</p>
            <p className="text-xs text-gray-400">admin@hrms.com</p>
          </div>
        </div>
      </div>

    </aside>
  )
}