const { Schema, model } = require("mongoose");
const crypto = require("crypto");
const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      lowercase: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
    },
    img: { type: String, default: "" },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: String,
      default: "Normal",
    },
    reset_pass_link: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
//Virtual Password
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

//Methods
userSchema.methods = {
  //Generate salt
  authenticate: function (plainPassword) {
    return this.encryptPassword(plainPassword) === this.hashed_password;
  },
  //Encrypt password
  encryptPassword: function (password) {
    if (!password) return "Somthing happened with";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return err;
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
  //compare password
};

module.exports = model("Users", userSchema);
