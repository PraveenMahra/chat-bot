const API = {
  GetChatbotResponse: async (message) => {
    return new Promise(function (resolve) {
      if (message === "hello") resolve("Welcome to chatbot!");
      else resolve(message);
    });
  },
};

export default API;
