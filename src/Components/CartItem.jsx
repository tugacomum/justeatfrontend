import { FaMinus } from "react-icons/fa";
import { IMAGES_SERVER } from "../services/env";

export default function CartItem(props){
    return (
        <div className="flex flex-col shadow border rounded relative">
            <div className="bg-red-500 hover:bg-red-600 hover:cursor-pointer p-2 text-white rounded-full items-center justify-center absolute -right-4 -top-5" onClick={() => { props.handleRemoveItem(); }}>
                <FaMinus className="w-4 h-4 text-white" />
            </div>
            <img src={IMAGES_SERVER + props.cartFood.photo} className="w-full h-24 rounded-t object-cover" title={props.cartFood.name} alt={props.cartFood.name} />
            <div className="flex flex-col p-4">
                <h2 className="font-poppins font-semibold text-zinc-800 text-xl">{props.cartFood.name}</h2>
                <p className="font-poppins text-zinc-800 text-lg mt-0.5">{props.cartFood.description}</p>
                <p className="font-poppins text-zinc-800 mt-0.5">Alergénicos: {props.cartFood.alergy}</p>
                <div className="bg-[#8C52FF] p-2 text-white w-fit rounded-lg mt-2">
                    <p className="text-white font-poppins text-lg">€ {parseFloat(props.cartFood.price).toFixed(2).toString().replace(".", ",")}</p>
                </div>
            </div>
        </div>
    );
}