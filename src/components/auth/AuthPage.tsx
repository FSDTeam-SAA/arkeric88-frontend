'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FormEvent, Suspense, useEffect, useState } from 'react'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import {
  CountryCode,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from 'libphonenumber-js/min'

type Mode = 'login' | 'signup' | 'forgot' | 'otp' | 'reset'
const API = (
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api/v1'
).replace(/\/$/, '')

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
const phoneCountries = getCountries()
  .map(code => ({
    code,
    name: regionNames.of(code) || code,
    callingCode: getCountryCallingCode(code),
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

export default function AuthPage({ mode }: { mode: Mode }) {
  return (
    <Suspense fallback={<main className="min-h-screen bg-white" />}>
      <AuthPageContent mode={mode} />
    </Suspense>
  )
}

function AuthPageContent({ mode }: { mode: Mode }) {
  const router = useRouter()
  const params = useSearchParams()
  const [visiblePasswords, setVisiblePasswords] = useState<
    Record<string, boolean>
  >({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>('US')
  const [phoneValue, setPhoneValue] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const emailFromUrl = params.get('email') || ''
  const callbackUrl = params.get('callbackUrl') || '/'
  useEffect(() => setVisiblePasswords({}), [mode])
  const heading = (title: string) => (
    <>
      <Link
        href="/"
        className="fixed left-4 top-5 z-20 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#5E6755] transition-colors hover:bg-[#5E6755]/10 md:left-6 md:top-6"
      >
        <ArrowLeft size={18} aria-hidden="true" />
        Go Home
      </Link>
      {title}
    </>
  )
  const titles = {
    login: [heading('Welcome Back!'), 'Access and manage your account'],
    signup: [heading('Create Account'), 'Start planning journeys made for you'],
    forgot: [
      heading('Forgot Password?'),
      'Enter your email to receive a verification code',
    ],
    otp: [
      heading('Enter Verification Code'),
      `We sent a 6-digit code to ${emailFromUrl}`,
    ],
    reset: [
      heading('Create New Password'),
      'Choose a secure password for your account',
    ],
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setPhoneError('')
    const values = Object.fromEntries(new FormData(event.currentTarget))
    let normalizedPhone = ''

    if (mode === 'signup') {
      const rawPhone = String(values.phone || '').trim()
      const parsedPhone = parsePhoneNumberFromString(rawPhone, phoneCountry)
      if (!parsedPhone?.isValid()) {
        const countryName = regionNames.of(phoneCountry) || phoneCountry
        const message =
          phoneCountry === 'US'
            ? 'Enter a valid US phone number, for example (201) 555-0123.'
            : `Enter a valid phone number for ${countryName}.`
        setPhoneError(message)
        return
      }
      normalizedPhone = parsedPhone.number
    }

    setLoading(true)
    try {
      if (mode === 'login') {
        const result = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
        })
        if (!result?.ok)
          throw new Error(result?.error || 'Email or password is incorrect')
        toast.success('Login successful!')
        router.push(callbackUrl.startsWith('/') ? callbackUrl : '/')
        router.refresh()
        return
      }
      const endpoints = {
        signup: 'register',
        forgot: 'forgot-password',
        otp: 'verify',
        reset: 'reset-password',
      } as const
      const body =
        mode === 'signup'
          ? {
              fullName: values.fullName,
              email: values.email,
              phone: normalizedPhone,
              password: values.password,
            }
          : mode === 'forgot'
            ? { email: values.email }
            : mode === 'otp'
              ? { email: emailFromUrl, otp: values.otp }
              : { email: emailFromUrl, newPassword: values.password }
      if (
        (mode === 'signup' || mode === 'reset') &&
        values.password !== values.confirmPassword
      )
        throw new Error('Passwords do not match')
      const response = await fetch(`${API}/auth/${endpoints[mode]}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const result = await response.json()
      if (!response.ok || !result?.success)
        throw new Error(result?.message || 'Something went wrong')
      toast.success(result?.message || 'Request completed successfully!')
      if (mode === 'forgot')
        router.push(
          `/forgot-password/otp?email=${encodeURIComponent(String(values.email))}`,
        )
      else if (mode === 'otp')
        router.push(
          `/forgot-password/reset?email=${encodeURIComponent(emailFromUrl)}`,
        )
      else router.push('/login')
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Something went wrong'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }
  const selectedCallingCode = getCountryCallingCode(phoneCountry)
  const phoneField = (
    <label className="block text-base font-semibold leading-[120%] text-[#2A2A2A]">
      Phone
      <sup className="text-lg font-bold text-[#AAB7A2]"> *</sup>
      <div className="mt-2 flex h-12 overflow-hidden rounded-lg bg-[#EAEAEA] focus-within:ring-2 focus-within:ring-[#5E6755]/25">
        <select
          aria-label="Phone country code"
          value={phoneCountry}
          onChange={event => {
            setPhoneCountry(event.target.value as CountryCode)
            setPhoneError('')
          }}
          className="w-[145px] shrink-0 border-0 border-r border-[#D2D2D2] bg-transparent px-3 text-sm font-semibold text-[#303030] outline-none"
        >
          {phoneCountries.map(country => (
            <option key={country.code} value={country.code}>
              +{country.callingCode} · {country.name}
            </option>
          ))}
        </select>
        <input
          name="phone"
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={phoneValue}
          onChange={event => {
            setPhoneValue(event.target.value)
            setPhoneError('')
          }}
          placeholder={phoneCountry === 'US' ? '(201) 555-0123' : 'Phone number'}
          aria-invalid={Boolean(phoneError)}
          aria-describedby="signup-phone-help signup-phone-error"
          className="min-w-0 flex-1 border-0 bg-transparent px-4 text-base font-medium lining-nums tabular-nums text-[#131313] outline-none placeholder:text-[#787878]"
        />
      </div>
      <span
        id="signup-phone-help"
        className="mt-1.5 block text-xs font-normal leading-5 text-[#686868]"
      >
        {phoneCountry === 'US'
          ? 'Example: (201) 555-0123. Country code +1 will be added automatically.'
          : `Country code +${selectedCallingCode} will be added automatically.`}
      </span>
      {phoneError && (
        <span
          id="signup-phone-error"
          role="alert"
          className="mt-1 block text-sm font-medium text-red-700"
        >
          {phoneError}
        </span>
      )}
    </label>
  )
  const field = (
    name: string,
    label: string,
    type = 'text',
    placeholder = '',
  ) => {
    const isPassword = type === 'password'
    const isVisible = Boolean(visiblePasswords[name])
    const autoComplete =
      name === 'email'
        ? 'email'
        : name === 'phone'
          ? 'tel'
          : isPassword
            ? mode === 'login'
              ? 'current-password'
              : 'new-password'
            : mode === 'otp'
              ? 'one-time-code'
              : undefined
    return (
      <label className="block text-base font-semibold leading-[120%] text-[#2A2A2A]">
        {label}
        <sup className="text-lg font-bold text-[#AAB7A2]"> *</sup>
        <div className="relative mt-2">
          <input
            name={name}
            required
            type={isPassword ? (isVisible ? 'text' : 'password') : type}
            autoComplete={autoComplete}
            placeholder={placeholder}
            minLength={isPassword ? 6 : undefined}
            className="h-12 w-full rounded-lg border-none bg-[#EAEAEA] px-4 pr-11 text-base font-medium lining-nums tabular-nums text-[#131313] outline-none placeholder:text-[#787878] focus:ring-2 focus:ring-[#5E6755]/25"
          />
          {isPassword && (
            <button
              type="button"
              onClick={() =>
                setVisiblePasswords(current => ({
                  ...current,
                  [name]: !current[name],
                }))
              }
              className="absolute right-4 top-3.5 text-[#787878]"
              aria-label={
                isVisible
                  ? `Hide ${label.toLowerCase()}`
                  : `Show ${label.toLowerCase()}`
              }
              aria-pressed={isVisible}
            >
              {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
      </label>
    )
  }
  return (
    <main className="grid min-h-screen w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-0">
      <section className="flex items-center justify-center py-8">
        <div className="flex w-full items-center justify-center px-4 md:px-0">
          <div className="w-full rounded-2xl border-2 border-[#E7E7E7] bg-white p-5 shadow-[0_0_32px_0_#0000001F] md:w-[570px] md:p-6">
            <div className="flex w-full justify-center">
              <Link href="/">
                <Image
                  src="/images/logo.png"
                  alt="Velari™"
                  width={500}
                  height={500}
                  className="h-[52px] w-[133px] object-contain"
                />
              </Link>
            </div>
            <h1 className="pt-3 text-center text-2xl font-bold leading-[120%] text-[#131313] md:text-[32px] lg:text-[40px]">
              {titles[mode][0]}
            </h1>
            <p className="pt-2 text-center text-base font-normal leading-[150%] text-[#787878] md:text-lg">
              {titles[mode][1]}
            </p>
            <form onSubmit={submit} className="space-y-4 pt-5 lg:pt-8">
              {mode === 'signup' &&
                field(
                  'fullName',
                  'Full name',
                  'text',
                  'Enter your full name...',
                )}
              {(mode === 'login' || mode === 'signup' || mode === 'forgot') &&
                field('email', 'Email', 'email', 'Enter your email address...')}
              {mode === 'signup' && phoneField}
              {mode === 'otp' &&
                field(
                  'otp',
                  'Verification code',
                  'text',
                  'Enter 6-digit code...',
                )}
              {(mode === 'login' || mode === 'signup' || mode === 'reset') &&
                field(
                  'password',
                  mode === 'reset' ? 'New password' : 'Password',
                  'password',
                  'Enter password...',
                )}
              {(mode === 'signup' || mode === 'reset') &&
                field(
                  'confirmPassword',
                  'Confirm password',
                  'password',
                  'Enter password again...',
                )}
              {mode === 'login' && (
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium leading-[120%] text-[#8C311ECC]/80 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              )}
              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}
              <div className="pt-2">
                <button
                  disabled={loading}
                  className="h-[51px] w-full rounded-lg bg-[#5E6755] py-4 text-base font-medium leading-[120%] text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? 'Please wait...'
                    : mode === 'login'
                      ? 'Sign In'
                      : mode === 'signup'
                        ? 'Create Account'
                        : mode === 'forgot'
                          ? 'Send OTP'
                          : mode === 'otp'
                            ? 'Verify'
                            : 'Continue'}
                </button>
              </div>
              <p className="pt-2 text-center text-sm font-medium leading-[120%] text-[#363636]">
                {mode === 'login' ? (
                  <>
                    Don&apos;t have an account?{' '}
                    <Link
                      href="/signup"
                      className="font-bold text-[#5E6755] underline"
                    >
                      Register Here
                    </Link>
                  </>
                ) : mode === 'signup' ? (
                  <>
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="font-bold text-[#5E6755] underline"
                    >
                      Sign In
                    </Link>
                  </>
                ) : (
                  <>
                    Back to{' '}
                    <Link
                      href="/login"
                      className="font-bold text-[#5E6755] underline"
                    >
                      Log In
                    </Link>
                  </>
                )}
              </p>
            </form>
          </div>
        </div>
      </section>
      <section className="relative hidden min-h-screen md:block">
        <Image
          src="/images/auth-bg.jpg"
          alt="Mountain viewpoint"
          fill
          priority
          className="object-cover"
        />
      </section>
    </main>
  )
}
