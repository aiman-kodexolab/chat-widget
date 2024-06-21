import { chat } from "./chat";

(function () {
    const formatTime = () => {
    const scriptTag = document.getElementById('chatbot-script');
    const key = scriptTag.getAttribute('data-key');
    console.log("key",key);
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    const day = now.getDate();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const suffix = ["th", "st", "nd", "rd"][
      day % 10 > 3 || Math.floor((day % 100) / 10) === 1 ? 0 : day % 10
    ];

    const formattedDate = `${day}${suffix} ${month} ${year}`;
    const formattedTime = `${hours}:${formattedMinutes} ${ampm}`;

    return `${formattedDate} . ${formattedTime}`;
  };

  // Create and inject the CSS
  const style = document.createElement("style");
  style.innerHTML = `
      #chat-widget {
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 300px;
        height: 400px;
        border: 1px solid #ccc;
        background: #fff;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        display: flex;
        flex-direction: column;
      }
  
      #chat-header {
        background: #007bff;
        color: #fff;
        padding: 10px;
        text-align: center;
        cursor: pointer;
      }
  
      #chat-body {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
      }
  
      #chat-input {
        width: calc(100% - 70px);
        padding: 10px;
      }
  
      #send-btn {
        width: 60px;
        padding: 10px;
        background: #007bff;
        color: #fff;
        border: none;
        cursor: pointer;
      }
      
      .user-message, .bot-message {
        margin-bottom: 10px;
      }
      
      .user-message {
        text-align: right;
        color: #000;
      }
      
      .bot-message {
        text-align: left;
        color: #007bff;
      }
    `;
  document.head.appendChild(style);

  // Create the HTML structure
  const widget = document.createElement("div");
  widget.id = "chat-widget";
  widget.innerHTML = `
      <div id="chat-header">Chat with us!</div>
      <div id="chat-body"></div>
      <input type="text" id="chat-input" placeholder="Type your message...">
      <button id="send-btn">Send</button>
    `;
  document.body.appendChild(widget);

  // Add JavaScript functionality
  const socket = io("d116w9xjnkxxep.cloudfront.net", {
    transports: ["websocket"],
  }); // Change to your backend URL
  socket.connect();
  console.log("aayaaa");
  document.getElementById("send-btn").addEventListener("click", function () {
      const input = document.getElementById("chat-input");
      const message = input.value;
      const sanitizedMessage = message
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
      console.log("------------",sanitizedMessage);
    const sendData = {
      type: "user",
      content: sanitizedMessage,
      email: "fahad.ahmed@kodexolabs.com",
      session_id: "66742106b3419b010ea8cd75",
      is_joined: false,
      agent_response: "",
      created_on: formatTime(),
    };
    if (message.trim() !== "") {
      socket.emit("chat_message", sendData);
      const chatBody = document.getElementById("chat-body");
      const userMessage = document.createElement("div");
      userMessage.textContent = message;
      userMessage.classList.add("user-message");
      chatBody.appendChild(userMessage);
      input.value = "";
    }
  });

  socket.on("done", (msg) => {
    console.log("------",msg)
    if (msg?.chat_completed && msg?.sentence) {
      const botTime = formatTime();
      console.log('botTime',botTime);
      chat();

      if (!msg?.fine_tuning) {
        const chatBody = document.getElementById("chat-body");
        const botMessage = document.createElement("div");
        botMessage.textContent = msg?.sentence;
        botMessage.classList.add("bot-message");
        chatBody.appendChild(botMessage);
      }
    }
  });

  socket.on("response", (msg) => {
    const chatBody = document.getElementById("chat-body");
    const botMessage = document.createElement("div");
    botMessage.textContent = msg;
    botMessage.classList.add("bot-message");
    chatBody.appendChild(botMessage);
  });
})();
