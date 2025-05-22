// app/unauthorized/page.tsx

import Link from 'next/link';
import { ShieldX } from 'lucide-react'; // Using ShieldX as an example icon
import { Button } from '@/components/ui/button'; // Adjust path if your components are elsewhere
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'; // Adjust path

/**
 * UnauthorizedPage component
 *
 * This page is displayed when a user tries to access a resource
 * for which they do not have the necessary permissions.
 * It uses shadcn/ui components for styling and layout.
 */
export default function UnauthorizedPage() {
  return (
    // Main container to center the card on the page
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br  p-4">
      <Card className="w-full max-w-md shadow-2xlbackdrop-blur-md border-slate-700 text-slate-50">
        <CardHeader className="text-center">
          {/* Icon for visual emphasis */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-600/20 text-red-500">
            <ShieldX size={48} strokeWidth={1.5} />
          </div>
          <CardTitle className="text-4xl font-extrabold tracking-tight text-red-500">
            401 - Unauthorized
          </CardTitle>
          <CardDescription className="mt-2 text-lg">
            Access Denied. You do not have permission to view this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-slate-300">
            It seems you've tried to access a page that requires special
            authorization. If you believe this is an error, please contact
            the site administrator or try logging in with appropriate credentials.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center pt-6">
          {/* Button to navigate back to the homepage */}
          <Button asChild variant="destructive" size="lg" className="w-full max-w-xs transition-transform hover:scale-105 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900">
            <Link href="/">Go to Homepage</Link>
          </Button>
          {/* Optional: Add a login link if applicable */}
{/*           
          <Button asChild variant="outline" size="lg" className="w-full max-w-xs mt-4 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-50 transition-transform hover:scale-105">
            <Link href="/login">Login</Link>
          </Button>
          */}
        </CardFooter>
      </Card>
      <p className="mt-8 text-sm ">
        If issues persist, please note the time and contact support.
      </p>
    </div>
  );
}

// Optional: Metadata for the page (Next.js App Router)
export const metadata = {
  title: 'Unauthorized Access',
  description: 'You are not authorized to access this page.',
};
