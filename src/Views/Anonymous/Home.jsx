
import { useEffect  } from "react";


import Header from "../../Components/Header";
import Restaurants from "../../Components/Restaurants";
import Footer from "../../Components/Footer";


import { useUser } from "../../Contexts/User";




export default function Home(){
    const {  getUserInfo } = useUser();
    
    useEffect(() => {
        getUserInfo();
    }, []);

    return (
        <div className="flex flex-col absolute w-full h-full">
                <div className="p-8 flex flex-col"><Header /></div>
                <div className="flex-1"><Restaurants /></div>
            <Footer />
        </div>
    );
}