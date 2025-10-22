// import { useEffect, useRef, useState } from "react"



// function App() {
//   const [message, setMessage] = useState(["hi there"])
  
//   const wsRef = useRef();

//   useEffect(()=>{
//     const ws = new WebSocket("ws://localhost:8080");
//     ws.onmessage = (event) => {
//         setMessage((m) => [...m ,event.data])
//     }

//     wsRef.current = ws;

//     ws.onopen = ()=>{
//       ws.send(JSON.stringify({
//         type: "join",
//         payload: {
//           roomId: "red"
//         }
//       }))
//     }
//   },[])


//   function sendmessage(){
//       const message = document.getElementById("message")?.value;
//       wsRef.current.send(JSON.stringify({
//         type:"chat",
//         payload: {
//           message : message
//         }
//       }))
//   }

//   return (
//     <>
//       <div className="w-screen h-screen bg-black flex text-white justify-center items-center ">
//         <div className="w-90 h-120 rounded-md border flex flex-col">
//             <div>
//               <h1 className="flex justify-center font-bold text-xl m-2">NexChat</h1>
//             </div>
//             <div className="w-full h-[57vh]" >
//               <div className=" flex flex-col justify-center font-sans leading-none bg-white w-40 rounded-md m-2 p-2">

//               <span className="text-gray-400 font-light text-xs">
//                 Tue Oct 22 2025 14:38:19
//               </span>

//               <div className="flex gap-2 ml-2 leading-none">
//                 <span className="text-gray-600 font-light text-xs">user1:</span>
//                 {message.map((msg,index) => (
//                   <span key={index} className="text-black font-medium ">
//                     {msg}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             </div>
//             <div className="flex gap-1 m-1">
//                 <input className="p-2 w-full rounded-md border focus:outline-none placeholder:font-light" 
//                       type="text" 
//                       placeholder="enter message"
//                       id="message"></input>

//                 <button className="px-4 bg-green-400 rounded-md text-black font-bold border border-green-800 hover:bg-green-500"
//                         onClick={sendmessage}>
//                         send
//                 </button>
//             </div>
          
//         </div>
//       </div>
//     </>
//   )
// }

// export default App
import { useEffect, useRef, useState } from "react";

function App() {
  const [messages, setMessages] = useState([]); // array of { username, message, timestamp }
  const wsRef = useRef();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "chat") {
        const { message, username, timeStamp } = data.payload;
        setMessages((prev) => [
          ...prev,
          {
            message,
            username: username || "Anonymous",
            timestamp: new Date(timeStamp).toLocaleString(),
          },
        ]);
      }
    };

    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red",
            username: "user1", // <-- Add username here
            avatarUrl: "",     // <-- optional
            timeStamp: new Date().toISOString(),
          },
        })
      );
    };
  }, []);

  function sendMessage() {
    const input = document.getElementById("message");
    const message = input?.value;
    if (!message) return;

    wsRef.current.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message,
        },
      })
    );

    // Optionally show your own message instantly
    //@ts-ignore
    setMessages((prev) => [
      ...prev,
      {
        message,
        username: "You",
        timestamp: new Date().toLocaleString(),
      },
    ]);

    input.value = "";
  }

  return (
    <div className="w-screen h-screen bg-black flex text-white justify-center items-center">
      <div className="w-96 h-[80vh] rounded-md border flex flex-col bg-gray-900">
        <div>
          <h1 className="flex justify-center font-bold text-xl m-2">NexChat</h1>
        </div>

        <div className="w-full h-[60vh] overflow-y-auto p-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className="flex flex-col font-sans leading-tight bg-white w-fit rounded-md mb-2 px-2 py-1 text-xs text-black"
            >
              
              <span className="text-gray-400">{msg.timestamp}</span>
              <div className="flex gap-2 ml-2">
                <span className="text-gray-600">{msg.username}:</span>
                <span className="font-medium">{msg.message}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-1 m-1">
          <input
            className="p-2 w-full rounded-md border focus:outline-none placeholder:font-light"
            type="text"
            placeholder="enter message"
            id="message"
          />

          <button
            className="px-4 bg-green-400 rounded-md text-black font-bold border border-green-800 hover:bg-green-500"
            onClick={sendMessage}
          >
            send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
