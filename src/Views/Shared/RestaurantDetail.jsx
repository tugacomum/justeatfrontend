import Header from "../../Components/Header";
import { FaRegSave } from "react-icons/fa";
import { MdAddPhotoAlternate, MdDelete } from "react-icons/md";
import Footer from "../../Components/Footer";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../services/api";
import { useUser } from "../../Contexts/User";
import { IMAGES_SERVER } from "../../services/env";
import { useUtils } from "../../Contexts/Utils";
import { useNavigate, useParams } from "react-router-dom";

const submitRestaurantForm = z.object({
    name: z.string().min(1, 'The name is required!'),
    vat: z.string().min(9, 'The VAT number is required!'),
    openTime: z.string().min(1, 'The Open Time is required!'),
    closeTime: z.string().min(1, 'The Close Time is required!'),
    addressLineOne: z.string().min(1, 'The Address Line One is required!'),
    addressLineTwo: z.string().min(1, 'The Address Line Two is required!'),
    latitude: z.string().min(5, 'The Latitude is required!'),
    longitude: z.string().min(1, 'The Longitude is required!'),
    email: z.string().email('The email address is not valid!'),
    phone: z.string().min(9, 'The Phone Number is required!'),
    description: z.string().min(10, 'A small description is required!'),
    stars: z.string().nullable()
});

