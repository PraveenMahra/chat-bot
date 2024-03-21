import { useState, useEffect } from "react";
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

      const welcomeMessage = {
        type: "bot",
        text: response,
      };
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
      const userMessage = {
        type: "user",
        text,
      };
      const botMessage = {
        type: "bot",
        text: await API.GetChatbotResponse(text),
      };

      const newMessages = messages.concat(userMessage, botMessage);
      setMessages(newMessages);

      // Update saved chats
      const updatedSavedChats = savedChats.map((chat) => {
        if (JSON.stringify(chat.messages) === JSON.stringify(messages)) {
          return {
            ...chat,
            messages: newMessages.map((message) => ({ ...message })),
          };
        }
        return chat;
      });
      setSavedChats(updatedSavedChats);
      localStorage.setItem("savedChats", JSON.stringify(updatedSavedChats));
    }
  };

  const handleSaveChat = () => {
    if (messages.length > 1) {
      const existingChatIndex = savedChats.findIndex((chat) => {
        return JSON.stringify(chat.messages) === JSON.stringify(messages);
      });

      if (existingChatIndex !== -1) {
        const updatedChats = [...savedChats];
        updatedChats[existingChatIndex] = {
          ...updatedChats[existingChatIndex],
          messages: messages.map((message) => ({ ...message })),
        };
        setSavedChats(updatedChats);
        localStorage.setItem("savedChats", JSON.stringify(updatedChats));
      } else {
        const newChat = {
          id:
            savedChats.length > 0
              ? savedChats[savedChats.length - 1].id + 1
              : 1,
          messages: messages.map((message) => ({ ...message })),
        };
        const updatedSavedChats = [...savedChats, newChat];
        setSavedChats(updatedSavedChats);
        localStorage.setItem("savedChats", JSON.stringify(updatedSavedChats));
      }
    }
  };

  const handleDeleteChat = (chatToDelete) => {
    const updatedChats = savedChats.filter(
      (chat) => chat.id !== chatToDelete.id
    );
    setSavedChats(updatedChats);
    localStorage.setItem("savedChats", JSON.stringify(updatedChats));

    if (JSON.stringify(messages) === JSON.stringify(chatToDelete.messages)) {
      setMessages([]);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleChatSelect = (chat) => {
    setMessages(chat.messages.map((message) => ({ ...message }))); // Clone messages
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
