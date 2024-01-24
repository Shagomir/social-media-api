const { User, Thought } = require("../models");

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
  // Delete a user and associated apps
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

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
      const user = await User.findOne({
        _id: req.params.userID,
      });

      if (!user) {
        return res.status(404).json({ message: "No User with this id!" });
      }

      const friend = await User.findOneAndUpdate(
        { User: req.params.userID },
        { $addToSet: { friends: friend._id } },
        { new: true }
      );

      if (!friend) {
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
      const user = await User.findOne({
        _id: req.params.userID,
      });

      if (!user) {
        return res.status(404).json({ message: "No User with this id!" });
      }

      const friend = await User.findOneAndUpdate(
        { User: req.params.userID },
        { $pull: { friends: req.params.friendID } },
        { new: true }
      );

      if (!friend) {
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
