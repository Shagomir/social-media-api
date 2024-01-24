const { Thought, User } = require("../models");
const { MongoClient, ObjectId } = require("mongodb");

module.exports = {
  // Function to get all of the thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Gets a single thought using the findOneAndUpdate method.
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Creates a new thought. Accepts a request body with the entire thought object.
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: Thought._id } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: "Thought created, but found no user with that ID",
        });
      }

      res.json("Created the thought 🎉");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Updates and thought using the findOneAndUpdate method.
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: "No thought with this id!" });
      }

      res.json(thought);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Deletes a thought from the database. Looks for a thought by ID.
  // Then if the thought exists, we look for any users associated with the thought based on he thought ID and update the thoughts array for the User.
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndRemove({
        _id: req.params.thoughtId,
      });

      if (!thought) {
        return res.status(404).json({ message: "No Thought with this id!" });
      }

      const deleteFromUser = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      if (!deleteFromUser) {
        return res.status(404).json({
          message: "Thought Deleted, but unable to find user",
        });
      }

      res.json({ message: "Thought successfully deleted!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Adds a Reaction to a thought.
  async addReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: new ObjectId(req.params.thoughtId) },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: "No thought with this id!" });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Remove thought Reaction. This method finds the thought based on ID. It then updates the reactions array associated with the thought in question by removing it's reactionId from the reactions array.
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: new ObjectId(req.params.thoughtId) },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: "No thought with this id!" });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
