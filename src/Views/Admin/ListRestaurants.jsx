import { useEffect, useState } from "react";
import Header from "../../Components/Header";
import RestaurantCard from "../../Components/RestaurantCard";

import { IoIosAddCircle } from "react-icons/io";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function ListRestaurants(){
    const navigate = useNavigate();
    const [allRestaurants, setAllRestaurants] = useState([]);

    useEffect(() => {
        function getAllRestaurants(){
            api.get('/allRestaurants').then((restaurantsData) => {
                setAllRestaurants(restaurantsData.data);
            });
        }
        getAllRestaurants();
    }, []);

    return (
        <div className="absolute w-full h-full flex flex-col">
            <div className="flex flex-col min-w-full min-h-full p-8">
                <Header />
                <div className="mt-6">
                    <div className="flex items-center justify-between">
                        <h1 className="font-poppins text-zinc-800 text-xl font-semibold">List of Restaurants</h1>
                        <div className="hover:cursor-pointer group" title="Add Restaurant" onClick={() => { navigate("/admin/restaurant/new"); }}>
                            <IoIosAddCircle className="w-10 h-10 text-emerald-600 group-hover:text-emerald-700" />
                        </div>
                    </div>
                    <div className="mt-4 grid lg:grid-cols-5 gap-4">
                        { allRestaurants.map((restaurant) => {
                            return (<RestaurantCard key={restaurant._id} restaurant={restaurant} fromAdmin={true} />);
                        }) }
                    </div>
                </div>
            </div>
        </div>
    );
}