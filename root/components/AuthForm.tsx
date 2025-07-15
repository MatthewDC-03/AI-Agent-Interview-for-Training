"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image"
import Link from "next/link"
import { auth } from "@/firebase/client"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import FormField from "./FormField"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { signUp, signIn } from "@/lib/actions/auth.action"

const authFormSchema = (type: FormType) => {
    return z.object({
        name: type == 'sign-up' ? z.string().min(3) :  z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3), 
    })
}

const AuthForm = ({type}: {type: FormType}) => {
    const router = useRouter()
    const formSchema = authFormSchema(type)

    // define form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    })

    // submit form
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try{
            if(type == 'sign-up'){
                // getting user values
                const {name, email, password} = values
                // creating user with email and password
                const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name: name!,
                    email: email,
                    password: password
                })
                // if result is not successful, show error message
                if(!result?.success){
                    toast.error(result?.message)
                    return
                }
                toast.success('Account created successfully!')
                router.push('/sign-in')
            }
            else{
                // signing in user with email and password
                // getting user values
                const {email, password} = values
                const userCredential = await signInWithEmailAndPassword(auth, email, password)

                const idToken = await userCredential.user.getIdToken()
                // if idToken is not available, show error message
                if(!idToken){
                    toast.error('Sign in failed')
                    return
                }
                // if available, signing in user with idToken
                await signIn({
                    email, idToken
                })

                toast.success('Signed in successfully!')
                router.push('/')
            }
        }
        catch(error){
            console.log(error)
            toast.error(`Error: ${error}`)
        }
    }

    const isSignIn = type === "sign-in"
    return (
        <div className="card-border lg:min-w[566px]" >
            <div className="flex flex-col gap-6 card py-14 px-10" >
                <div className="flex flex-row gap-2 justify-center" >
                    <Image 
                    src="/logo.svg" 
                    alt="logo" 
                    height={32} 
                    width={38} 
                    />
                    <h2 className="text-primary-100" >MockView</h2>
                </div>
                <h3>Practice Job Interview with AI</h3>
            <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                {/* Shows the Name field if user wants sign-up */}
                {!isSignIn && 
                <FormField 
                control={form.control} 
                name="name" 
                label="Name" 
                placeholder="Name" />
                }
                
                {/* Default email field */}
                <FormField 
                control={form.control} 
                name="email" 
                label="Email" 
                placeholder="Email"
                type="email"
                />

                {/* Default password field */}
                <FormField 
                control={form.control} 
                name="password" 
                label="Password" 
                placeholder="Password"
                type="password"
                />
            <Button className="btn" type="submit">{isSignIn ? 'Sign in' : 'Create an Account'}</Button>
          </form>
        </Form>
        <p className="text-center" >
            {isSignIn ? 'No account yet?' : 'Have an account already?'}
            <Link 
            className="font-bold text-user-primary ml-1"
            href={!isSignIn ? '/sign-in' : '/sign-up'}
            >
            {!isSignIn ? "Sign in" : "Sign up"}
            </Link>
        </p>
        </div>
        </div>
      )
}

export default AuthForm