import bcrypt from "bcryptjs";

import User from "../models/user.model.js";

import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({error: "Passwords don't match"});
    }

    const user = await User.findOne({email});
    
    if (user) {
      return res.status(400).json({error: "User already exists"});
    }
    
    const salt = await bcrypt.genSalt(10); // 해싱을 통해 비밀번호 해싱 추적을 어렵게
    const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			email,
			password: hashedPassword,
		});

    if (newUser) {

			const token = generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			res.status(201).json({
				token: token
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}

  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log("Error in signup controller", err.message);
  }
}

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		const token = generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			token: token
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const logout = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const deleteAccount = async (req, res) => {
	const userId = req.user._id;

	try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while deleting the account', error });
  }
};