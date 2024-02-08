import Header from "../../Components/Header";
import { FaRegSave } from "react-icons/fa";
import Footer from "../../Components/Footer";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useUtils } from "../../Contexts/Utils";
import { useNavigate, useParams } from "react-router-dom";

export default function PermissionDetail(){
    const { showNotification } = useUtils();
    let { userId } = useParams();
    const navigate = useNavigate();

    const [restaurantNames, setRestaurantNames] = useState([]);
    const [permissionMetadata, setPermissionMetadata] = useState({
        nome: "",
        role: "user",
        entityConnected: "default"
    });

    function submitPermission(e){
        e.preventDefault();

        if(permissionMetadata.role === "manager" && permissionMetadata.entityConnected === "default"){
            showNotification("You need to select an entity for a manager role!", 1);
        }else{
            api.patch('/updatePermissions/' + userId, permissionMetadata).then((restResponse) => {
                showNotification(restResponse.data.message, 2);
                navigate("/admin/permissions");
            }).catch((errorResp) => {
                showNotification(errorResp.response.data.message, errorResp.response.data.code);
            })
        }
    }

    useEffect(() => {
        async function loadPermission(){
            api.get('/permission?userId=' + userId).then((addressData) => {
                const restData = addressData.data;
                setPermissionMetadata({
                    role: restData.role,
                    entityConnected: restData.entityConnected,
                    nome: restData.nome
                });
            }).catch((err) => {
                showNotification(err.response.data.message, err.response.data.code);
                navigate("/admin/permissions");
            });

            api.get('/restaurantsName').then((names) => {
                setRestaurantNames(names.data);
            }).catch((err) => {
                showNotification(err.response.data.message, err.response.data.code);
            });
        }
        loadPermission();
    }, []);

    function updateField(e){
        setPermissionMetadata({
            ...permissionMetadata,
            [e.target.name]: e.target.value
        });
    }

    return (
        <div className="absolute w-full h-full flex flex-col">
            <div className="flex flex-col min-w-full min-h-full">
                <div className="p-8 h-full">
                    <Header />
                    <div className="mt-4 h-full">
                        <h1 className="text-zinc-800 font-poppins text-lg">Information Of {permissionMetadata.nome}</h1>
                        <form className="flex flex-col mt-4" onSubmit={submitPermission}>
                            <div className="flex justify-between lg:space-x-2 lg:space-y-0 space-y-2 flex-col lg:flex-row">
                                <div className="w-full flex flex-col space-y-2">
                                    <div className="bg-slate-100 p-2 rounded">
                                        <div className="flex space-x-2">
                                            <label className="w-36 font-poppins text-zinc-700">Role</label>
                                            <select value={permissionMetadata.role} onChange={updateField} name="role">
                                                <option value="user">User</option>
                                                <option value="manager">Manager</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                { permissionMetadata.role === "manager" ? <div className="w-full flex flex-col space-y-2">
                                    <div className="bg-slate-100 p-2 rounded">
                                        <div className="flex space-x-2">
                                            <label className="w-36 font-poppins text-zinc-700">Entity</label>
                                            <select name="entityConnected" value={permissionMetadata.entityConnected} onChange={updateField}>
                                                <option value="default">--- Select an Entity ---</option>
                                                { restaurantNames.map((restaurant) => {
                                                    return (
                                                        <option key={restaurant._id} value={restaurant._id}>{restaurant.name}</option>
                                                    );
                                                }) }
                                            </select>
                                        </div>
                                    </div>
                                </div> : null }
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