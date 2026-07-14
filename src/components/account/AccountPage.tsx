'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'
import {
  Check,
  Eye,
  EyeOff,
  History,
  LockKeyhole,
  Trash2,
  UserRound,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { NavbarSection } from '@/components/landing/sections/NavbarSection'
import { FooterSection } from '@/components/landing/sections/FooterSection'

type AccountSection = 'history' | 'personal' | 'password'
type Profile = {
  fullName?: string
  email?: string
  phoneNumber?: string
  gender?: string
  bio?: string
  address?: string
  city?: string
  country?: string
  postcode?: string
}
type HistoryRow = {
  _id: string
  selectedCity?: string
  preferredDestinations?: string
  userProfile?: { tripLengthDays?: number }
  suggestedCities?: {
    cityName?: string
    countryName?: string
    numberOfDays?: number
  }[]
}
const API = (
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api/v1'
).replace(/\/$/, '')
const menu = [
  {
    id: 'history',
    label: 'Search History',
    href: '/account/search-history',
    icon: History,
  },
  {
    id: 'personal',
    label: 'Personal Information',
    href: '/account/personal-information',
    icon: UserRound,
  },
  {
    id: 'password',
    label: 'Change Password',
    href: '/account/change-password',
    icon: LockKeyhole,
  },
] as const

function useToken() {
  const { data: session } = useSession()
  return (session?.user as { accessToken?: string } | undefined)?.accessToken
}
async function apiRequest(path: string, token: string, init?: RequestInit) {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...(init?.headers || {}) },
  })
  const result = await response.json()
  if (!response.ok || !result?.success)
    throw new Error(result?.message || 'Request failed')
  return result
}

export function AccountPage({ section }: { section: AccountSection }) {
  return (
    <main className="account-page">
      <NavbarSection activePage="none" accountMode />
      <section className="account-area">
        <aside className="account-sidebar">
          {menu.map(item => {
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                href={item.href}
                className={section === item.id ? 'active' : ''}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </Link>
            )
          })}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="account-logout"
          >
            Log Out
          </button>
        </aside>
        <div className="account-content">
          {section === 'history' && <SearchHistory />}
          {section === 'personal' && <PersonalInformation />}
          {section === 'password' && <ChangePassword />}
        </div>
      </section>
      <FooterSection />
    </main>
  )
}

