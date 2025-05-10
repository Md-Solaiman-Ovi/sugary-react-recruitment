/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
import Navbar from "../components/Navbar";

const BASE_URL = "https://sugarytestapi.azurewebsites.net";
const IMAGE_BASE_URL = "https://d1wh1xji6f82aw.cloudfront.net/";

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const [materials, setMaterials] = useState<any[]>([]);
  const [skip, setSkip] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const fetchMaterials = async () => {
    if (!token || isFetching) return;
    setIsFetching(true);
    try {
      const filter = btoa(
        JSON.stringify({ Skip: skip, Limit: 20, Types: [1] })
      );
      const response = await axios.get(
        `${BASE_URL}/Materials/GetAll/?filter=${filter}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("material response :", response);
      setMaterials((prev) => [...prev, ...response.data.Materials]);
      setSkip((prev) => prev + 20);
    } catch (error) {
      console.log("Failed to fetch materials:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 50 && !isFetching) {
      fetchMaterials();
    }
  };

  return (
    <div
      className="h-screen overflow-y-scroll no-scrollbar"
      onScroll={handleScroll}
    >
      <Navbar userInfo={user} logout={logout} />
      <div className="text-white font-bold text-3xl container mx-auto py-5  px-4">
        Materials
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4  container mx-auto ">
        {materials.map((mat, index: number) => (
          <div
            key={index}
            className=" rounded shadow p-4 bg-gray-800 hover:bg-transparent border-transparent hover:border-teal-500 border-[1px]"
          >
            <img
              src={`${IMAGE_BASE_URL}${mat.CoverPhoto}`}
              alt={mat.Title}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h2 className="font-bold text-lg text-teal-500">{mat.Title}</h2>
            <p className="text-sm text-gray-500">{mat.BrandName}</p>
            <p className="text-teal-600 font-semibold">
              {mat.SalesPrice} BDT / ${mat.SalesPriceInUsd.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
