"use client";

import { Input } from "@/app/components/inputs/input";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/app/components/Button";
import { AuthSocialButton } from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


type Variant = 'LOGIN' | 'REGISTER';
export const AuthForm = ()=>{

    const router = useRouter();

    const session = useSession();


    useEffect(()=>{
        if(session.status === 'authenticated'){
            router.push('/users');
        }
    }, [session.status, router]);

    const [variant, setVariant] = useState<Variant>('LOGIN');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const toggleVariant = useCallback(()=>{
        if(variant==='LOGIN'){
            setVariant('REGISTER');
        }else{
            setVariant('LOGIN');
        }
    }, [variant]);
    const {
      register,
      handleSubmit, 
      formState: {
        errors
      }  
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });
    const onSubmit: SubmitHandler<FieldValues> = (data)=>{
        setIsLoading(true);
        if(variant==='REGISTER'){
            axios.post('/api/register', data)
            .then(()=>signIn('credentials', data))
            .catch(()=>toast.error('Something went wrong'))
            .finally(()=>setIsLoading(false));
        }
        if(variant==='LOGIN'){
            signIn('credentials', {
                ...data,
                redirect: false
            }).then((callback)=>{
                if(callback?.error){
                    toast.error('Invalid credentials');
                }
                if(callback?.ok && !callback?.error){
                    toast.success('Logged In');
                    router.push('/users');
                }
            }).finally(()=>setIsLoading(false));
        }
    }
    const socialAction = (action: string)=>{
        setIsLoading(true);
        signIn(action, {redirect: false}).then((callback)=>{
            if(callback?.error){
                toast.error('Invalid credentials');
            }
            if(callback?.ok && !callback.error){
                toast.success('Logged In');
            }
        }).finally(()=>setIsLoading(false));
    }
    return (

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {variant==='REGISTER' && (
                    <Input disabled={isLoading} label="Name" id="name" register={register} errors={errors} />
                )}
                <Input disabled={isLoading} label="Email" id="email" register={register} errors={errors} type="email"/>
                <Input disabled={isLoading} label="Password" type="password" id="password" register={register} errors={errors} />
                <div>
                    <Button
                        disabled={isLoading}
                        fullWidth
                        type="submit"
                    >{
                        variant==='LOGIN' ? 'Sign in' : 'Register'
                    }</Button>
                </div>
            </form>
            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"/>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                </div>
                <div className="mt-6 flex gap-2">
                        <AuthSocialButton onClick={()=>socialAction('github')} icon={BsGithub}/>
                        <AuthSocialButton onClick={()=>socialAction('google')} icon={BsGoogle}/>
                    </div>
            </div>
                <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                    <div>
                        {variant==='LOGIN'?'New to messenger?':'Already have an account?'}
                    </div>
                    <div onClick={toggleVariant} className="underline cursor-pointer">
                        {variant==='LOGIN' ? 'Create an account' : 'Login'}
                    </div>
                </div>
            </div>
        </div>
    )
}