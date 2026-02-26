import { useState, useEffect } from 'react'
import { employeeAPI } from '../../services/api'
import toast from 'react-hot-toast'
import Spinner from '../ui/Spinner'

const DEPARTMENTS = [
  'Engineering', 'Product', 'Design', 'Marketing', 'Sales',
  'Human Resources', 'Finance', 'Operations', 'Legal', 'Customer Support',
]

export default function EmployeeForm({ employee, onSuccess, onCancel }) {
  const isEdit = !!employee
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState({})
  const [form, setForm] = useState({
    employee_id: '',
    full_name:   '',
    email:       '',
    department:  '',
    position:    '',
    phone:       '',
  })

  // Fill form when editing
  useEffect(() => {
    if (employee) {
      setForm({
        employee_id: employee.employee_id || '',
        full_name:   employee.full_name   || '',
        email:       employee.email       || '',
        department:  employee.department  || '',
        position:    employee.position    || '',
        phone:       employee.phone       || '',
      })
    }
  }, [employee])

  const validate = () => {
    const e = {}
    if (!form.full_name.trim() || form.full_name.trim().length < 2)
      e.full_name = 'Full name must be at least 2 characters'
    if (!form.employee_id.trim())
      e.employee_id = 'Employee ID is required'
    if (!form.email.trim())
      e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address'
    if (!form.department)
      e.department = 'Department is required'
    if (form.phone && !/^\+?\d{7,15}$/.test(form.phone.replace(/[\s\-()]/g, '')))
      e.phone = 'Enter a valid phone number (7-15 digits)'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear error for this field as user types
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const payload = { ...form }
      if (!payload.phone)    delete payload.phone
      if (!payload.position) delete payload.position

      if (isEdit) {
        await employeeAPI.update(employee.id, payload)
        toast.success('Employee updated successfully')
      } else {
        await employeeAPI.create(payload)
        toast.success('Employee added successfully')
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Employee ID *" error={errors.employee_id}>
          <input
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            disabled={isEdit}
            placeholder="e.g. EMP001"
            className={`input-field ${isEdit ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          />
        </Field>
        <Field label="Full Name *" error={errors.full_name}>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="John Doe"
            className="input-field"
          />
        </Field>
      </div>

      <Field label="Email Address *" error={errors.email}>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="john@company.com"
          className="input-field"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Department *" error={errors.department}>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select department</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </Field>
        <Field label="Position" error={errors.position}>
          <input
            name="position"
            value={form.position}
            onChange={handleChange}
            placeholder="e.g. Senior Developer"
            className="input-field"
          />
        </Field>
      </div>

      <Field label="Phone Number" error={errors.phone}>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="+91 9999999999"
          className="input-field"
        />
      </Field>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading && <Spinner size="sm" />}
          {isEdit ? 'Save Changes' : 'Add Employee'}
        </button>
      </div>
    </form>
  )
}

// Small helper so every field looks the same
function Field({ label, error, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}