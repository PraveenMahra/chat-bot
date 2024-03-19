const API = {
  GetChatbotResponse: async (message) => {
    return new Promise(function (resolve) {
      setTimeout(function () {
        if (message === "hello") resolve("Welcome to chatbot!");
        else resolve("Bot : " + message);
      }, 2000);
    });
  },
};

export default API;
