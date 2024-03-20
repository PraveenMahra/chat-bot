import { useState, useEffect } from "react";
import BotMessage from "./components/botMessage";
import UserMessage from "./components/userMessage";
import Messages from "./components/message";
import Input from "./components/input";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import API from "./chatBotApi";
import "./index.css";

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [savedChats, setSavedChats] = useState([]);

  useEffect(() => {
    async function loadWelcomeMessage() {
      const response = await API.GetChatbotResponse("hello");
      const welcomeMessage = (
        <BotMessage key={0} fetchMessage={() => response} />
      );
      setMessages([welcomeMessage]);
    }
    loadWelcomeMessage();
  }, []);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const savedChatsFromStorage =
      JSON.parse(localStorage.getItem("savedChats")) || [];
    setSavedChats(savedChatsFromStorage);
  }, []);

  const send = async (text) => {
    if (text.trim() !== "") {
      const userMessage = <UserMessage key={messages.length} text={text} />;
      const botMessage = (
        <BotMessage
          key={messages.length + 1}
          fetchMessage={async () => await API.GetChatbotResponse(text)}
        />
      );
      const newMessages = messages.concat(userMessage, botMessage);
      setMessages(newMessages);
    }
  };

  const handleSaveChat = () => {
    if (messages.length > 1) {
      const newChat = {
        id: savedChats.length + 1,
        messages: messages.map((message) => {
          if (message.type === "bot") {
            return {
              type: "bot",
              text: message.props.fetchMessage.toString(),
            };
          } else {
            return {
              type: "user",
              text: message.props.text,
            };
          }
        }),
      };
      const updatedSavedChats = [...savedChats, newChat];
      setSavedChats(updatedSavedChats);
      localStorage.setItem("savedChats", JSON.stringify(updatedSavedChats));
    }
  };

  const handleDeleteChat = (chatToDelete) => {
    const updatedChats = savedChats.filter(
      (chat) => chat.id !== chatToDelete.id
    );
    setSavedChats(updatedChats);
    localStorage.setItem("savedChats", JSON.stringify(updatedChats));
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleChatSelect = (chat) => {
    const chatMessages = chat.messages.map((message, index) => {
      if (message.type === "bot") {
        return (
          <BotMessage
            key={index}
            fetchMessage={async () =>
              await API.GetChatbotResponse(message.text)
            }
          />
        );
      } else {
        return <UserMessage key={index} text={message.text} />;
      }
    });
    setMessages(chatMessages);
  };

  return (
    <div className="container">
      <div className="sidebar-div">
        <Sidebar
          savedChats={savedChats}
          onChatSelect={handleChatSelect}
          onDeleteChat={handleDeleteChat}
        />
      </div>
      <div className="chatbot">
        <Header onSaveChat={handleSaveChat} onNewChat={handleNewChat} />
        <Messages messages={messages} />
        <Input onSend={send} />
      </div>
    </div>
  );
}

export default ChatBot;
