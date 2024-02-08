import { Link, useNavigate } from "react-router-dom";
import { VscError } from "react-icons/vsc";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Header from "../../Components/Header";
import { useEffect, useState } from "react";
import Footer from "../../Components/Footer";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../services/api";
import { useUtils } from "../../Contexts/Utils";
import { useUser } from "../../Contexts/User";

const submitRegisterForm = z.object({
    name: z.string().min(3, 'The name needs to be at least 3 characters long!'),
    email: z.string().email('The email is not valid!'),
    phone: z.string().min(9, 'The phone number is not valid!'),
    vat: z.string().min(9, 'The vat number is not valid!'),
    password: z.string().min(8, 'The password needs to be at least 8 characters long!'),
    repassword: z.string(),
}).refine((data) => data.password === data.repassword, {
    message: "Passwords don't match",
    path: ["repassword"]
});

export default function SignUp(){
    const { getUserInfo } = useUser();

    useEffect(() => {
        getUserInfo();
    }, []);

    const [fieldsTypePassword, setFieldsTypePassword] = useState({ "password": "password", "repassword": "password" });
    const { showNotification } = useUtils();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm({
        resolver: zodResolver(submitRegisterForm),
        mode: 'onChange'
    });
    
    function tooglePasswordView(fieldName){
        setFieldsTypePassword((lastStatus) => {
            const updatedStatus = { ...lastStatus };
            updatedStatus[fieldName] = updatedStatus[fieldName] === "password" ? "text" : "password";
            return updatedStatus;
        });
    }

    function createAccount(formData){
        reset();

        api.post('/createAccount', formData).then((resp) => {
            const respData = resp.data;
            showNotification(respData.message, respData.alertType);
            navigate('/')
        }).catch((err) => {
            const respData = err.response.data;
            if(respData.field === "notification"){
                showNotification(respData.message, respData.alertType);
            }else{
                setError(respData.field, {
                    message: respData.message
                });
            }
        });
    }
    
    return (
        <div className="absolute w-full h-full flex flex-col">
            <div className="p-8 flex flex-col min-w-full min-h-full">
                <Header />
                <div className="h-full flex flex-col lg:flex-row justify-center items-center lg:bg-[url('/pizza.svg')] bg-contain bg-no-repeat bg-center">
                    <div className="lg:w-1/2 w-full flex flex-col lg:items-center justify-center">
                        <div className="lg:w-[32rem]">
                            <h1 className="text-zinc-800 leading-[1.4] text-6xl font-semibold">Sign up to <label className="border-[#8C52FF] border-b-8">start</label> enyoy!</h1>    
                            <p className="mt-6 text-zinc-800 text-lg font-poppins font-extralight">Already have an account?</p>
                            <Link to="/" className="font-poppins font-semibold text-[#8C52FF] text-lg hover:underline">SignIn</Link>
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full flex flex-col items-center justify-center mt-8 lg:mt-0">
                        <form className="w-full lg:w-auto flex flex-col space-y-4" onSubmit={handleSubmit(createAccount)}>
                            <div className={`lg:w-96 w-full bg-[#EEF2F6] rounded-lg flex items-center opacity-90 border ${ errors.name ? "border-red-600" : "border-[#EEF2F6]" }`}>
                                <input
                                    type="name"
                                    placeholder="Name"
                                    autoCapitalize="on"
                                    autoComplete="name"
                                    autoCorrect="on"
                                    className="font-poppins font-extralight p-2 rounded-lg bg-[#EEF2F6] w-full outline-none"
                                    {...register('name')}
                                />
                                { errors.name ? <div className="mr-2">
                                    <VscError className="w-6 h-6 text-red-600" title={errors.name.message} />
                                </div> : null }
                            </div>
                            <div className={`lg:w-96 w-full bg-[#EEF2F6] rounded-lg flex items-center opacity-90 border ${ errors.email ? "border-red-600" : "border-[#EEF2F6]" }`}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    autoCapitalize="off"
                                    autoComplete="email"
                                    autoCorrect="off"
                                    className="font-poppins font-extralight p-2 rounded-lg bg-[#EEF2F6] w-full outline-none"
                                    {...register('email')}
                                />
                                { errors.email ? <div className="mr-2">
                                    <VscError className="w-6 h-6 text-red-600" title={errors.email.message} />
                                </div> : null }
                            </div>
                            <div className={`lg:w-96 w-full bg-[#EEF2F6] rounded-lg flex items-center opacity-90 border ${ errors.phone ? "border-red-600" : "border-[#EEF2F6]" }`}>
                                <input
                                    type="phone"
                                    placeholder="Phone Number"
                                    autoCapitalize="off"
                                    autoComplete="phone"
                                    autoCorrect="off"
                                    className="font-poppins font-extralight p-2 rounded-lg bg-[#EEF2F6] w-full outline-none"
                                    {...register('phone')}
                                />
                                { errors.phone ? <div className="mr-2">
                                    <VscError className="w-6 h-6 text-red-600" title={errors.phone.message} />
                                </div> : null }
                            </div>
                            <div className={`lg:w-96 w-full bg-[#EEF2F6] rounded-lg flex items-center opacity-90 border ${ errors.vat ? "border-red-600" : "border-[#EEF2F6]" }`}>
                                <input
                                    type="text"
                                    placeholder="VAT"
                                    autoCapitalize="off"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    className="font-poppins font-extralight p-2 rounded-lg bg-[#EEF2F6] w-full outline-none"
                                    {...register('vat')}
                                />
                                { errors.vat ? <div className="mr-2">
                                    <VscError className="w-6 h-6 text-red-600" title={errors.vat.message} />
                                </div> : null }
                            </div>
                            <div title={errors.password ? errors.password.message : null} className={`lg:w-96 w-full bg-[#EEF2F6] rounded-lg flex items-center opacity-90 border ${ errors.password ? "border-red-600" : "border-[#EEF2F6]" }`}>
                                <input
                                    type={fieldsTypePassword.password}
                                    placeholder="Password"
                                    autoCapitalize="off"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    className="font-poppins font-extralight p-2 rounded-lg bg-[#EEF2F6] w-full outline-none"
                                    {...register('password')}
                                />
                                <div className="mr-2 hover:cursor-pointer" onClick={() => { tooglePasswordView("password"); }}>
                                    { fieldsTypePassword.password === "password" ? <FaRegEye className="w-6 h-6 text-zinc-600" /> : <FaRegEyeSlash className="w-6 h-6 text-zinc-600" /> }
                                </div>
                            </div>
                            <div title={errors.repassword ? errors.repassword.message : null} className={`lg:w-96 w-full bg-[#EEF2F6] rounded-lg flex items-center opacity-90 border ${ errors.repassword ? "border-red-600" : "border-[#EEF2F6]" }`}>
                                <input
                                    type={fieldsTypePassword.repassword}
                                    placeholder="Repite Your Password"
                                    autoCapitalize="off"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    className="font-poppins font-extralight p-2 rounded-lg bg-[#EEF2F6] w-full outline-none"
                                    {...register('repassword')}
                                />
                                <div className="mr-2 hover:cursor-pointer" onClick={() => { tooglePasswordView("repassword"); }}>
                                    { fieldsTypePassword.repassword === "password" ? <FaRegEye className="w-6 h-6 text-zinc-600" /> : <FaRegEyeSlash className="w-6 h-6 text-zinc-600" /> }
                                </div>
                            </div>
                            <button type="submit" className="font-poppins font-semibold bg-[#8C52FF] p-3 rounded-lg shadow-xl text-white hover:bg-[#7e48e8]">Sign Up</button>
                        </form>
                        <div className="mt-4 flex items-center space-x-2">
                            <div className="h-[0.1rem] w-full bg-zinc-300" />
                            <p className="text-zinc-400 w-[23rem] font-poppins font-extralight">Or sign up with</p>
                            <div className="h-[0.1rem] w-full bg-zinc-300" />
                        </div>
                        <div className="lg:w-96 w-full mt-4 flex space-x-2">
                            <button className="border rounded-lg w-full p-1 justify-center items-center flex hover:bg-slate-100 bg-white">
                                <img src="/google.svg" title="Google" alt="Google" className="w-11" />
                            </button>
                            <button className="border rounded-lg w-full p-1 justify-center items-center flex hover:bg-slate-100 bg-white">
                                <img src="/github.svg" title="GitHub" alt="GitHub" className="w-11" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}