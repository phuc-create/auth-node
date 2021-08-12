const mongoose = require("mongoose");
const connectDB = async () => {
  const connect = await mongoose.connect(
    `mongodb+srv://phuc1492:${process.env.MONGO_DB_PASSWORD}@cluster0.ecxgu.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    }
  );

  console.log(`MongoDB connected at host ${connect.connection.host}`);
};
module.exports = connectDB;
