import { signIn } from '@/auth';

// ...

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    console.log('toto',formData)
    await signIn('credentials', Object.fromEntries(formData));
  } catch (error) {
    if ((error as Error).message.includes('CredentialsSignin')) {
        console.log('entered here')
      return 'CredentialsSignin';
    }
    throw error;
  }
}