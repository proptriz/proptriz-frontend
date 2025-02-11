'use server';
 
import { signIn, signOut } from '../../auth';
import { AuthError } from 'next-auth';
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  console.log('authenticate here')
  try {    
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function handleSignOut() {
  // console.log('Signing out...'); // Debugging
  await signOut({ redirectTo: '/' });
}

export async function googleSignin() {
  // console.log('Signing out...'); // Debugging
  await signIn("google");
}

export async function facebookSignin() {
  // console.log('Signing out...'); // Debugging
  await signIn("facebook");
}

export async function appleSignin() {
  // console.log('Signing out...'); // Debugging
  await signIn("Apple");
}