import { IoMdClose } from "react-icons/io";
import { useUtils } from "../Contexts/Utils";
import { Fragment } from "react";

export default function Notification(){
    const { message, closeNotification, messageType } = useUtils();

    return (
        <Fragment>
            { message !== "" ? <div className={`fixed right-0 top-0 mr-4 mt-4 p-3 rounded-md w-56 ${messageType === 0 ? "bg-red-600" : ( messageType === 1 ? "bg-yellow-500" : "bg-emerald-500")}`}>
                <div className="flex items-center justify-between">
                    <p className="text-white font-semibold">{ messageType === 0 ? "Error!" : ( messageType === 1 ? "Warning!" : "Success!")}</p>
                    <button type="button" onClick={() => { closeNotification(); }}>
                        <IoMdClose className="w-5 h-5 text-white" />
                    </button>
                </div>
                <p className="text-white">{message}</p>
            </div> : null }
        </Fragment>
    );
}