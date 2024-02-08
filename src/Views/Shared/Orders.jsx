import { Fragment, useEffect, useState } from "react";
import Header from "../../Components/Header";
import { useUser } from "../../Contexts/User";
import api from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { FaCheck, FaPencilAlt } from "react-icons/fa";
import { useUtils } from "../../Contexts/Utils";

export default function Orders(){
    const { user, setUserCart } = useUser();
    const { showNotification } = useUtils();
    const [carts, setCarts] = useState([]);
    const [cartsFiltered, setCartsFiltered] = useState([]);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function loadCarts(){
            if(user.role === "user"){
                const cartData = await api.get('/GetAllCartFromUser');
                setCarts(cartData.data);
            }else if(user.role === "manager"){
                const cartData = await api.get('/GetAllCartFromRestaurant');
                setCarts(cartData.data);
            }else if(user.role === "admin"){
                const cartData = await api.get('/GetAllCarts');
                setCarts(cartData.data);
            }
        }

        loadCarts();
    }, [user]);

    async function approveCart(cartId){
        const newState = carts.map(obj => {
            if (obj._id === cartId) {
              return {...obj, status: "APPROVED"};
            }
            return obj;
        });
        
        setCarts(newState);

        await api.patch('/updateCartStatus/' + cartId, {
            "status": "APPROVED"
        }).then((resp) => {
            showNotification(resp.data.message, resp.data.code);
        }).catch((err) => {
            showNotification(err.response.data.message, err.response.data.code);
        })
    }

    async function rejectCart(cartId) {
        if(confirm('Are you sure you want to reject this cart?')) {
            let rejectStatus = "REJECTED";
            if(user.role === "user"){
                rejectStatus = "CANCELLED";
            }

            const newState = carts.map(obj => {
                if (obj._id === cartId) {
                  return {...obj, status: rejectStatus};
                }
                return obj;
            });
            
            setCarts(newState);

            await api.patch('/updateCartStatus/' + cartId, {
                "status": rejectStatus
            }).then((resp) => {
                showNotification(resp.data.message, resp.data.code);
            }).catch((err) => {
                showNotification(err.response.data.message, err.response.data.code);
            })
        }
    }

    function startEditCart(restaurantId, foodList, cartId, userId){
        const editCart = [];
        foodList.forEach((itemsList) => {
            editCart.push({
                renderId: Math.random().toString(16).slice(2),
                foodId: itemsList.productId
            });
        });
        setUserCart(editCart);
        localStorage.setItem("@justeat/cart", JSON.stringify(editCart));
        localStorage.setItem("@justeat/isEditing", cartId);
        localStorage.setItem("@justeat/userId", userId);
        navigate('/restaurant/' + restaurantId);
    }

    useEffect(() => {
        const filteredText = carts.filter((cartInfo) => cartInfo.name.toLowerCase().includes(searchText.toLowerCase()));
        setCartsFiltered(filteredText);
    }, [searchText, carts]);

    return (
        <div className="absolute w-full h-full flex flex-col">
            <div className="flex flex-col min-w-full min-h-full p-8">
                <Header />
                <div className="mt-8">
                    <h1 className="font-poppins text-zinc-700 text-2xl">{ user.role === "user" || user.role === "manager" ? 'My Orders' : 'All Orders' }</h1>
                    { user.role === "admin" ? <input type="text" placeholder="Search for a Restaurant" className="p-2 border w-full mt-2 outline-none" value={searchText} onChange={(e) => { setSearchText(e.target.value); }} /> : null }
                    <table className="w-full mt-8">
                        <thead>
                            <tr>
                                { user.role !== "user" ? <td className="border border-zinc-300 p-2">Cliente</td> : null }
                                { user.role !== "manager" ? <td className="border border-zinc-300 p-2">Restaurant</td> : null }
                                <td className="border border-zinc-300 p-2">Timestamp</td>
                                <td className="border border-zinc-300 p-2">Price</td>
                                <td className="border border-zinc-300 p-2">Observations</td>
                                <td className="border border-zinc-300 p-2">Address</td>
                                { user.role !== "manager" ? <td className="border border-zinc-300 p-2">Pay Method</td> : null }
                                <td className="border border-zinc-300 p-2">State</td>
                                <td className="border border-zinc-300 p-2">Items</td>
                                <td className="border border-zinc-300 p-2">Actions</td>
                            </tr>
                        </thead>
                        <tbody>
                            { cartsFiltered.length > 0 ? <Fragment>
                            { cartsFiltered.map((cartData) => {
                                return (
                                    <tr key={cartData._id}>
                                        { user.role !== "user" ? <td className="text-center border border-zinc-300 p-2">{cartData.usersData.nome}</td> : null }
                                        { user.role !== "manager" ? <td className="text-center border border-zinc-300 p-2"><Link to={"/restaurant/" + cartData.id} className="underline">{cartData.name}</Link></td> : null }
                                        <td className="text-center border border-zinc-300 p-2">{new Date(cartData.date).toLocaleString('pt-PT')}</td>
                                        <td className="text-center border border-zinc-300 p-2">{parseFloat(cartData.price).toFixed(2).replace(".", ",") + " €"}</td>
                                        <td className="text-center border border-zinc-300 p-2">{cartData.observations}</td>
                                        <td className="text-center border border-zinc-300 p-2">{cartData.addressData.addressLineOne + " " + cartData.addressData.addressLineTwo}</td>
                                        { user.role !== "manager" ? <td className="text-center border border-zinc-300 p-2">{cartData.paymentMethod}</td> : null }
                                        <td className="text-center border border-zinc-300 p-2">{cartData.status}</td>
                                        <td className="border border-zinc-300 p-2"><ul className="list-disc ml-6">{cartData.allItems.map((itemsList) => { return (<li key={itemsList._id}>{itemsList.productInfo.name}<ul className="list-disc ml-4"><li>{itemsList.observations}</li></ul></li>); })}</ul></td>
                                        <td className="border border-zinc-300 p-2">
                                            <div className="w-full flex justify-center space-x-4">
                                                { cartData.status === "PENDING" ? <div className="bg-red-500 p-2 rounded w-fit flex items-center space-x-2 hover:bg-red-600 hover:cursor-pointer" onClick={() => { rejectCart(cartData._id); }}>
                                                    <IoMdClose className="w-6 h-6 text-white" />
                                                    <p className="text-white font-poppins">Reject</p>
                                                </div> : null }
                                                { user.role !== "user" && cartData.status === "PENDING" ? <div className="bg-emerald-500 p-2 rounded w-fit flex items-center space-x-2 hover:bg-emerald-600 hover:cursor-pointer" onClick={() => { approveCart(cartData._id); }}>
                                                    <FaCheck className="w-6 h-6 text-white" />
                                                    <p className="text-white font-poppins">Accept</p>
                                                </div> : null }
                                                { user.role === "admin" && cartData.status === "PENDING" ? <div className="bg-emerald-500 p-2 rounded w-fit flex items-center space-x-2 hover:bg-500-600 hover:cursor-pointer" onClick={() => { startEditCart(cartData.id, cartData.allItems, cartData._id, cartData.usersData._id); }}>
                                                    <FaPencilAlt className="w-6 h-6 text-white" />
                                                    <p className="text-white font-poppins">Edit</p>
                                                </div> : null }
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) }
                            </Fragment> :
                            <tr className="text-center">
                                <td colSpan={10} className="border border-zinc-300 p-2">No orders!</td>
                            </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}