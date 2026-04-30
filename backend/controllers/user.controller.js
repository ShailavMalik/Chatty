import User from "../models/user.model.js";
import buildAnimeProfilePic from "../utils/buildAnimeProfilePic.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    const usersToBackfill = filteredUsers.filter((user) => !user.profilePic);
    if (usersToBackfill.length > 0) {
      await Promise.all(
        usersToBackfill.map((user) => {
          user.profilePic = buildAnimeProfilePic({
            gender: user.gender,
            username: user.username,
          });
          return user.save();
        }),
      );
    }

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
