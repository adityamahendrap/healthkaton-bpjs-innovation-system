"use client";

import Image from "next/image";
import ellipse1 from "../../public/ellipse-1.svg";
import ellipse2 from "../../public/ellipse-2.svg";

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
      <div className="relative z-[4] bg-white shadow-lg p-4">test</div>
      <div className="relative z-[4]  flex-1  p-4 overflow-y-auto">
        <MessageBubble message="Hello there!" isUser={true} time="11:30 AM" />
        <MessageBubble message="Hello there!" isUser={false} time="11:30 AM" />
        <MessageBubble message="Hello there!" isUser={true} time="11:30 AM" />
        <MessageBubble message="Hello there!" isUser={false} time="11:30 AM" />
        <MessageBubble message="Hello there!" isUser={true} time="11:30 AM" />
        <MessageBubble message="Hello there!" isUser={false} time="11:30 AM" />
        <MessageBubble message="Hello there!" isUser={true} time="11:30 AM" />
        <MessageBubble message="Hello there!" isUser={true} time="11:30 AM" />
        <MessageBubble message="Hello there!" isUser={true} time="11:30 AM" />
        <MessageBubble message="Hello there!" isUser={true} time="11:30 AM" />
        <MessageBubble message="Hello there!" isUser={true} time="11:30 AM" />
      </div>
      <div className="relative z-[4]  bg-white p-4 flex items-center shadow-lg">
        <input
          type="text"
          placeholder="Type your message"
          className="flex-1 border rounded-md p-2 mr-2"
        />
        <button className="bg-blue-500 text-white py-2 px-4 rounded-md">
          Send
        </button>
      </div>
    </div>
  );
}
