import { useEffect, useState } from "react";
import * as io from "socket.io-client";

const Room = () => {
    const userID = localStorage.getItem('userID');

    const [roomDetails, setRoomDetails] = useState({board: '', crossPlayer: '', zeroPlayer: ''});


    const [board, setBoard] = useState([' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [myPlayerType, setMyPlayerType] = useState('');

    // const socket = io("http://localhost:9000",{transports:['websocket'], reconnection:false}); 

    // const socket = io("http://localhost:9000", {
    //     reconnection: false,
    //     query: `userID=${userID}`,
    //     transports:['websocket'], //"room=" + room+",username="+username,
    //   });


    const zeroPlayer = "1234";
    const crossPlayer = "sparsh"


    const handleBoardClick = (index) => {
        console.log("button clicked")

        let updatedBoard = [...board];
        updatedBoard[index] = myPlayerType;
        setBoard(updatedBoard);
        console.log(board);
    }

    useEffect(() => {

        setRoomDetails({...roomDetails, board: board});
        console.log(roomDetails)

        const socket = io("http://localhost:9000", {
            reconnection: false,
            query: `userID=${userID}`,
            transports: ['websocket'], //"room=" + room+",username="+username,
        });


        socket.on("room", (room) => {
            console.log(room);

            if(!isGameStarted){
                setIsGameStarted(true);
                setRoomDetails(room);
                console.log(room.board.split(""));

                setBoard(room.board.split(""));

                if(room.zeroPlayer == userID)
                    setMyPlayerType('0')

                if(room.crossPlayer == userID)
                    setMyPlayerType('X')

            }

            if(isGameStarted) {
                setRoomDetails(room);
                setBoard(room.board.split(""));
                console.log(board);
            }
        })



        return () => {
            socket.disconnect();
        }
    }, [])


    return (<div className="h-full bg-[#161c22]">

        <div className="flex flex-col items-center">
            <div className="title text-center mt-7 text-[#24a35a] text-5xl md:text-8xl font-bold font-title">
                Cross That Zero
            </div>


            <div className="grid grid-rows-3 grid-cols-3 mt-20 rounded-xl">
                {board && board.map((b, index) => (
                    <div onClick={() => handleBoardClick(index)} className="border border-double rounded-sm hover:border-green-800 border-green-300  hover:bg-blue-900 bg-[#493c75] text-6xl p-10 lg:p-16 text-white cursor-pointer">{b}</div>
                ))}
            </div>


            <div className="bg-red-700 hover:bg-red-800 px-8 py-3 text-2xl rounded-3xl text-gray-300 mt-9 cursor-pointer">Quit</div>

        </div>



    </div>
    )

}

export default Room;