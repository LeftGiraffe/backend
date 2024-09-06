import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
};

export default generateTokenAndSetCookie;
