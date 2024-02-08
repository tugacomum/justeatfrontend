import { useEffect, useState } from "react";
import Header from "../../Components/Header";
import api from "../../services/api";
import { FaPencilAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ListPermissions(){
    const [allUsers, setAllUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        function getAllUserList(){
            api.get('/users').then((usersData) => {
                setAllUsers(usersData.data);
            });
        }
        getAllUserList();
    }, []);

    return (
        <div className="absolute w-full h-full flex flex-col">
            <div className="flex flex-col min-w-full min-h-full p-8">
                <Header />
                <div className="mt-6">
                    <div className="flex items-center justify-between">
                        <h1 className="font-poppins text-zinc-800 text-xl font-semibold">List of Users</h1>
                    </div>
                    <table className="w-full mt-8">
                        <thead>
                            <tr>
                                <td className="border border-zinc-300 p-2">Name</td>
                                <td className="border border-zinc-300 p-2">Email</td>
                                <td className="border border-zinc-300 p-2">Contato</td>
                                <td className="border border-zinc-300 p-2">Role</td>
                                <td className="border border-zinc-300 p-2">Entity</td>
                                <td className="border border-zinc-300 p-2">Actions</td>
                            </tr>
                        </thead>
                        <tbody>
                            { allUsers.map((usersData) => {
                                return (
                                    <tr key={usersData._id}>
                                        <td className="text-center border border-zinc-300 p-2">{usersData.nome}</td>
                                        <td className="text-center border border-zinc-300 p-2">{usersData.email}</td>
                                        <td className="text-center border border-zinc-300 p-2">{usersData.phone}</td>
                                        <td className="text-center border border-zinc-300 p-2">{usersData.role}</td>
                                        <td className="text-center border border-zinc-300 p-2">{usersData.entity}</td>
                                        <td className="border border-zinc-300 p-2">
                                            <div className="w-full flex justify-center">
                                                <div className="bg-emerald-500 p-2 rounded w-fit flex items-center space-x-2 hover:bg-500-600 hover:cursor-pointer" onClick={() => { navigate("/admin/permission/" + usersData._id); }}>
                                                    <FaPencilAlt className="w-6 h-6 text-white" />
                                                    <p className="text-white font-poppins">Edit</p>
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
    );
}