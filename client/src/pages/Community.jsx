import React, { useEffect, useState } from "react";
import { dummyPublishedImages } from "../assets/assets";
import Loading from "./Loading";
import { useAppContext } from "../context/AppContext";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

const Community = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axios } = useAppContext();

  const fetchImages = async () => {
   try {
    const { data } = await axios.get(API_PATHS.USER.PUBLISHED_IMAGES);
    if (data?.success) {
if (data?.success) {
  setImages(Array.isArray(data.image) ? data.image : []);
}
    } else {
      toast.error(data?.message || "Failed to load images");
      setImages([]); // ensure array
    }
  } catch (error) {
    toast.error(error?.message || "Something went wrong");
    setImages([]); // ensure array
  } finally {
    setLoading(false);
  }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className=" p-6 pt-12 xl:px-12 2xl:px-20 w-full mx-auto h-full overflow-y-scroll">
      <h2 className=" text-xl font-semibold mb-6 text-gray-800 dark:text-purple-100">
        Community Images
      </h2>
      {images.length > 0 ? (
        <div className=" flex flex-wrap max-sm:justify-center gap-5">
          {images.map((item, index) => (
            <a
              key={index}
              href={item.imageUrl}
              target="_blank"
              className=" relative group block rounded-lg overflow-hidden border border-gray-200 dark:border-purple-700 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <img
                src={item.imageUrl}
                alt=""
                className="w-full h-40 md:h-50 2xl:h-62 object-cover group-hover:scale-105 transition-transform duration-100 ease-in-out"
              />
              <p className=" absolute bottom-0 right-0 text-xs bg-black/50 backdrop-blur text-white px-4 py-1 rounded-tl-xl opacity-0 group-hover:opacity-100 transition duration-300">
                Created by {item.userName}
              </p>
            </a>
          ))}
        </div>
      ) : (
        <p className=" text-center to-gray-600 dark:text-purple-200 mt-10">
          No Images Available
        </p>
      )}
    </div>
  );
};

export default Community;
