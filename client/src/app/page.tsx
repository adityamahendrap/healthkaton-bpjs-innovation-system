"use client";

import Image from "next/image";
import ellipse1 from "../../public/ellipse-1.svg";
import ellipse2 from "../../public/ellipse-2.svg";
import React, { useState } from 'react';

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
  // Determine the CSS class based on whether it's a user's message or another person's message
  const bubbleClass = isUser
    ? "bg-blue-500 text-white ml-auto rounded-b-md rounded-tl-md "
    : "bg-gray-50 text-gray-700 mr-auto rounded-b-md rounded-tr-md";

  return (
    <div className={`max-w-[70%]  p-2 mb-3 ${bubbleClass} clear-both relative`}>
      <div className="message-content p-2">{message}</div>
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
      message: "Hello there!",
      isUser: true,
      time: "11:30 AM",
    },
    {
      id: 2,
      message: "Hello there!",
      isUser: false,
      time: "11:30 AM",
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const currentTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
    return currentTime;
  }

  const sendMessage = () => {
    if (newMessage.trim() === '') {
      return; 
    }

    const message = {
      id: messages.length + 1,
      message: newMessage,
      isUser: true,
      time: getCurrentTime()
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
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
        JKNSMARTSUPPORT 😜
      </div>
      <div className="relative z-[4]  flex-1  p-4 overflow-y-auto">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message.message}
          isUser={message.isUser}
          time={message.time}
        />
      ))}
      </div>
      <div className="relative z-[4]  bg-white p-4 flex items-center shadow-lg">
        <input
          type="text"
          placeholder="Type your message"
          className="flex-1 border rounded-md p-2 mr-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white py-2 px-4 rounded-md">
          Send
        </button>
      </div>
    </div>
  );
}
