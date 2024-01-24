const { Schema, Types, model } = require("mongoose");

// Schema to create User model
const userSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      maxlength: 25,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email",
      },
      required: [true, "Email required"],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Create a virtual property `friendCount` that gets and sets the user's count of friends
userSchema
  .virtual("friendCount")
  // Getter
  .get(function () {
    return this.friends.length;
  });

// Initialize our User model
const User = model("User", userSchema);

module.exports = User;
