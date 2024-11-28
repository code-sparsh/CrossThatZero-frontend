import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {

    const navigate = useNavigate();

    const handleOnChange = (e) => {
        localStorage.setItem('userID', e.target.value);
    }

    const handlePlayButton = () => {
        navigate("/play");
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            navigate("/play");
        }
    }

    return <div className="h-full bg-[#161c22] flex justify-center">

        <div className="flex flex-col items-center mt-36 gap-32 md:gap-64">
            <div className="title text-center mt-7 text-[#24a35a] text-7xl font-bold text-6xls font-title animate-bounce">
                Cross That Zero
            </div>

            <div className="flex flex-col gap-10 items-center">

                <input onChange={handleOnChange} onKeyDown={handleKeyDown} type="text" placeholder="Nickname" className="p-4 bg-blue-950 rounded-2xl text-gray-300 " required></input>
                <div className="text-3xl text-center">
                    <div onClick={handlePlayButton} className=" bg-green-600 hover:bg-green-700 w-max rounded-3xl py-3 px-10 cursor-pointer">Play</div>
                </div>
            </div>
        </div>
    </div>
}

export default Home;