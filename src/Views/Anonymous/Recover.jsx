import { Link, useNavigate } from "react-router-dom";
import { VscError } from "react-icons/vsc";
import Header from "../../Components/Header";
import { useEffect, useState } from "react";
import Footer from "../../Components/Footer";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../services/api";
import { useUtils } from "../../Contexts/Utils";
import { useUser } from "../../Contexts/User";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa";

const submitRecoverForm = z.object({
    email: z.string().email('The email is not valid!')
});

export default function RecoverAccount(){
    const { getUserInfo } = useUser();
    const [recoverStep, setRecoverStep] = useState(0);
    const [fieldsTypePassword, setFieldsTypePassword] = useState({ "password": "password", "repassword": "password" });
    const navigate = useNavigate();
    const [recoverForm, setRecoverForm] = useState({
        otp: '',
        password: '',
        repeatPassword: '',
        email: ''
    });

    useEffect(() => {
        getUserInfo();
    }, []);

    const { showNotification } = useUtils();

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(submitRecoverForm),
        mode: 'onChange'
    });

    function recoverAccount(formData){
        reset();

        api.post('/recoverAccount', formData).then((resp) => {
            const respData = resp.data;
            showNotification(respData.message, respData.alertType);
            setRecoverForm({
                ...recoverForm,
                email: formData.email
            });
            setRecoverStep(1);
        }).catch((err) => {
            const respData = err.response.data;
            showNotification(respData.message, respData.code);
        });
    }

    function tooglePasswordView(fieldName){
        setFieldsTypePassword((lastStatus) => {
            const updatedStatus = { ...lastStatus };
            updatedStatus[fieldName] = updatedStatus[fieldName] === "password" ? "text" : "password";
            return updatedStatus;
        });
    }

    function updateField(e){
        setRecoverForm({
            ...recoverForm,
            [e.target.name]: e.target.value
        });
    }
    
    function changePassword(e){
        e.preventDefault();

        if(recoverForm.password !== recoverForm.repeatPassword){
            showNotification("Passwords don't match", 1);
        }else if(recoverForm.password.length < 8){
            showNotification("Password cannot be less than 8 characters!", 1);
        }else if(recoverForm.otp.length !== 6){
            showNotification("OTP needs to have 3 characters!", 1);
        }else{
            api.post('/resetPassword', {
                otp: recoverForm.otp,
                password: recoverForm.password,
                email: recoverForm.email
            }).then((resp) => {
                const respData = resp.data;
                showNotification(respData.message, respData.alertType);
                navigate("/");
            }).catch((err) => {
                const respData = err.response.data;
                showNotification(respData.message, respData.code);
            });
        }
    }

    return (
        <div className="absolute w-full h-full flex flex-col">
            <div className="p-8 flex flex-col min-w-full min-h-full">
                <Header />
                <div className="h-full flex flex-col lg:flex-row justify-center items-center lg:bg-[url('/pizza.svg')] bg-contain bg-no-repeat bg-center">
                    <div className="lg:w-1/2 w-full flex flex-col lg:items-center justify-center">
                        <div className="lg:w-[32rem]">
                            <h1 className="text-zinc-800 leading-[1.4] text-6xl font-semibold">Recover your <label className="border-[#8C52FF] border-b-8">meals</label> account!</h1>    
                            <p className="mt-6 text-zinc-800 text-lg font-poppins font-extralight">Did you remember?</p>
                            <Link to="/" className="font-poppins font-semibold text-[#8C52FF] text-lg hover:underline">SignIn</Link>
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full flex flex-col items-center justify-center mt-8 lg:mt-0">
                        { recoverStep === 0 ? <form className="w-full lg:w-auto flex flex-col space-y-4" onSubmit={handleSubmit(recoverAccount)}>
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
                            <button type="submit" className="font-poppins font-semibold bg-[#8C52FF] p-3 rounded-lg shadow-xl text-white hover:bg-[#7e48e8]">Send SMS</button>
                        </form> :
                        <form className="w-full lg:w-auto flex flex-col space-y-4" onSubmit={changePassword}>
                            <div className="lg:w-96 w-full bg-[#EEF2F6] rounded-lg flex items-center opacity-90 borderborder-[#EEF2F6]">
                                <input
                                    type="text"
                                    placeholder="OTP Code"
                                    required
                                    autoCapitalize="off"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    className="font-poppins font-extralight p-2 rounded-lg bg-[#EEF2F6] w-full outline-none"
                                    name="otp"
                                    onChange={updateField}
                                />
                            </div>
                            <div className="lg:w-96 w-full bg-[#EEF2F6] rounded-lg flex items-center opacity-90 borderborder-[#EEF2F6]">
                                <input
                                    type={fieldsTypePassword.password}
                                    placeholder="Password"
                                    autoCapitalize="off"
                                    autoComplete="off"
                                    required
                                    autoCorrect="off"
                                    className="font-poppins font-extralight p-2 rounded-lg bg-[#EEF2F6] w-full outline-none"
                                    name="password"
                                    onChange={updateField}
                                />
                                <div className="mr-2 hover:cursor-pointer" onClick={() => { tooglePasswordView("password"); }}>
                                    { fieldsTypePassword.password === "password" ? <FaRegEye className="w-6 h-6 text-zinc-600" /> : <FaRegEyeSlash className="w-6 h-6 text-zinc-600" /> }
                                </div>
                            </div>
                            <div className="lg:w-96 w-full bg-[#EEF2F6] rounded-lg flex items-center opacity-90 borderborder-[#EEF2F6]">
                                <input
                                    type={fieldsTypePassword.repassword}
                                    placeholder="Repite Your Password"
                                    autoCapitalize="off"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    required
                                    className="font-poppins font-extralight p-2 rounded-lg bg-[#EEF2F6] w-full outline-none"
                                    name="repeatPassword"
                                    onChange={updateField}
                                />
                                <div className="mr-2 hover:cursor-pointer" onClick={() => { tooglePasswordView("repassword"); }}>
                                    { fieldsTypePassword.repassword === "password" ? <FaRegEye className="w-6 h-6 text-zinc-600" /> : <FaRegEyeSlash className="w-6 h-6 text-zinc-600" /> }
                                </div>
                            </div>
                        <button type="submit" className="font-poppins font-semibold bg-[#8C52FF] p-3 rounded-lg shadow-xl text-white hover:bg-[#7e48e8]">Check OTP</button>
                        </form> }
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