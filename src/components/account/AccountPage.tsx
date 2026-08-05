'use client'

import Link from 'next/link'
import { FormEvent, useCallback, useEffect, useState } from 'react'
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
import { Skeleton } from '@/components/ui/skeleton'
import { useRef } from 'react'
import { Camera } from 'lucide-react'

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
  profilePicture?: string
}
type HistoryRow = {
  _id: string
  selectedCity?: string
  preferredDestinations?: string
  userProfile?: { tripLengthDays?: number; budget?: number }
  paymentAmount?: number
  paymentStatus?: string
  aiAnalysisStatus?:
    | 'pending'
    | 'suggested_cities_ready'
    | 'completed'
    | 'failed'
  createdAt?: string
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
  const [logoutOpen, setLogoutOpen] = useState(false)
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
            onClick={() => setLogoutOpen(true)}
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
      {logoutOpen && (
        <div
          className="logout-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Log out confirmation"
        >
          <div className="logout-card">
            <button
              type="button"
              className="logout-close"
              onClick={() => setLogoutOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2>Ready to leave?</h2>
            <p>
              You&apos;ll need to sign in again to continue your journey. Are
              you sure you want to log out?
            </p>
            <div className="logout-actions">
              <button
                type="button"
                className="logout-cancel"
                onClick={() => setLogoutOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="logout-confirm"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function SearchHistory() {
  const token = useToken()
  const [rows, setRows] = useState<HistoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const perPage = 10
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const load = useCallback(
    (targetPage: number) => {
      if (!token) return
      setLoading(true)
      apiRequest(
        `/history/my?limit=${perPage}&page=${targetPage}&sortOrder=desc`,
        token,
      )
        .then(result => {
          setRows(result.data || [])
          setTotal(Number(result.meta?.total) || 0)
        })
        .catch(error => toast.error(error.message))
        .finally(() => setLoading(false))
    },
    [token],
  )
  useEffect(() => {
    load(page)
  }, [load, page])
  const remove = async (id: string) => {
    if (!token) return
    try {
      await apiRequest(`/history/my/${id}`, token, { method: 'DELETE' })
      setTotal(current => Math.max(0, current - 1))
      if (rows.length === 1 && page > 1) {
        setPage(current => current - 1)
      } else {
        setRows(current => current.filter(row => row._id !== id))
      }
      toast.success('History deleted successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Delete failed')
    }
  }
  const pageItems: (number | 'ellipsis')[] = []
  if (totalPages <= 7) {
    for (let item = 1; item <= totalPages; item++) pageItems.push(item)
  } else {
    pageItems.push(1)
    if (page > 3) pageItems.push('ellipsis')
    for (let item = Math.max(2, page - 1); item <= Math.min(totalPages - 1, page + 1); item++)
      pageItems.push(item)
    if (page < totalPages - 2) pageItems.push('ellipsis')
    pageItems.push(totalPages)
  }
  const start = total === 0 ? 0 : (page - 1) * perPage + 1
  const end = Math.min(page * perPage, total)
  return (
    <div className="history-panel">
      <div className="history-table">
        <div className="history-row head">
          <span>Destination</span>
          <span>Country</span>
          <span>Trip Length</span>
          <span>Budget</span>
          <span>Status</span>
          <span>Created</span>
          <span>Action</span>
        </div>
        {loading ? (
          <div
            className="history-skeleton"
            aria-label="Loading journey history"
          >
            {Array.from({ length: 5 }, (_, rowIndex) => (
              <div
                className="history-row history-skeleton-row"
                key={rowIndex}
                aria-hidden="true"
              >
                {Array.from({ length: 7 }, (_, columnIndex) => (
                  <Skeleton
                    className={`history-skeleton-cell cell-${columnIndex}`}
                    key={columnIndex}
                  />
                ))}
              </div>
            ))}
          </div>
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
            const matchingCity =
              row.suggestedCities?.find(item => item.cityName === city) ||
              row.suggestedCities?.[0]
            const country = matchingCity?.countryName || '—'
            const budget = row.userProfile?.budget
            const status =
              row.aiAnalysisStatus ||
              (row.paymentStatus === 'paid' ? 'completed' : 'pending')
            const statusLabel =
              status === 'suggested_cities_ready'
                ? 'Matches ready'
                : status.charAt(0).toUpperCase() + status.slice(1)
            const created = row.createdAt
              ? new Intl.DateTimeFormat('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }).format(new Date(row.createdAt))
              : '—'
            return (
              <div className="history-row" key={row._id}>
                <span className="history-destination">{city}</span>
                <span>{country}</span>
                <span>{days ? `${days} days` : '—'}</span>
                <span>
                  {budget != null ? `$${budget.toLocaleString('en-US')}` : '—'}
                </span>
                <span>
                  <i className={`history-status ${status}`}>{statusLabel}</i>
                </span>
                <span>{created}</span>
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
          {loading
            ? 'Loading results…'
            : total
              ? `Showing ${start}–${end} of ${total}`
              : 'No results'}
        </span>
        {totalPages > 1 && (
          <div className="pagination" aria-label="Search history pages">
            <button
              type="button"
              aria-label="Previous page"
              disabled={page <= 1}
              onClick={() => setPage(current => Math.max(1, current - 1))}
            >
              ‹
            </button>
            {pageItems.map((item, index) =>
              item === 'ellipsis' ? (
                <span className="pagination-ellipsis" key={`ellipsis-${index}`}>
                  …
                </span>
              ) : (
                <button
                  type="button"
                  key={item}
                  className={page === item ? 'active' : ''}
                  onClick={() => setPage(item)}
                >
                  {item}
                </button>
              ),
            )}
            <button
              type="button"
              aria-label="Next page"
              disabled={page >= totalPages}
              onClick={() =>
                setPage(current => Math.min(totalPages, current + 1))
              }
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function PersonalInformation() {
  const token = useToken()
  const { update: updateSession } = useSession()
  const [profile, setProfile] = useState<Profile>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | undefined>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!token) return
    apiRequest('/user/profile', token)
      .then(result => setProfile(result.data || {}))
      .catch(error => toast.error(error.message))
      .finally(() => setLoading(false))
  }, [token])
  const pickPhoto = () => fileInputRef.current?.click()
  const onPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file')
      return
    }
    setPhotoPreview(URL.createObjectURL(file))
  }
  // Remove photo functionality disabled for now
  // const removePhoto = () => {
  //   setPhotoPreview(undefined)
  //   if (fileInputRef.current) fileInputRef.current.value = ''
  // }
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
      setPhotoPreview(undefined)
      if (fileInputRef.current) fileInputRef.current.value = ''
      window.dispatchEvent(
        new CustomEvent('velari:profile-updated', {
          detail: result.data?.profilePicture,
        }),
      )
      await updateSession({ profilePicture: result.data?.profilePicture })
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Update failed')
    } finally {
      setSaving(false)
    }
  }
  if (loading) return <PersonalInformationSkeleton />
  const displayPhoto = photoPreview || profile.profilePicture
  return (
    <form className="account-card" onSubmit={submit}>
      <div className="account-card-heading">
        <h1>Personal Information</h1>
        <p>Manage your personal information and profile details.</p>
      </div>
      <div className="profile-photo">
        <div className="profile-photo-avatar">
          {displayPhoto ? (
            <img src={displayPhoto} alt="Profile" />
          ) : (
            <UserRound size={30} />
          )}
          <button
            type="button"
            className="profile-photo-edit"
            onClick={pickPhoto}
            aria-label="Upload profile picture"
          >
            <Camera size={16} />
          </button>
        </div>
        <div className="profile-photo-actions">
          <button type="button" className="photo-change" onClick={pickPhoto}>
            Change Photo
          </button>
          {/* Remove photo button disabled for now */}
          {/* {displayPhoto && (
            <button
              type="button"
              className="photo-remove"
              onClick={removePhoto}
            >
              <Trash2 size={14} /> Remove
            </button>
          )} */}
          <input
            ref={fileInputRef}
            type="file"
            name="profilePicture"
            accept="image/*"
            className="photo-input"
            onChange={onPhotoChange}
          />
        </div>
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
          disabled
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

function PersonalInformationSkeleton() {
  const fields = [
    { key: 'name' },
    { key: 'email' },
    { key: 'phone' },
    { key: 'city' },
    { key: 'bio', full: true, tall: true },
    { key: 'address', full: true },
    { key: 'country' },
    { key: 'postcode' },
  ]

  return (
    <div
      className="account-card profile-skeleton"
      aria-label="Loading your personal information"
      aria-busy="true"
    >
      <div className="profile-skeleton-heading">
        <Skeleton className="profile-skeleton-title" />
        <Skeleton className="profile-skeleton-subtitle" />
      </div>
      <div className="profile-photo">
        <Skeleton className="profile-skeleton-avatar" />
        <div className="profile-photo-actions">
          <Skeleton className="profile-skeleton-photo-btn" />
          <Skeleton className="profile-skeleton-photo-btn" />
        </div>
      </div>
      <div className="profile-skeleton-gender">
        <Skeleton />
        <Skeleton />
      </div>
      <div className="form-grid">
        {fields.map(field => (
          <div
            className={`profile-skeleton-field${field.full ? ' full' : ''}`}
            key={field.key}
          >
            <Skeleton className="profile-skeleton-label" />
            <Skeleton
              className={
                field.tall
                  ? 'profile-skeleton-input tall'
                  : 'profile-skeleton-input'
              }
            />
          </div>
        ))}
      </div>
      <div className="profile-skeleton-actions">
        <Skeleton />
        <Skeleton />
      </div>
    </div>
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
