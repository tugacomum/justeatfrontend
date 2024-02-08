import { IoIosAddCircle, IoMdClose } from "react-icons/io";
import Header from "../../Components/Header";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { FaPencilAlt } from "react-icons/fa";
import { IMAGES_SERVER } from "../../services/env";
import { useUtils } from "../../Contexts/Utils";

export default function Foods(){
    const [foods, setFoods] = useState([]);

    const { showNotification } = useUtils();
    const navigate = useNavigate();
    
    useEffect(() => {
        async function GetListAllFoods(){
            api.get('/foods').then((foodsList) => {
                setFoods(foodsList.data);
            })
        }
        
        GetListAllFoods();
    }, []);

    function deleteFood(foodId){
        if(confirm("Are you sure you want to delete this food?")){
            api.delete('/food/' + foodId).then((restResponse) => {
                showNotification(restResponse.data.message, restResponse.data.code);
                setFoods(foods.filter((lastFoods) => { return lastFoods._id !== foodId; }));
            }).catch((errorResp) => {
                showNotification(errorResp.response.data.message, errorResp.response.data.code);
            })
        }
    }

    return (
        <div className="absolute w-full h-full flex flex-col">
            <div className="flex flex-col min-w-full min-h-full">
                <div className="p-8 h-full">
                    <Header />
                    <div className="mt-6">
                    <div className="flex items-center justify-between">
                        <h1 className="font-poppins text-zinc-800 text-xl font-semibold">List of Foods</h1>
                        <div className="hover:cursor-pointer group" title="Add Food" onClick={() => { navigate("/restaurant/food/new"); }}>
                            <IoIosAddCircle className="w-10 h-10 text-emerald-600 group-hover:text-emerald-700" />
                        </div>
                    </div>
                    <table className="w-full mt-8">
                        <thead>
                            <tr>
                                <td className="border border-zinc-300 p-2">Imagem</td>
                                <td className="border border-zinc-300 p-2">Name</td>
                                <td className="border border-zinc-300 p-2">Price</td>
                                <td className="border border-zinc-300 p-2">Description</td>
                                <td className="border border-zinc-300 p-2">Actions</td>
                            </tr>
                        </thead>
                        <tbody>
                            { foods.map((foodData) => {
                                return (
                                    <tr key={foodData._id}>
                                        <td className="text-center border border-zinc-300 p-2"><img src={IMAGES_SERVER + foodData.photo} className="w-28" title={foodData.name} alt={foodData.name} /></td>
                                        <td className="text-center border border-zinc-300 p-2">{foodData.name}</td>
                                        <td className="text-center border border-zinc-300 p-2">{parseFloat(foodData.price).toFixed(2).replace(".", ",") + " €"}</td>
                                        <td className="text-center border border-zinc-300 p-2">{foodData.description}</td>
                                        <td className="border border-zinc-300 p-2">
                                            <div className="w-full flex justify-center space-x-4">
                                                <div className="bg-emerald-500 p-2 rounded w-fit flex items-center space-x-2 hover:bg-500-600 hover:cursor-pointer" onClick={() => { navigate("/restaurant/food/" + foodData._id); }}>
                                                    <FaPencilAlt className="w-6 h-6 text-white" />
                                                    <p className="text-white font-poppins">Edit</p>
                                                </div>
                                                <div className="bg-red-500 p-2 rounded w-fit flex items-center space-x-2 hover:bg-red-600 hover:cursor-pointer" onClick={() => { deleteFood(foodData._id); }}>
                                                    <IoMdClose className="w-6 h-6 text-white" />
                                                    <p className="text-white font-poppins">Apagar</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) }
                        </tbody>
                    </table>
                </div>
                </div>
            </div>
        </div>
    );
}