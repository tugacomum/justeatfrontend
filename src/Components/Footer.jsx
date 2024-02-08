import { Link } from "react-router-dom";

export default function Footer(){
    return (
        <div className="lg:p-8 p-6 bg-zinc-800 flex justify-between items-center">
            <img src="/logo-white.svg" className="w-40" />
            <div className="flex flex-col items-end space-y-1">
                <p className="lg:text-base text-xs font-poppins font-semibold text-white">{new Date().getFullYear()} © JustEat. All rights reserved!</p>
                <div className="flex lg:text-base text-xs text-white font-poppins space-x-4">
                    <Link className="hover:underline" to="/help">Help</Link>
                    <Link className="hover:underline" to="/policys">Terms and conditions</Link>
                </div>
            </div>
        </div>
    );
}