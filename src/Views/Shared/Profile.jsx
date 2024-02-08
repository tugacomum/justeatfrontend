import Header from "../../Components/Header";
import { FaRegSave } from "react-icons/fa";
import { MdAddPhotoAlternate } from "react-icons/md";
import Footer from "../../Components/Footer";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../services/api";
import { useUser } from "../../Contexts/User";
import { IMAGES_SERVER } from "../../services/env";
import { useUtils } from "../../Contexts/Utils";

const submitProfileForm = z.object({
    nome: z.string().min(1, 'The name is required!'),
    email: z.string().email('The email is invalid!'),
    nif: z.string().min(9, 'The VAT Number is invalid!'),
    phone: z.string().min(9, 'The Phone Number is invalid!')
});

export default function Profile(){
    const { user, setUserInfo } = useUser();
    const { showNotification, setLoading } = useUtils();

    const [imgUpload, setImageUpload] = useState();
    const [imageName, setImageName] = useState('');

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(submitProfileForm),
        mode: 'onChange'
    });

    function submitProfile(profileData){
        api.patch('/updateProfile', profileData).then((restResponse) => {
            showNotification(restResponse.data.message, 2);
            setUserInfo({
                ...user,
                nome: profileData.nome
            });
        }).catch((errorResp) => {
            showNotification(errorResp.response.data.message, errorResp.response.data.code);
        })
    }

    useEffect(() => {
        async function loadProfile(){
            api.get('/profile').then((profileData) => {
                const restData = profileData.data;
                loadData(restData);
            });
        }
        loadProfile();
    }, []);

    function loadData(restData){
        setValue('nome', restData.nome);
        setValue('nif', restData.nif.toString());
        setValue('email', restData.email);
        setValue('phone', restData.phone.toString());
        setImageName(restData.photo);
    }


    function doUpload(){
        setLoading(true);
        const formData = new FormData();
        formData.append("file", imgUpload);

        api.post('/uploadProfileImage', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((restResponse) => {
            showNotification(restResponse.data.message, 2);
            setImageName(restResponse.data.fileName);
            setUserInfo({
                ...user,
                photo: restResponse.data.fileName
            });
        }).catch((errorResp) => {
            showNotification(errorResp.response.data.message, errorResp.response.data.code);
        });
        setLoading(false);
    }

    return (
        <div className="absolute w-full h-full flex flex-col">
            <div className="flex flex-col min-w-full min-h-full">
                <div className="p-8 h-full">
                    <Header />
                    <div className="mt-4 h-full">
                        <h1 className="text-zinc-800 font-poppins text-lg">Information Of {user.nome}</h1>
                        <form className="flex flex-col mt-4" onSubmit={handleSubmit(submitProfile)}>
                            <div className="flex justify-between lg:space-x-2 lg:space-y-0 space-y-2 flex-col lg:flex-row">
                                <div className="w-full flex flex-col space-y-2">
                                    <div className="bg-slate-100 p-2 rounded">
                                        <div className="flex space-x-2">
                                            <label className="font-poppins text-zinc-700">Name</label>
                                            <input type="text" className="w-full bg-transparent outline-none" placeholder="A Nice Name" {...register('nome')} />
                                        </div>
                                        { errors.nome ? <p className="text-red-600 font-poppins mt-0.5">{errors.nome.message}</p> : null }
                                    </div>
                                    <div className="bg-slate-100 p-2 rounded">
                                        <div className="flex space-x-2">
                                            <label className="font-poppins text-zinc-700">Email</label>
                                            <input type="text" className="w-full bg-transparent outline-none" placeholder="test@example-com" {...register('email')} />
                                        </div>
                                        { errors.email ? <p className="text-red-600 font-poppins mt-0.5">{errors.email.message}</p> : null }
                                    </div>
                                </div>
                                <div className="w-full flex flex-col space-y-2">
                                    <div className="bg-slate-100 p-2 rounded">
                                        <div className="flex space-x-2">
                                            <label className="font-poppins text-zinc-700">NIF</label>
                                            <input type="text" className="w-full bg-transparent outline-none" placeholder="999999999" {...register('nif')} />
                                        </div>
                                        { errors.nif ? <p className="text-red-600 font-poppins mt-0.5">{errors.nif.message}</p> : null }
                                    </div>
                                    <div className="bg-slate-100 p-2 rounded">
                                        <div className="flex space-x-2">
                                            <label className="font-poppins w-36 text-zinc-700">Phone Number</label>
                                            <input type="text" className="w-full bg-transparent outline-none" placeholder="985422489" {...register('phone')} />
                                        </div>
                                        { errors.phone ? <p className="text-red-600 font-poppins mt-0.5">{errors.phone.message}</p> : null }
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex justify-end mt-4 space-x-2">
                                <button className="p-2 rounded bg-emerald-600 hover:bg-emerald-700 flex items-center space-x-1" type="submit">
                                    <FaRegSave className="w-6 h-6 text-white" />
                                    <p className="font-poppins text-white font-semibold">Salvar</p>
                                </button>
                            </div>
                        </form>
                        <h1 className="text-zinc-800 font-poppins text-lg">Profile Photo</h1>
                        <img src={IMAGES_SERVER + imageName} className="h-40 mt-2 rounded" title={user.nome} alt={user.nome} />
                        <input
                            type="file"
                            className="mt-4"
                            onChange={(e) => { setImageUpload(e.target.files[0]); }}
                        />
                        <button className="p-2 rounded bg-emerald-600 hover:bg-emerald-700 flex items-center space-x-1 mt-2" onClick={() => { doUpload(); }}>
                            <MdAddPhotoAlternate className="w-6 h-6 text-white" />
                            <p className="font-poppins text-white font-semibold">Mudar</p>
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}