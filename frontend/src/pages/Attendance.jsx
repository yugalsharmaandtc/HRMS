import { useState, useEffect, useCallback } from 'react'
import { CalendarCheck, Plus, Pencil, Trash2, Filter } from 'lucide-react'
import { employeeAPI, attendanceAPI } from '../services/api'
import toast from 'react-hot-toast'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import { PageLoader } from '../components/ui/Spinner'
import StatusBadge from '../components/ui/StatusBadge'
import AttendanceForm from '../components/attendance/AttendanceForm'
import { format } from 'date-fns'

export default function Attendance() {
  const [records,       setRecords]       = useState([])
  const [employees,     setEmployees]     = useState([])
  const [loading,       setLoading]       = useState(true)
  const [filterEmployee, setFilterEmployee] = useState('')
  const [filterDate,    setFilterDate]    = useState('')
  const [showAddModal,  setShowAddModal]  = useState(false)
  const [editRecord,    setEditRecord]    = useState(null)
  const [deleteTarget,  setDeleteTarget]  = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (filterEmployee) params.employee_id  = filterEmployee
      if (filterDate)     params.filter_date  = filterDate

      const [attRes, empRes] = await Promise.all([
        attendanceAPI.getAll(params),
        employeeAPI.getAll(),
      ])
      setRecords(attRes.data)
      setEmployees(empRes.data)
    } catch {
      toast.error('Failed to load attendance records')
    } finally {
      setLoading(false)
    }
  }, [filterEmployee, filterDate])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await attendanceAPI.delete(deleteTarget.id)
      toast.success('Record deleted')
      setDeleteTarget(null)
      fetchAll()
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) return <PageLoader />

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {records.length} record{records.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
          disabled={employees.length === 0}
        >
          <Plus size={16} /> Mark Attendance
        </button>
      </div>

      {/* Warning if no employees exist yet */}
      {employees.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
          Add employees first before marking attendance.
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={filterEmployee}
            onChange={e => setFilterEmployee(e.target.value)}
            className="input-field pl-9 w-52"
          >
            <option value="">All Employees</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>{e.full_name}</option>
            ))}
          </select>
        </div>

        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          className="input-field w-44"
        />

        {(filterEmployee || filterDate) && (
          <button
            onClick={() => { setFilterEmployee(''); setFilterDate('') }}
            className="btn-secondary text-sm"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Empty state or table */}
      {records.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={CalendarCheck}
            title="No attendance records"
            description={
              filterEmployee || filterDate
                ? 'No records match your filters'
                : 'Start by marking attendance for your employees'
            }
            action={!filterEmployee && !filterDate && employees.length > 0 && (
              <button onClick={() => setShowAddModal(true)} className="btn-primary">
                <Plus size={16} /> Mark Attendance
              </button>
            )}
          />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Employee</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Date</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Notes</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {records.map(rec => (
                  <tr key={rec.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm flex-shrink-0">
                          {(rec.employee_name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{rec.employee_name}</p>
                          <p className="text-xs text-gray-400">{rec.employee_emp_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">
                      {format(new Date(rec.date), 'dd MMM yyyy')}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={rec.status} />
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {rec.notes || '—'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditRecord(rec)}
                          className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(rec)}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mark Attendance Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Mark Attendance">
        <AttendanceForm
          employees={employees}
          onSuccess={() => { setShowAddModal(false); fetchAll() }}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Attendance Modal */}
      <Modal isOpen={!!editRecord} onClose={() => setEditRecord(null)} title="Edit Attendance">
        <AttendanceForm
          record={editRecord}
          employees={employees}
          onSuccess={() => { setEditRecord(null); fetchAll() }}
          onCancel={() => setEditRecord(null)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Record">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Delete attendance record for{' '}
            <span className="font-semibold">{deleteTarget?.employee_name}</span> on{' '}
            {deleteTarget && format(new Date(deleteTarget.date), 'dd MMM yyyy')}?
          </p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setDeleteTarget(null)} className="btn-secondary">Cancel</button>
            <button onClick={handleDelete} disabled={deleteLoading} className="btn-danger">
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}