export default function RestaurantDetail(props){
    const { user } = useUser();
    const { showNotification, setLoading } = useUtils();
    let { slug } = useParams();
    const navigate = useNavigate();

    const [restaurantMetadata, setRestaurantMetadata] = useState({});
    const [selectedRestDays, setSelectedRestDays] = useState([]);
    const [imgUpload, setImageUpload] = useState();

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(submitRestaurantForm),
        mode: 'onChange'
    });

    function submitRestaurant(restaurantData){
        if(selectedRestDays.length === 7){
            showNotification("The Restaurant need to be opened at least 1 day!", 1);
        }else{
            setLoading(true);
            if(slug !== "new" || props.isOwn){
                const path = props.isOwn ? "own" : slug;
                api.put('/updateRestaurant/' + path, {
                    name: restaurantData.name,
                    email: restaurantData.email,
                    vat: restaurantData.vat,
                    phone: restaurantData.phone,
                    observations: restaurantData.description,
                    addressLineOne: restaurantData.addressLineOne,
                    addressLineTwo: restaurantData.addressLineTwo,
                    openingTime: restaurantData.openTime,
                    stars: restaurantData.stars,
                    closedTime: restaurantData.closeTime,
                    latitude: restaurantData.latitude,
                    restDays: selectedRestDays,
                    longitude: restaurantData.longitude
                }).then((restResponse) => {
                    showNotification(restResponse.data.message, 2);
                }).catch((errorResp) => {
                    showNotification(errorResp.response.data.message, errorResp.response.data.code);
                })
            }else{
                api.post('/createRestaurant', {
                    name: restaurantData.name,
                    email: restaurantData.email,
                    vat: restaurantData.vat,
                    phone: restaurantData.phone,
                    observations: restaurantData.description,
                    addressLineOne: restaurantData.addressLineOne,
                    addressLineTwo: restaurantData.addressLineTwo,
                    openingTime: restaurantData.openTime,
                    stars: restaurantData.stars,
                    closedTime: restaurantData.closeTime,
                    latitude: restaurantData.latitude,
                    restDays: selectedRestDays,
                    longitude: restaurantData.longitude
                }).then((restResponse) => {
                    showNotification(restResponse.data.message, 2);
                }).catch((errorResp) => {
                    showNotification(errorResp.response.data.message, errorResp.response.data.code);
                })
            }
            setLoading(false);
        }
    }

    useEffect(() => {
        async function loadRestaurant(){
            if(!props.isOwn){
                api.get('/restaurantOverview?editedEntity=' + slug).then((restaurantData) => {
                    const restData = restaurantData.data;
                    loadData(restData);
                }).catch((errorResp) => {
                    showNotification(errorResp.response.data.message, errorResp.response.data.code);
                    navigate("/admin/restaurants");
                })
            }else{
                api.get('/myRestaurant').then((restaurantData) => {
                    const restData = restaurantData.data;
                    loadData(restData);
                });
            }
        }
        if(props.isOwn || slug !== "new"){
            loadRestaurant();
        }
    }, []);

    function loadData(restData){
        setValue('name', restData.name);
        setValue('vat', restData.vat.toString());
        setValue('addressLineOne', restData.addressLineOne);
        setValue('addressLineTwo', restData.addressLineTwo);
        setValue('phone', restData.phone.toString());
        setValue('email', restData.email);
        setValue('latitude', restData.latitude);
        setValue('stars', restData.stars.toString());
        setValue('longitude', restData.longitude);
        setValue('description', restData.observations);
        setValue('openTime', new Date(restData.openingTime).getHours().toString().padStart(2, "0") + ":" + new Date(restData.openingTime).getMinutes().toString().padStart(2, "0"));
        setValue('closeTime', new Date(restData.closedTime).getHours().toString().padStart(2, "0") + ":" + new Date(restData.closedTime).getMinutes().toString().padStart(2, "0"));
        setSelectedRestDays(restData.restDays);
        setRestaurantMetadata({
            'name': restData.name,
            'photo': restData.photo
        });
    }

    function updateRestaurantRestdays(selectedRestDays) {
        setSelectedRestDays(() => {
            const newSelectedRestDays = [];
            for (let i = 0; i < selectedRestDays.target.selectedOptions.length; i++) {
                newSelectedRestDays.push(selectedRestDays.target.selectedOptions[i].value);
            }
            return newSelectedRestDays;
        });
    }

    function deleteRestaurant(){
        if(confirm("Are you sure you want to delete this restaurant?")){
            api.delete('/deleteRestaurant/' + slug).then((restResponse) => {
                showNotification(restResponse.data.message, 2);
            }).catch((errorResp) => {
                showNotification(errorResp.response.data.message, errorResp.response.data.code);
            })
            navigate("/admin/restaurants");
        }
    }

    function doUpload(){
        setLoading(true);
        const formData = new FormData();
        formData.append("file", imgUpload);
        const path = props.isOwn ? "own" : slug;

        api.post('/restaurantImageUpload/' + path, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((restResponse) => {
            showNotification(restResponse.data.message, 2);
            setRestaurantMetadata({
                ...restaurantMetadata,
                photo: restResponse.data.fileName
            });
        }).catch((errorResp) => {
            showNotification(errorResp.response.data.message, errorResp.response.data.code);
        });
        setLoading(false);
    }

    return (
        <div className="absolute w-full h-full flex flex-col">
            <div className="flex flex-col min-w-full min-h-full">
                <div className="p-8 h-full">
                    <Header />
                    <div className="mt-4 h-full">
                        <h1 className="text-zinc-800 font-poppins text-lg">{Object.keys(restaurantMetadata).length > 0 ? 'Information Of ' + restaurantMetadata.name : 'New Restaurant'}</h1>
                        <form className="flex flex-col mt-4" onSubmit={handleSubmit(submitRestaurant)}>
                            <div className="flex justify-between lg:space-x-2 lg:space-y-0 space-y-2 flex-col lg:flex-row">
                                <div className="w-full flex flex-col space-y-2">
                                    <div className="bg-slate-100 p-2 rounded">
                                        <div className="flex space-x-2">
                                            <label className="font-poppins text-zinc-700">Name</label>
                                            <input type="text" className="w-full bg-transparent outline-none" placeholder="A Nice Restaurant" {...register('name')} />
                                        </div>
                                        { errors.name ? <p className="text-red-600 font-poppins mt-0.5">{errors.name.message}</p> : null }
                                    </div>
                                    <div className="bg-slate-100 p-2 rounded">
                                        <div className="flex space-x-2">
                                            <label className="font-poppins text-zinc-700">Email</label>
                                            <input type="text" className="w-full bg-transparent outline-none" placeholder="test@example-com" {...register('email')} />
                                        </div>
                                        { errors.email ? <p className="text-red-600 font-poppins mt-0.5">{errors.email.message}</p> : null }
                                    </div>
                                    <div className="bg-slate-100 p-2 rounded">
                                        <div className="flex space-x-2">
                                            <label className="font-poppins text-zinc-700">Opening Time</label>
                                            <input type="time" className="bg-transparent outline-none" placeholder="Name" {...register('openTime')}  />
                                        </div>
                                        { errors.openTime ? <p className="text-red-600 font-poppins mt-0.5">{errors.openTime.message}</p> : null }
                                    </div>
                                    <div className="bg-slate-100 p-2 rounded">
                                        <div className="flex space-x-2">
                                            <label className="w-36 font-poppins text-zinc-700">Address Line 1</label>
                                            <input type="text" className="w-full bg-transparent outline-none" placeholder="An Good Street" {...register('addressLineOne')} />
                                        </div>
                                        { errors.addressLineOne ? <p className="text-red-600 font-poppins mt-0.5">{errors.addressLineOne.message}</p> : null }
                                    </div>
                                    <div className="bg-slate-100 p-2 rounded">
                                        <div className="flex space-x-2">
                                            <label className="font-poppins text-zinc-700">Latitude</label>
                                            <input type="text" className="w-full bg-transparent outline-none" placeholder="-3.1415926535" {...register('latitude')} />
                                        </div>
                                        { errors.latitude ? <p className="text-red-600 font-poppins mt-0.5">{errors.latitude.message}</p> : null }
                                    </div>
                                    <div className="bg-slate-100 p-2 rounded">
                                        <div className="flex space-x-2">
                                            <label className="font-poppins w-36 text-zinc-700">Rest Days</label>
                                            <select className="w-full bg-transparent outline-none" multiple onChange={updateRestaurantRestdays} value={selectedRestDays}>
                                                <option value="Monday">Monday</option>
                                                <option value="Tuesday">Tuesday</option>
                                                <option value="Wednesday">Wednesday</option>
                                                <option value="Thursday">Thursday</option>
                                                <option value="Friday">Friday</option>
                                                <option value="Saturday">Saturday</option>
                                                <option value="Sunday">Sunday</option>
                                            </select>
                                        </div>
                                    </div>
                                    { user.role === "admin" ? <div className="bg-slate-100 h-full p-2 flex flex-col rounded">
                                        <div className="flex space-x-2 h-full">
                                            <label className="w-36 font-poppins text-zinc-700">Rating</label>
                                            <textarea type="text" className="w-full h-full bg-transparent outline-none" placeholder="Be good!" {...register('stars')} />
                                        </div>
                                        { errors.stars ? <p className="text-red-600 font-poppins mt-0.5">{errors.stars.message}</p> : null }
                                    </div> : null }
                                </div>
                                <div className="w-full flex flex-col space-y-2">
                                    <div className="bg-slate-100 p-2 rounded">
                                        <div className="flex space-x-2">
                                            <label className="font-poppins text-zinc-700"></label>
                                            <input type="text" className="w-full bg-transparent outline-none" placeholder="999999999" {...register('vat')} />
                                        </div>
                                        { errors.vat ? <p className="text-red-600 font-poppins mt-0.5">{errors.vat.message}</p> : null }
                                    </div>
                                    <div className="bg-slate-100 p-2 rounded">
                                        <div className="flex space-x-2">
                                            <label className="font-poppins w-36 text-zinc-700">Phone Number</label>
                                            <input type="text" className="w-full bg-transparent outline-none" placeholder="985422489" {...register('phone')} />
                                        </div>
                                        { errors.phone ? <p className="text-red-600 font-poppins mt-0.5">{errors.phone.message}</p> : null }
                                    </div>
                                    <div className="bg-slate-100 p-2 rounded">
                                        <div className="flex space-x-2">
                                            <label className="font-poppins text-zinc-700">Close Time</label>
                                            <input type="time" className="bg-transparent outline-none" placeholder="Name" {...register('closeTime')} />
                                        </div>
                                        { errors.closeTime ? <p className="text-red-600 font-poppins mt-0.5">{errors.closeTime.message}</p> : null }
                                    </div>
                                    <div className="bg-slate-100 p-2 rounded">
                                        <div className="flex space-x-2">
                                            <label className="w-36 font-poppins text-zinc-700">Address Line 2</label>
                                            <input type="text" className="w-full bg-transparent outline-none" placeholder="Zip Code" {...register('addressLineTwo')} />
                                        </div>
                                        { errors.addressLineTwo ? <p className="text-red-600 font-poppins mt-0.5">{errors.addressLineTwo.message}</p> : null }
                                    </div>
                                    <div className="bg-slate-100 p-2 rounded">
                                        <div className="flex space-x-2">
                                            <label className="font-poppins text-zinc-700">Longitude</label>
                                            <input type="text" className="w-full bg-transparent outline-none" placeholder="-3.1415926535" {...register('longitude')} />
                                        </div>
                                        { errors.longitude ? <p className="text-red-600 font-poppins mt-0.5">{errors.longitude.message}</p> : null }
                                    </div>
                                    <div className="bg-slate-100 h-full p-2 flex flex-col rounded">
                                        <div className="flex space-x-2 h-full">
                                            <label className="w-36 font-poppins text-zinc-700">Description</label>
                                            <textarea type="text" className="w-full h-full bg-transparent outline-none" placeholder="We are a good restaurant!" {...register('description')} />
                                        </div>
                                        { errors.description ? <p className="text-red-600 font-poppins mt-0.5">{errors.description.message}</p> : null }
                                    </div>
                                </div>
                                
                            </div>
                            <div className="w-full flex justify-end mt-4 space-x-2">
                                { slug !== "new" && user.role === "admin" ? <button className="p-2 rounded bg-red-600 hover:bg-red-700 flex items-center space-x-1" type="button" onClick={() => { deleteRestaurant(); }}>
                                    <MdDelete className="w-6 h-6 text-white" />
                                    <p className="font-poppins text-white font-semibold">Delete</p>
                                </button> : null }
                                <button className="p-2 rounded bg-emerald-600 hover:bg-emerald-700 flex items-center space-x-1" type="submit">
                                    <FaRegSave className="w-6 h-6 text-white" />
                                    <p className="font-poppins text-white font-semibold">Save</p>
                                </button>
                            </div>
                        </form>
                        <h1 className="text-zinc-800 font-poppins text-lg">Profile Photo</h1>
                        <img src={IMAGES_SERVER + restaurantMetadata.photo} className="h-40 mt-2 rounded" title={restaurantMetadata.name} alt={restaurantMetadata.name} />
                        { slug !== "new" || props.isOwn ?
                        <Fragment>
                            <input
                                type="file"
                                className="mt-4"
                                onChange={(e) => { setImageUpload(e.target.files[0]); }}
                            />
                            <button className="p-2 rounded bg-emerald-600 hover:bg-emerald-700 flex items-center space-x-1 mt-2" onClick={() => { doUpload(); }}>
                                <MdAddPhotoAlternate className="w-6 h-6 text-white" />
                                <p className="font-poppins text-white font-semibold">Change</p>
                            </button>
                        </Fragment>
                        : null }
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}