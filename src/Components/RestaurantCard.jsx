import { FaStar, FaRegStar } from "react-icons/fa";
import { IMAGES_SERVER } from "../services/env";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useEffect, useState } from "react";

export default function RestaurantCard(props) {
  const [averageRating, setAverageRating] = useState(0);
  const navigate = useNavigate();
  const _id = props.restaurant._id;

  useEffect(() => {
    async function getRatings() {
      api
        .post("/getrestaurantcomments", {
          restaurantId: _id,
        })
        .then((res) => {
          const ratings = res.data.map((comment) => comment.rating);
          const average = ratings.length
            ? ratings.reduce((acc, cur) => acc + cur, 0) / ratings.length
            : 0;
          setAverageRating(Math.round(average));
        });
    }
    getRatings();
  }, [_id]);

  function handleTimes(timeShift) {
    const workTime = new Date(timeShift);
    return (
      workTime.getHours().toString().padStart(2, "0") +
      ":" +
      workTime.getMinutes().toString().padStart(2, "0")
    );
  }

  function verifyIfIsOpen(openTime, closeTime, listOfRestDays) {
    const openTimeDate = new Date(openTime);
    const closeTimeDate = new Date(closeTime);
    const now = new Date();

    openTimeDate.setDate(now.getDate());
    openTimeDate.setMonth(now.getMonth());
    openTimeDate.setFullYear(now.getFullYear());

    closeTimeDate.setDate(now.getDate());
    closeTimeDate.setMonth(now.getMonth());
    closeTimeDate.setFullYear(now.getFullYear());

    if (now <= openTimeDate || now >= closeTimeDate) {
      return false;
    }

    const nowDay = now.toLocaleDateString("en-EN", { weekday: "long" });

    if (listOfRestDays.includes(nowDay)) {
      return false;
    }

    return true;
  }

  return (
    <div
      className="w-full rounded-t-md border border-gray-300 shadow-lg hover:cursor-pointer group"
      onClick={() => {
        props.fromAdmin
          ? navigate("/admin/restaurant/" + props.restaurant._id)
          : navigate("/restaurant/" + props.restaurant._id);
      }}
    >
      <div className="overflow-hidden rounded-t-md">
        <div className="w-full rounded-t-md h-24 flex items-center justify-center">
          <img
            src={IMAGES_SERVER + props.restaurant.photo}
            className="scale-100 group-hover:scale-110 transition-all duration-500 ease-in-out object-cover"
            title={props.restaurant.name}
            alt={props.restaurant.name}
          />
        </div>
      </div>
      <div className="p-2 mt-2">
        <h1 className="font-poppins font-semibold text-zinc-800">
          {props.restaurant.name}
        </h1>
        <div className="mt-1 flex items-center">
          <div
            className={`w-3 h-3 rounded-full ${
              verifyIfIsOpen(
                props.restaurant.openingTime,
                props.restaurant.closedTime,
                props.restaurant.restDays
              )
                ? "bg-emerald-600"
                : "bg-red-600"
            }`}
          />
          <p className="font-poppins font-extralight ml-2 text-zinc-800">
            Horario: {handleTimes(props.restaurant.openingTime)} até às{" "}
            {handleTimes(props.restaurant.closedTime)}
          </p>
        </div>
        <div className="flex space-x-1 mt-3">
          {[...Array(averageRating)].map((_, i) => {
            return <FaStar key={i} className="w-5 h-5 text-yellow-400" />;
          })}
          {[...Array(5 - averageRating)].map((_, i) => {
            return <FaRegStar key={i} className="w-5 h-5 text-yellow-400" />;
          })}
        </div>
        <p className="font-poppins mt-2 font-extralight text-zinc-800">
          {props.restaurant.addressLineOne}
        </p>
        <p className="font-poppins font-extralight text-zinc-800">
          {props.restaurant.addressLineTwo}
        </p>
      </div>
    </div>
  );
}