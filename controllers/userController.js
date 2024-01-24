const { User, Thought } = require("../models");
const { MongoClient, ObjectId } = require("mongodb");

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId }).select(
        "-__v"
      );

      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a user and associated thoughts
  async deleteUser(req, res) {
    // const deletedUser = new ObjectId(req.params.userId);
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });
      console.log("user: ", user);
      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: "User and associated thoughts deleted!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Add a friend to a user
  async addFriend(req, res) {
    try {
      const userCheck = await User.findOne({
        userID: req.params.userID,
      });

      if (!userCheck) {
        return res.status(404).json({ message: "No User with this id!" });
      }

      const friend = await User.findOne({
        userId: req.params.userID,
      });

      // if (!friend) {
      //   return res.status(404).json({
      //     message: "Unable to add friend ID of User that does not exist",
      //   });
      // }

      const userUpdate = await User.updateOne(
        { UserID: req.params.userID },
        {
          $addToSet: {
            friends: { username: friend.username, email: friend.email },
          },
        },
        { new: true }
      );

      if (!userUpdate) {
        return res.status(404).json({
          message: "Unable to add friend as the user does not exist!",
        });
      }

      res.json({ message: "Friend successfully added!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a friend from a user
  async removeFriend(req, res) {
    try {
      const userCheck = await User.findOne({
        _id: new ObjectId(req.params.userID),
      });

      if (!userCheck) {
        return res.status(404).json({ message: "No User with this id!" });
      }

      const removeFriend = await User.updateOne(
        { _id: ObjectId(req.params.userID) },
        { $pull: { friends: new ObjectId(req.params.friendID) } },
        { new: true }
      );

      if (!removeFriend) {
        return res.status(404).json({
          message: "User does not have a friend with this ID",
        });
      }

      res.json({ message: "Friend successfully deleted!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
