const buildAnimeProfilePic = ({ gender, username }) => {
  const normalizedGender = gender === "female" ? "girl" : "boy";
  const avatarSeed = encodeURIComponent(username || "chatty-user");
  return `https://avatar.iran.liara.run/public/${normalizedGender}?username=${avatarSeed}`;
};

export default buildAnimeProfilePic;
