import Header from "../../Components/Header";
import { FaRegSave } from "react-icons/fa";
import Footer from "../../Components/Footer";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../services/api";
import { useUtils } from "../../Contexts/Utils";
import { useNavigate, useParams } from "react-router-dom";

const submitAddressForm = z.object({
    addressLineOne: z.string().min(1, 'The Address Line One is required!'),
    addressLineTwo: z.string().min(1, 'The Address Line Two is required!'),
});

export default function AddressDetail(){
    const { showNotification } = useUtils();
    let { addressId } = useParams();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, setError, setValue } = useForm({
        resolver: zodResolver(submitAddressForm),
        mode: 'onChange'
    });

    function submitAddress(addressData){
        if(addressId !== "new"){
            api.put('/updateAddress/' + addressId, {
                addressLineOne: addressData.addressLineOne,
                addressLineTwo: addressData.addressLineTwo,
            }).then((restResponse) => {
                showNotification(restResponse.data.message, 2);
            }).catch((errorResp) => {
                showNotification(errorResp.response.data.message, errorResp.response.data.code);
            })
        }else{
            api.post('/createAddress', {
                addressLineOne: addressData.addressLineOne,
                addressLineTwo: addressData.addressLineTwo
            }).then((restResponse) => {
                showNotification(restResponse.data.message, 2);
            }).catch((errorResp) => {
                showNotification(errorResp.response.data.message, errorResp.response.data.code);
            })
        }
    }

    useEffect(() => {
        async function loadAddress(){
            if(addressId !== "new"){
                api.get('/address?addressId=' + addressId).then((addressData) => {
                    const restData = addressData.data;
                    setValue('addressLineOne', restData.addressLineOne);
                    setValue('addressLineTwo', restData.addressLineTwo);
                }).catch((err) => {
                    const respData = err.response.data;
                    showNotification(respData.message, respData.code);
                    navigate("/addresses");
                })
            }
        }
        loadAddress();
    }, []);

    return (
        <div className="absolute w-full h-full flex flex-col">
            <div className="flex flex-col min-w-full min-h-full">
                <div className="p-8 h-full">
                    <Header />
                    <div className="mt-4 h-full">
                        <h1 className="text-zinc-800 font-poppins text-lg">Address Details</h1>
                        <form className="flex flex-col mt-4" onSubmit={handleSubmit(submitAddress)}>
                            <div className="flex justify-between lg:space-x-2 lg:space-y-0 space-y-2 flex-col lg:flex-row">
                                <div className="w-full flex flex-col space-y-2">
                                    <div className="bg-slate-100 p-2 rounded">
                                        <div className="flex space-x-2">
                                            <label className="w-36 font-poppins text-zinc-700">Address Line 1</label>
                                            <input type="text" className="w-full bg-transparent outline-none" placeholder="An Good Street" {...register('addressLineOne')} />
                                        </div>
                                        { errors.addressLineOne ? <p className="text-red-600 font-poppins mt-0.5">{errors.addressLineOne.message}</p> : null }
                                    </div>
                                </div>
                                <div className="w-full flex flex-col space-y-2">
                                    <div className="bg-slate-100 p-2 rounded">
                                        <div className="flex space-x-2">
                                            <label className="w-36 font-poppins text-zinc-700">Address Line 2</label>
                                            <input type="text" className="w-full bg-transparent outline-none" placeholder="Zip Code" {...register('addressLineTwo')} />
                                        </div>
                                        { errors.addressLineTwo ? <p className="text-red-600 font-poppins mt-0.5">{errors.addressLineTwo.message}</p> : null }
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex justify-end mt-4">
                                <button className="p-2 rounded bg-emerald-600 hover:bg-emerald-700 flex items-center space-x-1">
                                    <FaRegSave className="w-6 h-6 text-white" />
                                    <p className="font-poppins text-white font-semibold">Save</p>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}