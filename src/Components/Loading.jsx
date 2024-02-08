import { Fragment } from "react";
import { useUtils } from "../Contexts/Utils";

export default function Loading(){
    const { loading } = useUtils();

    return (
        <Fragment>
            { loading ? <div className="fixed w-full h-full z-40 bg-black opacity-60 flex items-center justify-center flex-col">
                <img src="/loading.webp" title="Loading" alt="Loading" className="w-64" />
                <p className="font-poppins text-white text-4xl font-semibold mt-12">Loading...</p>
            </div> : null }
        </Fragment>
    );
}