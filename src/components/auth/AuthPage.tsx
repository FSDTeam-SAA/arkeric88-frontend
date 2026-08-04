'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FormEvent, Suspense, useEffect, useState } from 'react'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

type Mode = 'login' | 'signup' | 'forgot' | 'otp' | 'reset'
const API = (
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api/v1'
).replace(/\/$/, '')

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
    setLoading(true)
    setError('')
    const values = Object.fromEntries(new FormData(event.currentTarget))
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
              phone: values.phone,
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
                  alt="Velari"
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
              {mode === 'signup' &&
                field('phone', 'Phone', 'tel', 'Enter your phone number...')}
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
