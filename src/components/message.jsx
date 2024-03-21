/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import BotMessage from "./botMessage";
import API from "../chatBotApi";
import UserMessage from "./userMessage";

export default function Messages({ messages }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="messages">
      {messages.map((message, index) =>
        message.type === "user" ? (
          <UserMessage key={index} text={message.text} />
        ) : (
          <BotMessage
            key={index}
            fetchMessage={async () =>
              await API.GetChatbotResponse(message.text)
            }
          />
        )
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
