import { useEffect, useState } from "react";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { useUser } from "../../Contexts/User";

export default function Help(){
    const [accordion, setAccordion] = useState([false, false, false, false, false]);
    const { getUserInfo } = useUser();

    useEffect(() => {
        getUserInfo();
    }, []);

    const toggleAccordion = (index) => {
        setAccordion((prevAccordion) => {
            const newAccordion = [...prevAccordion];
            newAccordion[index] = !newAccordion[index];
            return newAccordion;
        });
    };    

    return (
        <div className="absolute w-full h-full flex flex-col">
            <div className="flex flex-col min-w-full min-h-full">
                <div className="p-8 h-full">
                    <Header />
                    <div className="w-full flex flex-col items-center mt-8">
                        <h1 className="text-5xl font-poppins text-zinc-700 font-bold">Help</h1>
                        <div className="w-4/5 p-4 border rounded shadow mt-6 font-poppins font-extralight flex flex-col space-y-4">
                            <div className="rounded">
                                <div className="p-1 bg-zinc-50 rounded-t flex items-center justify-between hover:cursor-pointer hover:bg-zinc-100" onClick={() => { toggleAccordion(0); }}>
                                    <p className="ml-2">How Just Eat works?</p>
                                    { accordion[0] ? <MdArrowDropUp className="w-10 h-10 text-zinc-700" /> : <MdArrowDropDown className="w-10 h-10 text-zinc-700" /> }
                                </div>
                                { accordion[0] ? <div className="p-3 bg-zinc-200 rounded-b">
                                    <p>Just Eat operates as an online food ordering and delivery platform, offering a convenient way for customers to explore a variety of restaurants and cuisines in their area. Similar to platforms like Uber Eats, Just Eat streamlines the process of ordering food, although with a unique twist – it eliminates the delivery component. Instead, customers place their orders through the Just Eat platform and then pick up their meals directly from the chosen restaurant.</p>
                                </div> : null }
                            </div>
                            <div className="rounded">
                                <div className="p-1 bg-zinc-50 rounded-t flex items-center justify-between hover:cursor-pointer hover:bg-zinc-100" onClick={() => { toggleAccordion(1); }}>
                                    <p className="ml-2">What Just Eat payment methods?</p>
                                    { accordion[1] ? <MdArrowDropUp className="w-10 h-10 text-zinc-700" /> : <MdArrowDropDown className="w-10 h-10 text-zinc-700" /> }
                                </div>
                                { accordion[1] ? <div className="p-3 bg-zinc-200 rounded-b">
                                    <p>MBWay, Google Pay.</p>
                                </div> : null }
                            </div>
                            <div className="rounded">
                                <div className="p-1 bg-zinc-50 rounded-t flex items-center justify-between hover:cursor-pointer hover:bg-zinc-100" onClick={() => { toggleAccordion(2); }}>
                                    <p className="ml-2">Just Eat delivery foods?</p>
                                    { accordion[2] ? <MdArrowDropUp className="w-10 h-10 text-zinc-700" /> : <MdArrowDropDown className="w-10 h-10 text-zinc-700" /> }
                                </div>
                                { accordion[2] ? <div className="p-3 bg-zinc-200 rounded-b">
                                    <p>No.</p>
                                </div> : null }
                            </div>
                            <div className="rounded">
                                <div className="p-1 bg-zinc-50 rounded-t flex items-center justify-between hover:cursor-pointer hover:bg-zinc-100" onClick={() => { toggleAccordion(3); }}>
                                    <p className="ml-2">How i can create my own restaurant?</p>
                                    { accordion[3] ? <MdArrowDropUp className="w-10 h-10 text-zinc-700" /> : <MdArrowDropDown className="w-10 h-10 text-zinc-700" /> }
                                </div>
                                { accordion[3] ? <div className="p-3 bg-zinc-200 rounded-b">
                                    <p>Contact us at restaurants@justeat.com</p>
                                </div> : null }
                            </div>
                            <div className="rounded">
                                <div className="p-1 bg-zinc-50 rounded-t flex items-center justify-between hover:cursor-pointer hover:bg-zinc-100" onClick={() => { toggleAccordion(4); }}>
                                    <p className="ml-2">I need customer help, how to contact?</p>
                                    { accordion[4] ? <MdArrowDropUp className="w-10 h-10 text-zinc-700" /> : <MdArrowDropDown className="w-10 h-10 text-zinc-700" /> }
                                </div>
                                { accordion[4] ? <div className="p-3 bg-zinc-200 rounded-b">
                                    <p>Contact us at help@justeat.com</p>
                                </div> : null }
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}