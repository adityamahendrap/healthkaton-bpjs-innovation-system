"use client";

import Image from "next/image";
import ellipse1 from "../../public/ellipse-1.svg";
import ellipse2 from "../../public/ellipse-2.svg";
import React, { useState } from "react";
import axios from "axios";
import { get } from "http";
import { FaPaperPlane } from "react-icons/fa6";

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  time: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isUser,
  time,
}: MessageBubbleProps) => {
  const formatHospitalAnswer = (answerText: string): React.ReactNode[] => {
    // Regular expression to match URLs starting with 'https'
    const urlRegex = /(https:\/\/\S+)/gi;

    // Split the answer text into lines
    const lines: string[] = answerText.split("\n");
    const formattedLines: React.ReactNode[] = [];

    // Iterate through each line of text
    for (const line of lines) {
      // Use the `split` function to separate the line into text and URLs
      const parts: string[] = line.split(urlRegex);

      // Process each part and create React elements
      const lineElements: React.ReactNode[] = parts.map((part, index) => {
        if (part.match(urlRegex)) {
          // Format URLs as clickable links
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-700 mb-3 block"
            >
              Lihat Lokasi
            </a>
          );
        } else if (
          part.includes("[Klik disini]") ||
          part.includes("[Klik di sini]") ||
          part.includes("[Lihat di Google Maps]")
        ) {
          return null;
        } else {
          return <span key={index}>{part}</span>;
        }
      });

      // Filter out null elements (for removed "[Klik disini]")
      const filteredLineElements = lineElements.filter(Boolean);

      // Combine all elements in the line and add a newline
      formattedLines.push(
        <p key={formattedLines.length} className="mb-1">
          {filteredLineElements}
        </p>
      );
    }

    return formattedLines;
  };

  // Determine the CSS class based on whether it's a user's message or another person's message
  const bubbleClass = isUser
    ? "bg-blue-500 text-white ml-auto rounded-b-md rounded-tl-md "
    : "bg-gray-50 text-gray-700 mr-auto rounded-b-md rounded-tr-md";

  return (
    <div className={`max-w-[80%] p-2 mb-3 ${bubbleClass} clear-both relative`}>
      <div className="message-content p-2">{formatHospitalAnswer(message)}</div>
      <div className="message-time text-xs  absolute right-2 bottom-0">
        {time}
      </div>
    </div>
  );
};

export default function Home() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      message: "Halo, JKNSMARTSUPPORT disini. Ada yang bisa kami bantu? 👋",
      isUser: false,
      time: getCurrentTime(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [faq, setFaq] = useState([
    "Dimana lokasi saya?",
    "Dimana rumah sakit terdekat?",
    "Apa itu BPJS Kesehatan?",
  ]);

  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const currentTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
    return currentTime;
  }

  const getUserPosition = () => {
    return new Promise((resolve, reject) => {
      const successCallback = (position: any) => {
        localStorage.setItem("lat", position.coords.latitude);
        localStorage.setItem("long", position.coords.longitude);
        resolve(position);
      };

      const errorCallback = (error: any) => {
        reject(error);
      };

      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    });
  };

  const askServer = async (message: string) => {
    if (!localStorage.getItem("lat") || !localStorage.getItem("long")) {
      await getUserPosition();
    }
    console.log("ask the server:", message);
    setIsLoading(true);
    const response = await axios.post("http://localhost:8000/driven-qna", {
      question: message,
      lat: localStorage.getItem("lat"),
      long: localStorage.getItem("long"),
    });
    setIsLoading(false);
    const { data } = response;
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: prevMessages.length + 1,
        message: data,
        isUser: false,
        time: getCurrentTime(),
      },
    ]);
  };

  // Function to send a prompt message when an element is clicked
  const sendPromptMessage = (promptText: string) => {
    const message = {
      id: messages.length + 1,
      message: promptText,
      isUser: true,
      time: getCurrentTime(),
    };

    // Add the message to the chat
    setMessages([...messages, message]);
    setNewMessage("");

    // Send the message to the server
    askServer(message.message);
  };

  const sendMessage = () => {
    if (newMessage.trim() === "") {
      return;
    }

    const message = {
      id: messages.length + 1,
      message: newMessage,
      isUser: true,
      time: getCurrentTime(),
    };
    const tempMessage = message;

    setMessages([...messages, message]);
    setNewMessage("");

    askServer(tempMessage.message);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-app max-w-[380px] overflow-hidden relative h-screen mx-auto flex flex-col bg-gray-100 border rounded-lg shadow-lg">
      <div className="absolute right-[-70px] top-[15px]  overflow-hidden w-[500px] h-[500px] ">
        <Image src={ellipse1} alt="bubble" fill={true} />
      </div>
      <div className="absolute left-[-70px] top-[80px]  overflow-hidden w-[500px] h-[500px] ">
        <Image src={ellipse2} alt="bubble" fill={true} />
      </div>
      <div className="absolute right-[40px] bottom-[0]  overflow-hidden w-[500px] h-[500px] ">
        <Image src={ellipse1} alt="bubble" fill={true} />
      </div>
      <div className="relative z-[4] bg-white shadow-lg p-4">
        JKNSMARTSUPPORT
      </div>
      <div className="relative z-[4] h-full flex-1  p-4 overflow-y-auto overflow-x-hidden">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message.message}
            isUser={message.isUser}
            time={message.time}
          />
        ))}
      </div>
      <div className="default-ask w-full overflow-x-scroll whitespace-nowrap flex gap-2 mt-4 absolute left-0 bottom-[72px] z-[6]">
        <div className="px-1"></div>
        {faq.map((item, index) => (
          <div
            key={index}
            className="p-2 inline-block bg-blue-500 text-white text-sm whitespace-nowrap rounded-md cursor-pointer"
            onClick={() => sendPromptMessage(item)}
          >
            {item}
          </div>
        ))}
        <div className="px-1"></div>
      </div>
      <div className="relative z-[4]  bg-white p-4 flex items-center shadow-lg">
        <input
          type="text"
          placeholder="Type your message"
          className={
            "flex-1 border border-gray-300 rounded-md p-2 mr-2" +
            (isLoading ? " cursor-not-allowed" : "")
          }
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          className={
            "bg-blue-500 text-white py-3 px-4 rounded-md" +
            (isLoading ? " cursor-not-allowed" : "")
          }
        >
          {isLoading ? (
            <div
              className="w-4 h-4 rounded-full animate-spin
            border border-solid border-white border-t-transparent"
            ></div>
          ) : (
            <FaPaperPlane />
          )}
        </button>
      </div>
    </div>
  );
}
