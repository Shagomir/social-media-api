const { Schema, model } = require('mongoose');


// Schema to create Post model
const reactionSchema = new Schema(
  {
    thoughtText: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: Boolean,
      default: true,
    },
    reactions: {
      type: String,
      minLength: 15,
      maxLength: 500,
    },
    tags: [Tag],
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);


module.exports = reactionSchema;
