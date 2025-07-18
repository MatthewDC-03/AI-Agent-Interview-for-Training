'use server'

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";
import { success } from "zod";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams){
    const { uid, name, email } = params

    try{
        // fetching the user by heading to users collection getting a document with specific id and saying get
        const userRecord = await db.collection('users').doc(uid).get();
        
        if(userRecord.exists){
            return{
                success: false,
                message: 'User already exists. Please sign in instead.'
            }
        }

        await db.collection('users').doc(uid).set({
            name, email
        })

        return {
            success: true,
            message: 'Account created successfully'
        }
    }
    catch (e: any){
        console.error('Error creating a user', e)

        if(e.code == 'auth/email-already-exists'){
            return {
                success: false,
                message: 'This email is already in use.'
            }
        }

        return {
            success: false,
            message: 'Failed to create an account'
        }
    }
}

export async function signIn(params: SignInParams) {
    const {email, idToken} = params

    try{
        const userRecord = await auth.getUserByEmail(email)

        if(!userRecord){
            return {
                success: false,
                message: 'User does not exist. Please sign up.'
            }
        }

        await setSessionCookie(idToken)
    }

    catch(e){
        console.log(e)

        return {
            success: false,
            message: 'Failed to log in an Account'
        }
    }
}

export async function setSessionCookie(idToken: string){
    const cookieStore = await cookies()

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000
    })

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_NV_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
  
    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) return null;
  
    try {
      const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
  
      // get user info from db
      const userRecord = await db
        .collection("users")
        .doc(decodedClaims.uid)
        .get();
      if (!userRecord.exists) return null;
  
      return {
        ...userRecord.data(),
        id: userRecord.id,
      } as User;
    } catch (error) {
      console.log(error);
  
      // Invalid or expired session
      return null;
    }
  }

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
  }