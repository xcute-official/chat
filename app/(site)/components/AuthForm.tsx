"use client";

import { Input } from "@/app/components/inputs/input";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/app/components/Button";
import { AuthSocialButton } from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";

type Variant = 'LOGIN' | 'REGISTER';
export const AuthForm = ()=>{
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
            // axios register
        }
        if(variant==='LOGIN'){
            // nextauth signIn
        }
    }
    const socialAction = (action: string)=>{
        setIsLoading(true);
        // Nextauth social signIn
        
    }
    return (
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
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
                    <div
                        className="absolute inset-0 flex items-center"
                    >
                        <div className="w-full border-t border-gray-300"/>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white p-2 text-gray-500">Or continue with</span>

                        </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                        <AuthSocialButton onClick={()=>socialAction('github')} icon={BsGithub}/>
                        <AuthSocialButton onClick={()=>socialAction('google')} icon={BsGoogle}/>
                    </div>
                </div>
                <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                    {variant==='LOGIN'?'New to messenger?':'Already have an account?'}
                </div>
                <div onClick={toggleVariant} className="underline cursor-pointer">
                    {variant==='LOGIN' ? 'Create an account' : 'Login'}
                </div>
            </div>
        </div>
    )
}