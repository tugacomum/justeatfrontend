import { Fragment, useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import api from "../services/api";
import { useUtils } from "../Contexts/Utils";

export default function Restaurants(){
    const [listRestaurants, setListRestaurants] = useState([]);
    const [listRestaurantsFiltered, setListRestaurantsFiltered] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [showGeoError, setShowGeoError] = useState(true);
    const { showNotification } = useUtils();

    useEffect(() => {
        async function loadRestaurants(){
            navigator.geolocation.getCurrentPosition((geoCords) => {
                api.get(`/restaurants?lat=${geoCords.coords.latitude}&long=${geoCords.coords.longitude}`).then((respRest) => {
                    setListRestaurants(respRest.data);
                    setListRestaurantsFiltered(respRest.data);
                }).catch((errorResp) => {
                    showNotification(errorResp.response.data.message, errorResp.response.data.code);
                })
                setShowGeoError(false);
            });
        }
        loadRestaurants();
    }, []);

    useEffect(() => {
        const filteredText = listRestaurants.filter((restaurantInfo) => {
            const lowerCaseName = restaurantInfo.name.toLowerCase();
            const lowerCaseaddressLineTwo = restaurantInfo.addressLineTwo.toLowerCase();
    
            return lowerCaseName.includes(searchText.toLowerCase()) ||
                   lowerCaseaddressLineTwo.includes(searchText.toLowerCase());
        });
    
        setListRestaurantsFiltered(filteredText);
    }, [searchText]);

    return (
        <div className="p-8" id="restaurants">
            <h1 className="font-poppins text-xl text-zinc-800">Restaurants</h1>
            { !showGeoError ? <Fragment>
                <input type="text" placeholder="Search for a Restaurant" className="p-2 border w-full mt-2 outline-none" value={searchText} onChange={(e) => { setSearchText(e.target.value); }} />
                { listRestaurantsFiltered.length > 0 ?
                <Fragment>
                
                <div className="mt-4 grid lg:grid-cols-5 gap-4">
                    { listRestaurantsFiltered.map((restaurant) => {
                        return (
                            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                        );
                    }) }
                </div></Fragment> :
                <div className="flex mt-8 flex-col items-center">
                    <img src="/notarrive.svg" className="w-[50rem]" title="Not Arrive" alt="Not Arrive" />
                    <p className="text-2xl mt-4 font-poppins text-zinc-700 font-semibold">We not arrive to your location!</p>
                </div>
                }
            </Fragment> :
            <div className="flex mt-8 flex-col items-center">
                <img src="/geo.svg" className="w-[50rem]" title="Not Arrive" alt="Not Arrive" />
                <p className="text-2xl mt-4 font-poppins text-zinc-700 font-semibold">Please allow us to access your location!</p>
            </div> }
        </div>
    );
}