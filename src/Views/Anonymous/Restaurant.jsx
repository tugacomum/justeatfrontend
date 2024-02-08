import Header from "../../Components/Header";
import { FaLocationDot, FaClock } from "react-icons/fa6";
import { RxReader, RxStar } from "react-icons/rx";
import FoodCard from "../../Components/FoodCard";
import Footer from "../../Components/Footer";
import CartOverview from "../../Components/CartOverview";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { IMAGES_SERVER } from "../../services/env";
import { useUtils } from "../../Contexts/Utils";
import { useUser } from "../../Contexts/User";
import "./restaurant.css";

export default function Restaurant() {
  const [showCart, setShowCart] = useState(false);
  const [restaurant, setRestaurant] = useState({});
  const [rating, setRating] = useState(0);
  const [foods, setFoods] = useState([]);
  const { slug } = useParams();
  const { user } = useUser();
  const [comment, setComment] = useState();
  const { showNotification } = useUtils();
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageModalUrl, setImageModalUrl] = useState("");

  function openImageModal(imageUrl) {
    setImageModalUrl(imageUrl);
    setIsImageModalOpen(true);
  }

  useEffect(() => {
    async function loadRestaurant() {
      api
        .get("/restaurant/" + slug)
        .then((restaurantInfo) => {
          setRestaurant(restaurantInfo.data.restaurant);
          setFoods(restaurantInfo.data.foods);
        })
        .catch((errorResp) => {
          showNotification(
            errorResp.response.data.message,
            errorResp.response.data.code
          );
          navigate("/");
        });
    }

    loadRestaurant();
  }, []);

  const loadComments = async () => {
    try {
      const response = await api.post("/getrestaurantcomments", {
        restaurantId: slug,
      });
      setComments(response.data);
    } catch (error) {
      showNotification("Não foi possível carregar os comentários.", 0);
    }
  };

  useEffect(() => {
    loadComments();
  }, [slug, showNotification]);

  const handleCommentSubmit = () => {
    if (Object.keys(user).length > 0) {
      const userId = user._id;
      api
        .post("/postrestaurantcomments", {
          comment,
          userId,
          restaurantId: slug,
          rating,
        })
        .then(() => {
          showNotification("Comentário adicionado com sucesso", 2);
          setComment("");
          setRating(0);
          setShowModal(false);
          loadComments();
        })
        .catch((error) => {
          console.error("Erro ao adicionar comentário: ", error);
          showNotification("Erro ao adicionar comentário, tente novamente.", 1);
        });
    } else {
      setShowModal(false);
      showNotification("O utilizador precisa de fazer login!", 1);
    }
  };

  function handleTimes(timeShift) {
    const workTime = new Date(timeShift);
    return (
      workTime.getHours().toString().padStart(2, "0") +
      ":" +
      workTime.getMinutes().toString().padStart(2, "0")
    );
  }

  function formatRestDays(restDays) {
    return Array.isArray(restDays) && restDays.length > 1
      ? restDays.join(", ")
      : restDays;
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

  function exitEditMode() {
    localStorage.removeItem("@justeat/cart");
    localStorage.removeItem("@justeat/isEditing");
    localStorage.removeItem("@justeat/userId");
    navigate("/admin/restaurants");
  }

  const calculateAverageRating = () => {
    if (comments.length === 0) return 0;

    const sum = comments.reduce((acc, comment) => acc + comment.rating, 0);
    const average = sum / comments.length;

    return average.toFixed(1);
  };

  const averageRating = calculateAverageRating();

  return (
    <>
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div
            className="modal-container bg-white p-4 rounded-lg max-w-3xl max-h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="text-black text-2xl font-bold p-2 hover:bg-gray-200 rounded"
              >
                &times;
              </button>
            </div>
            <img
              src={imageModalUrl}
              alt="Restaurant"
              className="rounded-lg w-full h-auto"
            />
          </div>
        </div>
      )}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Deixar comentário...</h3>
              <button
                className="modal-close-button"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                className="textarea"
                placeholder="Deixe seu comentário..."
                required
              ></textarea>
              <div className="star-rating">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`star ${
                      rating > index ? "text-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => setRating(index + 1)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="bg-[red] p-3 ml-2 text-white rounded-lg"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-[#8C52FF] p-3 ml-2 text-white rounded-lg"
                type="button"
                onClick={handleCommentSubmit}
              >
                Comentar
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="relative w-full min-h-screen flex flex-col justify-between">
        {localStorage.getItem("@justeat/isEditing") ? (
          <div className="bg-yellow-600 p-1 flex justify-center space-x-2">
            <h1 className="text-white font-poppins">In Editing Mode!</h1>
            <a
              onClick={() => {
                exitEditMode();
              }}
              className="text-white hover:underline"
            >
              Exit mode
            </a>
          </div>
        ) : null}
        {showCart ? <CartOverview closeCart={setShowCart} /> : null}
        {Object.keys(restaurant).length > 0 ? (
          <div className="flex flex-col min-w-full min-h-full">
            <div className="p-8 flex flex-col">
              <Header openCart={setShowCart} />
              <div className="flex flex-wrap md:flex-nowrap mt-8">
                <div
                  onClick={() =>
                    openImageModal(IMAGES_SERVER + restaurant.photo)
                  }
                  className="w-full md:w-6/12 h-96 bg-cover bg-center rounded-xl cursor-pointer"
                  style={{
                    backgroundImage: `url(${IMAGES_SERVER + restaurant.photo})`,
                  }}
                />
                <div className="w-full md:w-3/12 mt-4 md:mt-0 md:ml-6">
                  <h1 className="font-poppins font-semibold text-2xl text-zinc-800">
                    {restaurant.name}
                  </h1>
                  <div className="mt-4">
                    <div className="flex items-center space-x-4">
                      <FaLocationDot className="w-8 h-8 text-[#8C52FF]" />
                      <div>
                        <p className="font-poppins text-zinc-800">
                          {restaurant.addressLineOne}
                        </p>
                        <p className="font-poppins text-zinc-800">
                          {restaurant.addressLineTwo}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center space-x-4">
                      <FaClock className="w-8 h-8 text-[#8C52FF]" />
                      <p className="font-poppins text-zinc-800">
                        {handleTimes(restaurant.openingTime)}H -{" "}
                        {handleTimes(restaurant.closedTime)}H / Rest Days:{" "}
                        {restaurant.restDays.length === 0
                          ? "None"
                          : formatRestDays(restaurant.restDays)}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center space-x-4">
                      <RxReader className="w-8 h-8 text-[#8C52FF]" />
                      <p className="font-poppins text-zinc-800">
                        Observations: {restaurant.observations}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center space-x-4">
                      <RxStar className="w-8 h-8 text-[#8C52FF]" />
                      <p className="font-poppins text-zinc-800">
                        {averageRating}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  style={{ height: "auto", width: 1, backgroundColor: "black" }}
                />
                <div className="w-full md:w-3/12 mt-4 md:mt-0 ml-12">
                  <h1 className="font-poppins font-semibold text-2xl text-zinc-800">
                    Comentários
                  </h1>
                  <div
                    className="comments-container"
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    {comments.length > 0 ? (
                      comments.map((comment, index) => (
                        <div
                          key={index}
                          className={`${
                            index > 0 ? "mt-4 border-t pt-4" : "mt-1.5"
                          }`}
                        >
                          <div className="font-bold">{comment.username}</div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <RxStar
                                key={i}
                                className={`w-5 h-5 ${
                                  i < comment.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p>
                            <b>{comment.userId.nome}</b> comentou:{" "}
                            {comment.comment}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>Sem comentários disponíveis...</p>
                    )}
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => setShowModal(true)}
                      className="bg-[#8C52FF] p-2 text-white w-full rounded-lg mt-4"
                    >
                      Deixar avaliação
                    </button>
                  </div>
                </div>
              </div>
              <h1 className="font-poppins font-semibold text-2xl text-zinc-800 mt-6">
                Our Menus
              </h1>
              <div className="mt-1 grid lg:grid-cols-4 gap-4">
                {foods.map((food) => {
                  return (
                    <FoodCard
                      key={food._id}
                      food={food}
                      isOpen={verifyIfIsOpen(
                        restaurant.openingTime,
                        restaurant.closedTime,
                        restaurant.restDays
                      )}
                    />
                  );
                })}
              </div>
            </div>
            <div className="w-full mt-4 md:mt-8 px-8">
              <p className="text-2xl text-zinc-800 underline font-poppins">
                Our Location
              </p>
              <iframe
                className="w-full h-72 mt-4"
                src={`https://maps.google.com/maps?q=${restaurant.latitude},${restaurant.longitude}&z=17&ie=UTF8&output=embed`}
              />
            </div>
            <Footer />
          </div>
        ) : null}
      </div>
    </>
  );
}