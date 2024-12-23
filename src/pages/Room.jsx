import { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import Popup from "../components/Popup";

import profilePhoto from '../assets/profilePhoto.png'

const Room = () => {

    const navigate = useNavigate();
    const alert = useAlert();

    const userID = localStorage.getItem('userID');

    const [roomDetails, setRoomDetails] = useState({ board: '', crossPlayer: '', zeroPlayer: '' });

    const [loadingArray, setLoadingArray] = useState(Array(10).fill(" "));


    const [board, setBoard] = useState(['-', '-', '-', '-', '-', '-', '-', '-', '-']);
    const [isLoading, setIsLoading] = useState(true);
    const [myPlayerType, setMyPlayerType] = useState('');
    const [isMyTurn, setIsMyTurn] = useState(false);
    const [winner, setWinner] = useState(" ");

    let isGameStarted = false;

    const [newSocket, setNewSocket] = useState(null);

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };


    const handleBoardClick = (index) => {
        console.log("button clicked")

        if (!isMyTurn) {
            alert.error("Its not your turn");
            return;
        }
        // let updatedBoard = [...board];
        // updatedBoard[index] = myPlayerType;
        // setBoard(updatedBoard);
        console.log(board);

        // setIsMyTurn(!isMyTurn);

        newSocket.emit("playerMove", { move: index, playerType: myPlayerType});
    }

    const handleQuitButton = () => {
        newSocket.disconnect();
        navigate("/");
    }

    useEffect(() => {
        let count = -1;
        const interval = setInterval(() => {
            count++;   
            if (count >= 200 && !isLoading) {
                clearInterval(interval);
                alert.error("Couldn't find an opponent. Please come back later.");

                if (newSocket)
                    newSocket.disconnect();

                navigate("/");
            } else {
                setLoadingArray((prevArray) => {
                    const newArray = [...prevArray];
                    const index = count % 10;
                    newArray[index] = '...';
                    if (index == 0)
                        newArray[9] = ' '
                    else
                        newArray[index - 1] = ' ';
                    return newArray;

                });
            }
        }, 100);
    }, [])


    useEffect(() => { 

        setRoomDetails({ ...roomDetails, board: board });
        
        const socket = io(import.meta.env.VITE_SOCKET_SERVER_URL, {
            reconnection: false,
            query: `username=${userID}`,
            transports: ['websocket'],
        });

        // const socket = io("http://localhost:9000/", {
        //     reconnection: false,
        //     query: `userID=${userID}`,
        //     rejectUnauthorized: false,
        // });

        
        setNewSocket(socket);

        socket.on("room", (room) => {
            console.log(room);
            // setIsMyTurn(!isMyTurn);

            if (isMyTurn == false) {
                // setIsMyTurn(true); 
                // console.log("changing the turn - " + isMyTurn);
            }

            else if (isMyTurn == true) {
                // setIsMyTurn(false);
                // console.log("changing the turn - " + isMyTurn);
            }
            if (!isGameStarted) {

                setRoomDetails(room);

                alert.success("Opponent found");

                console.log(room.board.split(""));

                setBoard(room.board.split(""));

                if (room.zeroPlayer == userID) {
                    setMyPlayerType('ZERO')
                    setIsMyTurn(true);
                    alert.show("It's your turn")
                }

                if (room.crossPlayer == userID) {
                    setMyPlayerType('CROSS')
                    setIsMyTurn(false);
                }
                setIsLoading(false);
                isGameStarted = true;
                console.log(isGameStarted)

            }

            else if (isGameStarted) {
                setRoomDetails(room);
                setBoard(room.board.split(""));
                // setIsMyTurn(!isMyTurn);
                // console.log("Changing the turn - " + isMyTurn);
            }

            return () => {
                socket.disconnect();
            }
        })

        socket.on("winner", (w) => {
            if (w.winner == "CROSS" && myPlayerType == 'CROSS') {
                alert.success("Congratulations! You won");
            }

            if (w.winner == "ZERO" && myPlayerType == 'ZERO') {
                alert.success("Congratulations! You won");
            }

            console.log("Winner declared - " + w.winner);

            handleOpenPopup();
            setWinner(w.winner);
        })

        socket.on("disconnect", () => {
            console.log("diconnect ho gya")
            alert.error("Disconnected");
            navigate("/");
        }) 

    }, [])


    useEffect(() => {

        setIsMyTurn(!isMyTurn);
    }, [board])


    return (<div className="h-full bg-[#161c22]">

        <div className="flex flex-col items-center pt-2 lg:pt-10">
            <div className="title text-center mt-7 text-[#24a35a] text-5xl md:text-8xl font-bold font-title">
                Cross That Zero
            </div>

            {!isLoading ?
                <div className="mt-20 mx-4 flex-col md:flex-row md:flex gap-x-14 lg:gap-x-36">
                    <div className="gap-y-10 flex justify-between">
                        <div className="hidden md:flex flex-col gap-y-10 text-center mt-10 ">
                            <img src={profilePhoto} height="300" width="200" className="rounded-full" ></img>
                            <div className=" text-blue-900 text-3xl">John</div>
                            {(isMyTurn) ? <div className=" text-green-800 text-6xl animate-pulse">{"Turn"}</div> : null}
                        </div>
                        <div className="md:hidden flex flex-col text-center items-center">
                            <img src={profilePhoto} height="100" width="70" className={(isMyTurn)? "rounded-full border-4 border-green-800 animate-pulse" : "rounded-full border-4 border-black"}></img>
                            <div className=" text-blue-900 text-lg">John</div>
                            {/* {isMyTurn ? <div className=" text-green-800 text-4xl animate-pulse">{"->"}</div> : null} */}
                        </div>
                        <div className="md:hidden flex flex-col text-center items-center">
                        <img src={profilePhoto} height="100" width="70" className={(!isMyTurn)? "rounded-full border-4 border-green-800 animate-pulse" : "rounded-full border-4 border-black"}></img>
                            <div className=" text-blue-900 text-lg">Sparsh Sethi</div>
                            {/* {!isMyTurn ? <div className=" text-green-800 text-4xl animate-pulse">{"<-"}</div> : null} */}
                        </div>
                    </div>
                    <div className="grid grid-rows-3 grid-cols-3 rounded-xl mt-4">
                        {board && board.map((b, index) => (
                            <div onClick={() => handleBoardClick(index)} className="border border-double rounded-sm hover:border-green-800 border-green-300  hover:bg-blue-900 active:bg-blue-900 bg-[#493c75] text-4xl md:text-6xl p-10 lg:py-16 lg:px-20 text-white cursor-pointer">{b}</div>
                        ))}
                    </div>
                    <div className="hidden md:flex flex-col gap-y-10 text-center mt-10">
                        <img src={profilePhoto} height="300" width="200" className="rounded-full" ></img>
                        <div className=" text-blue-900 text-3xl">Sparsh Sethi</div>
                        {(!isMyTurn) ? <div className=" text-green-800 text-6xl animate-pulse">{"Turn"}</div> : null}
                    </div>
                </div>
                :
                <div className="mt-48 text-white">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <div className=" text-purple-800 text-center">Searching for an opponent...</div>
                    <div className="mt-9 px-5 py-3 bg-[#161c22]s bg-blue-950 rounded-3xl">
                        {loadingArray.map((element, index) => (
                            <div
                                key={index}
                                className="inline-block w-8 h-8 text-center"
                            >
                                {element}
                            </div>
                        ))}
                    </div>
                </div>}

            <div onClick={handleQuitButton} className="bg-red-700 hover:bg-red-800 px-8 py-3 text-2xl rounded-3xl text-gray-300 mt-9 cursor-pointer">Quit</div>



        </div>
        {isPopupOpen && (
            <Popup
                title="Winner"
                content={winner + " is the winner"}
                onClose={handleClosePopup}
            />
        )}

    </div>
    )

}

export default Room;