function SearchHistory() {
  const token = useToken()
  const [rows, setRows] = useState<HistoryRow[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!token) return
    apiRequest('/history/my?limit=50&sortOrder=desc', token)
      .then(result => setRows(result.data || []))
      .catch(error => toast.error(error.message))
      .finally(() => setLoading(false))
  }, [token])
  const remove = async (id: string) => {
    if (!token) return
    try {
      await apiRequest(`/history/my/${id}`, token, { method: 'DELETE' })
      setRows(current => current.filter(row => row._id !== id))
      toast.success('History deleted successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Delete failed')
    }
  }
  return (
    <div className="history-panel">
      <div className="history-table">
        <div className="history-row head">
          <span>Country</span>
          <span>Trip Length</span>
          <span>Action</span>
        </div>
        {loading ? (
          <p className="empty-history">Loading history...</p>
        ) : rows.length ? (
          rows.map(row => {
            const city =
              row.selectedCity ||
              row.suggestedCities?.[0]?.cityName ||
              row.preferredDestinations ||
              'Journey'
            const days =
              row.userProfile?.tripLengthDays ||
              row.suggestedCities?.[0]?.numberOfDays
            return (
              <div className="history-row" key={row._id}>
                <span>{city}</span>
                <span>{days ? `${days} days` : '—'}</span>
                <span className="history-actions">
                  <Link
                    href={`/results?historyId=${row._id}`}
                    aria-label={`View ${city}`}
                  >
                    <Eye size={17} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(row._id)}
                    aria-label={`Delete ${city}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </span>
              </div>
            )
          })
        ) : (
          <p className="empty-history">No search history found.</p>
        )}
      </div>
      <div className="history-meta">
        <span>
          Showing {rows.length} result{rows.length === 1 ? '' : 's'}
        </span>
      </div>
    </div>
  )
}

function PersonalInformation() {
  const token = useToken()
  const [profile, setProfile] = useState<Profile>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    if (!token) return
    apiRequest('/user/profile', token)
      .then(result => setProfile(result.data || {}))
      .catch(error => toast.error(error.message))
      .finally(() => setLoading(false))
  }, [token])
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token) return
    setSaving(true)
    const data = new FormData(event.currentTarget)
    try {
      const result = await apiRequest('/user/profile', token, {
        method: 'PUT',
        body: data,
      })
      setProfile(result.data)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Update failed')
    } finally {
      setSaving(false)
    }
  }
  if (loading)
    return <div className="account-card">Loading your profile...</div>
  return (
    <form className="account-card" onSubmit={submit}>
      <div className="account-card-heading">
        <h1>Personal Information</h1>
        <p>Manage your personal information and profile details.</p>
      </div>
      <div className="gender-row">
        <label>
          Male{' '}
          <input
            type="radio"
            name="gender"
            value="male"
            defaultChecked={profile.gender !== 'female'}
          />
        </label>
        <label>
          Female{' '}
          <input
            type="radio"
            name="gender"
            value="female"
            defaultChecked={profile.gender === 'female'}
          />
        </label>
      </div>
      <div className="form-grid">
        <Field
          name="fullName"
          label="Full Name"
          defaultValue={profile.fullName}
        />
        <Field
          name="email"
          label="Email Address"
          type="email"
          defaultValue={profile.email}
        />
        <Field
          name="phoneNumber"
          label="Phone Number"
          type="tel"
          defaultValue={profile.phoneNumber}
        />
        <Field name="city" label="City" defaultValue={profile.city} />
        <label className="field full">
          Bio
          <textarea name="bio" defaultValue={profile.bio} />
        </label>
        <Field
          name="address"
          label="Street Address"
          className="full"
          defaultValue={profile.address}
        />
        <Field name="country" label="Country" defaultValue={profile.country} />
        <Field
          name="postcode"
          label="Postal Code"
          defaultValue={profile.postcode}
        />
      </div>
      <div className="form-actions">
        <button type="reset" className="discard">
          Discard Changes
        </button>
        <button disabled={saving} type="submit" className="save">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}

function ChangePassword() {
  const token = useToken()
  const [visible, setVisible] = useState<Record<string, boolean>>({})
  const [values, setValues] = useState({ current: '', next: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const rules = [
    ['Minimum 8 characters.', values.next.length >= 8],
    ['At least one uppercase letter.', /[A-Z]/.test(values.next)],
    ['At least one lowercase letter.', /[a-z]/.test(values.next)],
    ['At least one number.', /\d/.test(values.next)],
    ['At least one special character.', /[^A-Za-z0-9]/.test(values.next)],
    ['No spaces allowed.', values.next.length > 0 && !/\s/.test(values.next)],
  ] as const
  const mismatch = values.confirm.length > 0 && values.next !== values.confirm
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token || mismatch || !rules.every(rule => rule[1]))
      return toast.error('Please meet all password requirements')
    setSaving(true)
    try {
      await apiRequest('/auth/change-password', token, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: values.current,
          newPassword: values.next,
        }),
      })
      toast.success('Password changed successfully')
      setValues({ current: '', next: '', confirm: '' })
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Password change failed',
      )
    } finally {
      setSaving(false)
    }
  }
  return (
    <form className="account-card password-card" onSubmit={submit}>
      <div className="account-card-heading">
        <h1>Change Password</h1>
        <p>Manage your account security.</p>
      </div>
      <div className="password-grid">
        {(['current', 'next', 'confirm'] as const).map(name => (
          <label
            className={`field password-field ${name === 'confirm' ? 'confirm' : ''}`}
            key={name}
          >
            {name === 'current'
              ? 'Current Password'
              : name === 'next'
                ? 'New Password'
                : 'Confirm New Password'}
            <span>
              <input
                type={visible[name] ? 'text' : 'password'}
                value={values[name]}
                onChange={event =>
                  setValues(current => ({
                    ...current,
                    [name]: event.target.value,
                  }))
                }
                className={name === 'confirm' && mismatch ? 'invalid' : ''}
                required
              />
              <button
                type="button"
                onClick={() =>
                  setVisible(current => ({
                    ...current,
                    [name]: !current[name],
                  }))
                }
              >
                {visible[name] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
          </label>
        ))}
      </div>
      <div className="password-rules">
        {rules.map(([text, valid]) => (
          <p className={values.next && !valid ? 'invalid' : ''} key={text}>
            <Check size={13} />
            {text}
          </p>
        ))}
        {mismatch && <p className="invalid">× Passwords do not match.</p>}
      </div>
      <div className="form-actions">
        <button
          type="button"
          onClick={() => setValues({ current: '', next: '', confirm: '' })}
          className="discard"
        >
          Discard Changes
        </button>
        <button disabled={saving} type="submit" className="save">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}

function Field({
  label,
  className = '',
  ...props
}: {
  label: string
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`field ${className}`}>
      {label}
      <input {...props} />
    </label>
  )
}
