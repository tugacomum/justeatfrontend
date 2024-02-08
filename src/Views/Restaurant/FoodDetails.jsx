import Header from "../../Components/Header";
import { FaRegSave } from "react-icons/fa";
import { MdAddPhotoAlternate } from "react-icons/md";
import Footer from "../../Components/Footer";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../services/api";
import { IMAGES_SERVER } from "../../services/env";
import { useUtils } from "../../Contexts/Utils";
import { useNavigate, useParams } from "react-router-dom";

const submitFoodForm = z.object({
    name: z.string().min(1, 'The name is required!'),
    price: z.string().min(1, 'The Price is required!'),
    alergy: z.string().nullable(),
    description: z.string().min(8, 'A small description is required!')
});

export default function FoodDetail(){
    const navigate = useNavigate();
    const { showNotification, setLoading } = useUtils();
    let { foodId } = useParams();

    const [imgUpload, setImageUpload] = useState();
    const [foodMetadata, setFoodMetadata] = useState({
        image: '',
        name: ''
    });

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(submitFoodForm),
        mode: 'onChange'
    });

    function submitFood(foodData){
        if(foodId !== "new"){
            api.patch('/updateFood/' + foodId, foodData).then((restResponse) => {
                showNotification(restResponse.data.message, 2);
            }).catch((errorResp) => {
                showNotification(errorResp.response.data.message, errorResp.response.data.code);
            })
        }else{
            if(!imgUpload){
                showNotification("Food Image is required!", 1);
            }else{
                api.post('/createFood', foodData).then((restResponse) => {
                    showNotification(restResponse.data.message, 2);
                    const foodId = restResponse.data.foodId;
                    doUpload(foodId);
                }).catch((errorResp) => {
                    showNotification(errorResp.response.data.message, errorResp.response.data.code);
                    navigate("/restaurant/foods");
                })
            }
        }
    }

    useEffect(() => {
        async function loadFood(){
            api.get('/food/' + foodId).then((foodData) => {
                const restData = foodData.data;
                loadData(restData);
            }).catch((errorResp) => {
                showNotification(errorResp.response.data.message, errorResp.response.data.code);
            })
        }
        if(foodId !== "new"){
            loadFood();
        }
    }, []);

    function loadData(restData){
        setValue('name', restData.name);
        setValue('price', restData.price);
        setValue('alergy', restData.alergy);
        setValue('description', restData.description);

        setFoodMetadata({
            image: restData.photo,
            name: restData.name
        });
    }

    function doUpload(from){
        setLoading(true);
        const path = from === "auto" && foodId !== "new" ? foodId : from;
        const formData = new FormData();
        formData.append("file", imgUpload);

        api.post('/foodImageUpload/' + path, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((restResponse) => {
            showNotification(restResponse.data.message, 2);
            setFoodMetadata({
                ...foodMetadata,
                image: restResponse.data.fileName
            })
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
                        <h1 className="text-zinc-800 font-poppins text-lg">Food Details</h1>
                        <form className="flex flex-col mt-4" onSubmit={handleSubmit(submitFood)}>
                            <div className="flex justify-between lg:space-x-2 lg:space-y-0 space-y-2 flex-col lg:flex-row">
                                <div className="w-full flex flex-col space-y-2">
                                    <div className="bg-slate-100 p-2 rounded">
                                        <div className="flex space-x-2">
                                            <label className="font-poppins text-zinc-700">Name</label>
                                            <input type="text" className="w-full bg-transparent outline-none" placeholder="A Nice Food" {...register('name')} />
                                        </div>
                                        { errors.name ? <p className="text-red-600 font-poppins mt-0.5">{errors.name.message}</p> : null }
                                    </div>
                                    <div className="bg-slate-100 p-2 rounded">
                                        <div className="flex space-x-2">
                                            <label className="font-poppins text-zinc-700">Price</label>
                                            <input type="text" className="w-full bg-transparent outline-none" placeholder="0,20" {...register('price')} />
                                        </div>
                                        { errors.price ? <p className="text-red-600 font-poppins mt-0.5">{errors.price.message}</p> : null }
                                    </div>
                                </div>
                                <div className="w-full flex flex-col space-y-2">
                                    <div className="bg-slate-100 p-2 rounded">
                                        <div className="flex space-x-2">
                                            <label className="font-poppins text-zinc-700">Alergy</label>
                                            <input type="text" className="w-full bg-transparent outline-none" placeholder="Alergy Text" {...register('alergy')} />
                                        </div>
                                        { errors.alergy ? <p className="text-red-600 font-poppins mt-0.5">{errors.alergy.message}</p> : null }
                                    </div>
                                    <div className="bg-slate-100 p-2 rounded">
                                        <div className="flex space-x-2">
                                            <label className="font-poppins w-36 text-zinc-700">Description</label>
                                            <input type="text" className="w-full bg-transparent outline-none" placeholder="An Nice Description" {...register('description')} />
                                        </div>
                                        { errors.description ? <p className="text-red-600 font-poppins mt-0.5">{errors.description.message}</p> : null }
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex justify-end mt-4 space-x-2">
                                <button className="p-2 rounded bg-emerald-600 hover:bg-emerald-700 flex items-center space-x-1" type="submit">
                                    <FaRegSave className="w-6 h-6 text-white" />
                                    <p className="font-poppins text-white font-semibold">Save</p>
                                </button>
                            </div>
                        </form>
                        <h1 className="text-zinc-800 font-poppins text-lg">Food Photo</h1>
                        <img src={IMAGES_SERVER + foodMetadata.image} className="h-40 mt-2 rounded" title={foodMetadata.name} alt={foodMetadata.name} />
                        <input
                            type="file"
                            className="mt-4"
                            onChange={(e) => { setImageUpload(e.target.files[0]); }}
                        />
                        <button className="p-2 rounded bg-emerald-600 hover:bg-emerald-700 flex items-center space-x-1 mt-2" onClick={() => { doUpload("auto"); }}>
                            <MdAddPhotoAlternate className="w-6 h-6 text-white" />
                            <p className="font-poppins text-white font-semibold">Change</p>
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}