const config = {
  app: {
    port: process.env.PORT || 3000,
  },
  db: {
    uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/contactbook",
  },
  jwtSecret: "lehoangkhang_123", // đổi bằng chuỗi ngẫu nhiên của bạn
};

module.exports = config;
