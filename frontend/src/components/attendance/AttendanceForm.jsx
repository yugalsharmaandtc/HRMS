import { useState, useEffect } from 'react'
import { attendanceAPI } from '../../services/api'
import toast from 'react-hot-toast'
import Spinner from '../ui/Spinner'
import { format } from 'date-fns'

const STATUSES = ['Present', 'Absent', 'Half Day', 'Late']

// Color per status for the toggle buttons
const statusColors = {
  Present:    'border-green-400  bg-green-50  text-green-700',
  Absent:     'border-red-400    bg-red-50    text-red-700',
  'Half Day': 'border-yellow-400 bg-yellow-50 text-yellow-700',
  Late:       'border-orange-400 bg-orange-50 text-orange-700',
}

export default function AttendanceForm({ record, employees, onSuccess, onCancel }) {
  const isEdit = !!record
  const [loading, setLoading] = useState(false)
  const [errors,  setErrors]  = useState({})
  const [form, setForm] = useState({
    employee_id: '',
    date:        format(new Date(), 'yyyy-MM-dd'),
    status:      'Present',
    notes:       '',
  })

  // Fill form when editing an existing record
  useEffect(() => {
    if (record) {
      setForm({
        employee_id: record.employee_id,
        date:        record.date,
        status:      record.status,
        notes:       record.notes || '',
      })
    }
  }, [record])

  const validate = () => {
    const e = {}
    if (!isEdit && !form.employee_id) e.employee_id = 'Select an employee'
    if (!form.date)                   e.date        = 'Date is required'
    if (!form.status)                 e.status      = 'Status is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      if (isEdit) {
        // Only status and notes can be changed when editing
        await attendanceAPI.update(record.id, {
          status: form.status,
          notes:  form.notes,
        })
        toast.success('Attendance updated')
      } else {
        await attendanceAPI.mark({
          employee_id: Number(form.employee_id),
          date:        form.date,
          status:      form.status,
          notes:       form.notes || null,
        })
        toast.success('Attendance marked')
      }
      onSuccess()
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Something went wrong'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Employee selector - only shown when adding new */}
      {!isEdit && (
        <div>
          <label className="label">Employee *</label>
          <select
            value={form.employee_id}
            onChange={e => {
              setForm(f => ({ ...f, employee_id: e.target.value }))
              setErrors(ev => ({ ...ev, employee_id: '' }))
            }}
            className="input-field"
          >
            <option value="">Select employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name} ({emp.employee_id})
              </option>
            ))}
          </select>
          {errors.employee_id && (
            <p className="text-xs text-red-500 mt-1">{errors.employee_id}</p>
          )}
        </div>
      )}

      {/* When editing show employee name as read-only info */}
      {isEdit && (
        <div className="bg-blue-50 rounded-lg px-4 py-3">
          <p className="text-sm font-medium text-blue-900">{record.employee_name}</p>
          <p className="text-xs text-blue-500">
            {format(new Date(record.date), 'EEEE, MMMM d yyyy')}
          </p>
        </div>
      )}

      {/* Date picker - only shown when adding new */}
      {!isEdit && (
        <div>
          <label className="label">Date *</label>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            max={format(new Date(), 'yyyy-MM-dd')}
            className="input-field"
          />
          {errors.date && (
            <p className="text-xs text-red-500 mt-1">{errors.date}</p>
          )}
        </div>
      )}

      {/* Status toggle buttons */}
      <div>
        <label className="label">Status *</label>
        <div className="grid grid-cols-2 gap-2">
          {STATUSES.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setForm(f => ({ ...f, status: s }))}
              className={`py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                form.status === s
                  ? statusColors[s]
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Optional notes */}
      <div>
        <label className="label">Notes (optional)</label>
        <textarea
          value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          placeholder="Any additional notes..."
          rows={2}
          className="input-field resize-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-1">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading && <Spinner size="sm" />}
          {isEdit ? 'Update' : 'Mark Attendance'}
        </button>
      </div>
    </form>
  )
}