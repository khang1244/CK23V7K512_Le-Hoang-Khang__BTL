const { MongoClient } = require("mongodb");

class MongoDB {
  static async connect(uri) {
    if (this.client) return this.client;
    this.client = await MongoClient.connect(uri);
    this.db = this.client.db("contactbook"); // ép dùng đúng db ở đây
    return this.client;
  }
  static getDB() {
    return this.db; // trả về db đã set
  }
}

module.exports = MongoDB;
