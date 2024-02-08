import { IoCloseSharp } from "react-icons/io5";
import CartItem from "./CartItem";
import { Fragment, useEffect, useState } from "react";
import api from "../services/api";
import { useUser } from "../Contexts/User";
import { useUtils } from "../Contexts/Utils";
import { useNavigate } from "react-router-dom";

export default function CartOverview(props){
    const { showNotification } = useUtils();
    const { setUserCart, userCart } = useUser();
    const [localItemsUser, setLocalItemsUser] = useState([]);
    const [addressesList, setAddressesList] = useState([]);
    const [cartStep, setCartStep] = useState(0);
    const navigate = useNavigate();

    const [formEndCart, setFormEndCart] = useState({
        paymethod: "MBWay",
        address: "default",
        observations: ""
    });

    async function loadItem(itemId){
        try{
            const food = (await api.get('/food/' + itemId)).data;
            return food;
        }catch(err){
            showNotification("An error occurred getting food data!", 0);
        }
    }

    async function handleRemoveItem(renderId){
        const allCarts = userCart.filter(item => item.renderId !== renderId);
        localStorage.setItem("@justeat/cart", JSON.stringify(allCarts));
        setUserCart(allCarts);
    }

    useEffect(() => {
        if(cartStep === 1){
            loadAddresses();
        }
        async function loadAddresses(){
            if(localStorage.getItem("@justeat/isEditing")){
                api.get('/addresses/' + localStorage.getItem("@justeat/userId")).then((respAddress) => {
                    setAddressesList(respAddress.data);
                }).catch((err) => {
                    showNotification(err.reponse.data.message, err.reponse.data.code);
                });
            }else{
                api.get('/addresses').then((respAddress) => {
                    setAddressesList(respAddress.data);
                }).catch((err) => {
                    showNotification(err.reponse.data.message, err.reponse.data.code);
                });
            }
        }    
    }, [cartStep]);

    useEffect(() => {
        async function loadCart() {
            const localCache = [];
        
            for (const cartItem of userCart) {
                const foodAlreadyExists = localCache.find((alreadyExists) => alreadyExists.foodId === cartItem.foodId);

                if (foodAlreadyExists) {
                    const updatedFood = { ...foodAlreadyExists, renderId: cartItem.renderId };
                    localCache.push(updatedFood);
                } else {
                    const apiFood = await loadItem(cartItem.foodId);
                    cartItem.food = apiFood;
                    localCache.push(cartItem);
                }
            }
            setLocalItemsUser(localCache);
        }
        loadCart();
    }, [userCart]);

    function calculatePriceToPay(){
        return localItemsUser.reduce((total, product) => {
            return total + parseFloat(product.food.price);
        }, 0);
    }

    function handleChangeForm(e){
        setFormEndCart({
            ...formEndCart,
            [e.target.name]: e.target.value
        });
    }

    
    useEffect(() => {
        async function preloadCart(cartId){
            api.get('/cartMetadata/' + cartId).then(async (cartData) => {
                setFormEndCart({
                    paymethod: cartData.data.paymentMethod,
                    address: cartData.data.deliveryAddress,
                    observations: cartData.data.observations
                });
            });
        }
        if(localStorage.getItem("@justeat/isEditing")){
            preloadCart(localStorage.getItem("@justeat/isEditing"));
        }
    }, []);

    function submitCart(e){
        e.preventDefault();

        if(formEndCart.address === "default"){
            showNotification("Please select an valid address!", 1);
        }else{
            const simpleFoodList = localItemsUser.map((foodData) => {
                return {id: foodData.food._id};
            });

            if(localStorage.getItem("@justeat/isEditing")){	
                api.put('/updateCart/' + localStorage.getItem("@justeat/isEditing"), {
                    paymethod: formEndCart.paymethod,
                    address: formEndCart.address,
                    observations: formEndCart.observations,
                    foods: simpleFoodList,
                }).then((respCart) => {
                    setCartStep(2);
                    showNotification(respCart.data.message, respCart.data.code);
                    localStorage.removeItem("@justeat/cart");
                    localStorage.removeItem("@justeat/isEditing");
                    localStorage.removeItem("@justeat/userId");
                    setUserCart([]);
                    navigate("/admin/orders");
                }).catch((err) => {
                    showNotification(err.reponse.data.message, err.reponse.data.code);
                });
            }else{
                api.post('/createCart', {
                    paymethod: formEndCart.paymethod,
                    address: formEndCart.address,
                    observations: formEndCart.observations,
                    foods: simpleFoodList,
                    restaurantId: localItemsUser[0].food.restaurant
                }).then((respCart) => {
                    setCartStep(2);
                    showNotification(respCart.data.message, respCart.data.code);
                    localStorage.removeItem("@justeat/cart");
                    setUserCart([]);
                }).catch((err) => {
                    showNotification(err.reponse.data.message, err.reponse.data.code);
                });
            }
        }
    }

    return (
        <div className="w-1/4 fixed right-0 h-full z-10 bg-white shadow flex flex-col">
            <div className="px-6 pt-6 flex items-center justify-between">
                <div>
                    <h1 className="font-poppins text-2xl text-[#8C52FF] font-semibold">Cart</h1>
                    <p className="font-poppins text-zinc-800">{ cartStep === 0 ? 'See your cart bellow' : (cartStep === 1 ? "Let's finalize your cart" : "Your food is on their way!")}</p>
                </div>
                <div className="hover:cursor-pointer" onClick={() => { props.closeCart(false); }}>
                    <IoCloseSharp className="w-10 h-10 text-zinc-800" />
                </div>
            </div>
            { cartStep === 0 ? <Fragment>
            { localItemsUser.length > 0 ? <div className="flex space-y-10 flex-col overflow-x-auto h-full p-6 mt-4">
                { localItemsUser.map((cartFoodLine) => {
                    return (<CartItem key={cartFoodLine.renderId} cartFood={cartFoodLine.food} handleRemoveItem={() => { handleRemoveItem(cartFoodLine.renderId); }} />);
                }) }
            </div> : null }
            <div className="p-6">
                <p className="text-zinc-700 mb-1">Total: <strong>{calculatePriceToPay().toFixed(2).replace(".", ",")} €</strong></p>
                <button title="Next Step" onClick={() => { setCartStep(1); }} className="bg-[#8C52FF] hover:bg-[#7e48e8] rounded hover:cursor-pointer p-3 text-white w-full font-poppins font-normal">Next Step</button>
            </div>
            </Fragment> : (cartStep === 1 ?
            <div className="p-6">
                <p className="text-zinc-700 mb-1">Total: <strong>{calculatePriceToPay().toFixed(2).replace(".", ",")} €</strong></p>
                <form className="mt-4 flex flex-col space-y-4" onSubmit={submitCart}>
                    <div className="flex flex-col">
                        <p>Address:</p>
                        <select className="bg-zinc-100 p-1 mt-0.5 rounded outline-none" name="address" value={formEndCart.address} onChange={handleChangeForm}>
                            <option value="default">--- Select an address ---</option>
                            { addressesList.map((address) => {
                                return (
                                    <option key={address._id} value={address._id}>{address.addressLineOne + " " + address.addressLineTwo}</option>
                                );
                            }) }
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <p>Payment Method:</p>
                        <select className="bg-zinc-100 p-1 mt-0.5 rounded outline-none" name="paymethod" value={formEndCart.paymethod} onChange={handleChangeForm}>
                            <option value="MBWay">MBWay</option>
                            <option value="Google Pay">Google Pay</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <p>Observations:</p>
                        <textarea className="bg-zinc-100 h-24 p-1 mt-0.5 rounded outline-none" name="observations" value={formEndCart.observations} onChange={handleChangeForm} />
                    </div>
                    <button title="Bring Me My Food" type="submit" className="bg-[#8C52FF] hover:bg-[#7e48e8] rounded hover:cursor-pointer p-3 text-white w-full font-poppins font-normal">Bring Me My Food</button>
                </form>
            </div> : <div className="p-6 h-full w-full flex flex-col items-center justify-center">
                <img src="/bike.svg" className="w-52 h-52" title="Your food will arrive soon!" />
                <p className="text-lg font-poppins text-zinc-700">Your food will arrive soon!</p>
            </div> ) }
        </div>
    );
}