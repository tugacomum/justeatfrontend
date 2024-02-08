import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Views/Anonymous/Home";
import SignUp from "./Views/Anonymous/SignUp";
import Restaurant from "./Views/Anonymous/Restaurant";
import ListRestaurants from "./Views/Admin/ListRestaurants";
import RestaurantDetail from "./Views/Shared/RestaurantDetail";
import Orders from "./Views/Shared/Orders";
import ListPermissions from "./Views/Admin/Permissions";
import Addresses from "./Views/User/Addresses";
import AddressDetail from "./Views/User/AddressesDetail";
import PermissionDetail from "./Views/Admin/PermissionDetail";
import Foods from "./Views/Restaurant/Foods";
import FoodDetail from "./Views/Restaurant/FoodDetails";
import RecoverAccount from "./Views/Anonymous/Recover";
import Profile from "./Views/Shared/Profile";
import Legal from "./Views/Anonymous/Legal";
import Help from "./Views/Anonymous/Help";

import { UserProvider } from "./Contexts/User";
import { UtilsProvider } from "./Contexts/Utils";

import Notification from "./Components/Notification";
import Loading from "./Components/Loading";
import CheckRole from "./Middlewares/CheckRole";
import Login from "./Views/Anonymous/Login";

export default function Router(){
    return (
        <BrowserRouter>
            <UtilsProvider>
                <Loading />
                <UserProvider>
                    <Routes>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/" element={<Home />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/recover" element={<RecoverAccount />} />
                        <Route path="/policys" element={<Legal />} />
                        <Route path="/help" element={<Help />} />

                        <Route path="/profile" element={<CheckRole roles={["manager", "admin", "user"]}><Profile /></CheckRole>} />
                        <Route path="/address/:addressId" element={<CheckRole roles={["user"]}><AddressDetail /></CheckRole>} />
                        <Route path="/orders" element={<CheckRole roles={["user"]}><Orders /></CheckRole>} />
                        <Route path="/addresses" element={<CheckRole roles={["user"]}><Addresses /></CheckRole>} />

                        <Route path="/restaurant/:slug" element={<Restaurant />} />
                        <Route path="/restaurant/overview" element={<CheckRole roles={["manager"]}><RestaurantDetail isOwn={true} /></CheckRole>} />
                        <Route path="/restaurant/orders" element={<CheckRole roles={["manager"]}><Orders /></CheckRole>} />
                        <Route path="/restaurant/foods" element={<CheckRole roles={["manager"]}><Foods /></CheckRole>} />
                        <Route path="/restaurant/food/:foodId" element={<CheckRole roles={["manager"]}><FoodDetail /></CheckRole>} />

                        <Route path="/admin/restaurants" element={<CheckRole roles={["admin"]}><ListRestaurants /></CheckRole>} />
                        <Route path="/admin/restaurant/:slug" element={<CheckRole roles={["admin"]}><RestaurantDetail /></CheckRole>} />
                        <Route path="/admin/orders" element={<CheckRole roles={["admin"]}><Orders /></CheckRole>} />
                        <Route path="/admin/permissions" element={<CheckRole roles={["admin"]}><ListPermissions /></CheckRole>} />
                        <Route path="/admin/permission/:userId" element={<CheckRole roles={["admin"]}><PermissionDetail /></CheckRole>} />
                    </Routes>
                    <Notification />
                </UserProvider>
            </UtilsProvider>
        </BrowserRouter>
    );
}