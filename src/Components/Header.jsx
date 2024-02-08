import { Link, useNavigate } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { IoMdClose, IoMdArrowDropdown, IoIosHome } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdAccountCircle } from "react-icons/md";
import { PiSignOut } from "react-icons/pi";
import { Fragment, useState } from "react";
import { useUser } from "../Contexts/User";
import { IMAGES_SERVER } from "../services/env";
import { useUtils } from "../Contexts/Utils";

export default function Header(props){
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const { user, makeLogout, userCart } = useUser();
    const { showNotification } = useUtils();

    function getUserSmallName(fullName){
        const listOfNames = fullName.split(" ");
        if(listOfNames.length === 0){
            return fullName;
        }else{
            return listOfNames[0] + " " + listOfNames[listOfNames.length - 1];
        }
    }

    function logout(){
        makeLogout();
        showNotification("Logout completed!", 2);
    }

    return (
        <Fragment>
            { isMobileMenuOpen ?
            <div className="w-1/2 h-full bg-zinc-200 border shadow fixed top-0 left-0 p-4 lg:hidden z-10">
                <div className="flex items-center justify-between">
                    <img src="/logo.svg" title="JustEat" alt="JustEat" className="w-32" onClick={()=>{ window.location.reload(); }}/>
                    <div className="hover:cursor-pointer" onClick={() => { setIsMobileMenuOpen(false); }}>
                        <IoMdClose className="w-8 h-8 text-zinc-700" />
                    </div>
                </div>
                <ul className="mt-8 space-y-2 text-lg font-poppins flex flex-col font-extralight">
                    { Object.keys(user).length > 0 ?
                        <>
                            { user.role === "user" ?
                            <>
                                <li><Link to="/" className="hover:underline">Restaurants</Link></li>
                                <li><Link to="/orders" className="hover:underline">My Orders</Link></li>
                                <li><Link to="/addresses" className="hover:underline">Addresses</Link></li>
                            </> : user.role === "manager" ?
                            <>
                                <li><Link to="/restaurant/orders" className="hover:underline">My Requests</Link></li>
                                <li><Link to="/restaurant/overview" className="hover:underline">My Restaurant</Link></li>
                                <li><Link to="/restaurant/foods" className="hover:underline">Foods</Link></li>
                            </> : user.role === "admin" ?
                            <>
                                <li><Link to="/admin/restaurants" className="hover:underline">Restaurants</Link></li>
                                <li><Link to="/admin/orders" className="hover:underline">Requests</Link></li>
                                <li><Link to="/admin/permissions" className="hover:underline">Permissions</Link></li>
                            </> : null }
                        </> :
                        <>
                            <li><Link to="/" className="hover:underline">Home</Link></li>
                            <li><a href="#restaurants" className="hover:underline">Restaurants</a></li>
                            <li><Link to="/help" className="hover:underline">Help</Link></li>
                            <li><Link to="/policys" className="hover:underline">Legal</Link></li>
                        </> }
                </ul>
                { user.role === "user" || localStorage.getItem("@justeat/isEditing") ? <div className="flex bg-slate-100 hover:bg-slate-200 hover:cursor-pointer p-2 items-center space-x-2 rounded w-fit mt-5" onClick={() => { props.openCart(true); }}>
                    <FaCartShopping className="w-6 h-6 text-[#8C52FF]" />
                    <p className="font-poppins text-[#8C52FF]">{userCart.length + " " +  (userCart.length === 1 ? "Item" : "Itens")}</p>
                </div> : null }
                <div className="flex flex-col font-poppins space-y-4 mt-8">
                    <Link to="/login" className="border-b-2 font-bold border-[#8C52FF] w-fit">Sign In</Link>
                    <Link to="/signup" className="bg-white shadow p-3 rounded-xl border flex items-center justify-center font-bold text-[#8C52FF]">Create Account</Link>
                </div>
            </div> : null }
            <div className="flex w-full justify-between">
                <div className="flex items-center">
                    <div className="flex items-center lg:space-x-0 space-x-4">
                        <div className="lg:hidden hover:cursor-pointer" onClick={() => { setIsMobileMenuOpen(true); }}>
                            <GiHamburgerMenu className="text-zinc-800 w-8 h-8" />
                        </div>
                        <img src="/logo.svg" title="JustEat" alt="JustEat" className="lg:w-52 w-32" onClick={()=>{ user.role === "user" ? navigate('/') : (user.role === "manager") ? navigate("/restaurant/overview") : navigate("/admin/restaurants") }}/>
                    </div>
                    <ul className="ml-24 space-x-8 text-lg font-poppins lg:flex hidden font-extralight">
                        { Object.keys(user).length > 0 ?
                        <>
                            { user.role === "user" ?
                            <>
                                <li><Link to="/" className="hover:underline">Restaurants</Link></li>
                                <li><Link to="/orders" className="hover:underline">My Orders</Link></li>
                                <li><Link to="/addresses" className="hover:underline">Addresses</Link></li>
                            </> : user.role === "manager" ?
                            <>
                                <li><Link to="/restaurant/orders" className="hover:underline">My Requests</Link></li>
                                <li><Link to="/restaurant/overview" className="hover:underline">My Restaurant</Link></li>
                                <li><Link to="/restaurant/foods" className="hover:underline">Foods</Link></li>
                            </> : user.role === "admin" ?
                            <>
                                <li><Link to="/admin/restaurants" className="hover:underline">Restaurants</Link></li>
                                <li><Link to="/admin/orders" className="hover:underline">Requests</Link></li>
                                <li><Link to="/admin/permissions" className="hover:underline">Permissions</Link></li>
                            </> : null }
                        </> :
                        <>
                            <li><Link to="/" className="hover:underline">Home</Link></li>
                            <li><Link to="/help" className="hover:underline">Help</Link></li>
                            <li><Link to="/policys" className="hover:underline">Legal</Link></li>
                        </> }
                    </ul>
                </div>
                <div className="lg:flex hidden font-poppins items-center space-x-8">
                    { Object.keys(user).length > 0 ?
                    <>
                        { user.role === "user" || localStorage.getItem("@justeat/isEditing") ? <div className="flex bg-slate-100 hover:bg-slate-200 hover:cursor-pointer p-2 items-center space-x-2 rounded" onClick={() => { props.openCart(true); }}>
                            <FaCartShopping className="w-6 h-6 text-[#8C52FF]" />
                            <p className="font-poppins text-[#8C52FF]">{userCart.length + " " +  (userCart.length === 1 ? "Item" : "Itens")}</p>
                        </div> : null }
                        <div className="flex items-center space-x-2 hover:cursor-pointer" onClick={() => { setShowProfileMenu(!showProfileMenu); }}>
                            <img src={IMAGES_SERVER + user.photo} className="w-10" />
                            <p>{getUserSmallName(user.nome)}</p>
                            <div className="flex flex-col relative items-end">
                                <IoMdArrowDropdown className="w-8 h-8 text-zinc-700" />
                                { showProfileMenu ? <div className="shadow absolute mt-10 space-y-1 border flex flex-col rounded w-48 bg-white">
                                    <button className="flex items-center space-x-1 p-2 hover:bg-slate-100" onClick={() => { navigate('/profile'); }}>
                                        <MdAccountCircle className="w-6 h-6 text-zinc-700" />
                                        <p>Perfil</p>
                                    </button>
                                    { user.role === "user" ? <button className="flex items-center space-x-1 p-2 hover:bg-slate-100" onClick={() => { navigate('/addresses'); }}>
                                        <IoIosHome className="w-6 h-6 text-zinc-700" />
                                        <p>Endereços</p>
                                    </button> : null }
                                    <button className="flex items-center space-x-1 p-2 hover:bg-slate-100" onClick={() => { logout(); }}>
                                        <PiSignOut className="w-6 h-6 text-zinc-700" />
                                        <p>Terminar Sessão</p>
                                    </button>
                                </div> : null }
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <Link to="/login" className="border-b-2 font-bold border-[#8C52FF]">Sign In</Link>
                        <Link to="/signup" className="shadow p-3 rounded-xl border font-bold text-[#8C52FF]">Create Account</Link>
                    </> }
                </div>
            </div>
        </Fragment>
    );
}