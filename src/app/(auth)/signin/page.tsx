import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import SigninButton from './SigninButton'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextAuth'

export default async function Login() {
  const session = await getServerSession(authOptions)
  if(session) redirect('/home')
  return (
    
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8shadow">
        <h2 className="text-center text-3xl font-extrabold ">Log in to your account</h2>
        <SigninButton/>
        <form className="mt-8 space-y-6">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>
          <div>
            <Button type="submit" className="w-full">Log in</Button>
          </div>
        </form>
      </div>
    </div>
  )
}