import { verifyUser } from '@/actions/auth/controller';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

import Link from 'next/link';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function VerificationPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  let message = 'Verifying email...';
  let verified = false;
  const { token } = await searchParams;

  try {
    await verifyUser(Array.isArray(token) || !token ? '' : token);

    message = 'Email verified successfully!';
    verified = true;
  } catch (error) {
    message = (error as Error).message;
  }

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-balance text-muted-foreground">
            {message}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          {verified && (
            <Button asChild>
              <Link
                href={'/auth/login'}
                className="bg-primary text-white text-sm font-medium hover:bg-primary/90 h-10 px-4 py-2 rounded-lg w-full text-center"
              >
                Sign in
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
