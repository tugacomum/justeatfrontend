import { Fragment, useEffect, useState } from "react";
import Header from "../../Components/Header";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { IoIosAddCircle, IoMdClose } from "react-icons/io";
import { FaPencilAlt } from "react-icons/fa";

export default function Addresses(){
    const [addresses, setAddresses] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        async function loadAddresses(){
            const addressesData = await api.get('/addresses');
            setAddresses(addressesData.data);
        }

        loadAddresses();
    }, []);

    async function deleteAddress(addressId){
        if(confirm("Are you sure you want to delete this address?")){
            await api.delete('/deleteAddress?addressId=' + addressId);
            setAddresses(addresses.filter((lastAddresses) => { return lastAddresses._id !== addressId; }));
        }
    }

    return (
        <div className="absolute w-full h-full flex flex-col">
            <div className="flex flex-col min-w-full min-h-full p-8">
                <Header />
                <div className="mt-8">
                    <div className="flex items-center justify-between">
                        <h1 className="font-poppins text-zinc-800 text-xl font-semibold">My Addresses</h1>
                        <div className="hover:cursor-pointer group" title="Add Address" onClick={() => { navigate('/address/new'); }}>
                            <IoIosAddCircle className="w-10 h-10 text-emerald-600 group-hover:text-emerald-700" />
                        </div>
                    </div>
                    <table className="w-full mt-8">
                        <thead>
                            <tr>
                                <td className="border border-zinc-300 p-2">Address Line 1</td>
                                <td className="border border-zinc-300 p-2">Address Line 2</td>
                                <td className="border border-zinc-300 p-2">Actions</td>
                            </tr>
                        </thead>
                        <tbody>
                            { addresses.length > 0 ? <Fragment>
                            { addresses.map((addressesData) => {
                                return (
                                    <tr key={addressesData._id}>
                                        <td className="text-center border border-zinc-300 p-2">{addressesData.addressLineOne}</td>
                                        <td className="text-center border border-zinc-300 p-2">{addressesData.addressLineTwo}</td>
                                        <td className="border border-zinc-300 p-2">
                                            <div className="w-full flex space-x-4 justify-center">
                                                <div className="bg-red-500 p-2 rounded w-fit flex items-center space-x-2 hover:bg-red-600 hover:cursor-pointer" onClick={() => { deleteAddress(addressesData._id); }}>
                                                    <IoMdClose className="w-6 h-6 text-white" />
                                                    <p className="text-white font-poppins">Delete</p>
                                                </div>
                                                <div className="bg-emerald-500 p-2 rounded w-fit flex items-center space-x-2 hover:bg-500-600 hover:cursor-pointer" onClick={() => { navigate("/address/" + addressesData._id); }}>
                                                    <FaPencilAlt className="w-6 h-6 text-white" />
                                                    <p className="text-white font-poppins">Edit</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) }
                            </Fragment> : 
                                <tr className="text-center">
                                    <td colSpan={3} className="border border-zinc-300 p-2">No Addresses!</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}