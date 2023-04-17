const User = require("../models/user");

const generateMemberId = () => {
  //-- Function to generate a unique memberId --//
  const randomString = Math.random().toString(36).substring(2, 8);
  return `MID-${randomString}`;
}

const createUser = async (req, res) => {
  try {
    const { email, password, name, avi, referralCode, bio } = req.body;
  
    //-- Check that all required fields are present --//
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
       return res.status(409).json({ error: 'User already exists' });
    }
  
    //-- Create new user object with provided fields --//
    const memberId = generateMemberId(); // Function to generate unique memberId
    const user = new User({ email, password, name, avi, referralCode, bio, memberId });
    //-- Save new user to database --//
    const savedUser = await user.save();

    //-- Create a new object with the necessary user fields --//
    const userProfile = {
      email: savedUser.email,
      name: savedUser.name,
      avi: savedUser.avi,
      bio: savedUser.bio,
      memberId: savedUser.memberId
    };
  
    return res.status(201).json(userProfile);
  } catch (error) {
    //-- Handle any errors that occur during the try block with a 500 status code --//
    return res.status(500).json({ message: 'Something went wrong', error: error});
  }
};


const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { email, password, name, avi, referralCode, bio } = req.body;
  
    //-- Checks if user exists --//
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
    //-- Update user --//
    user.email = email || user.email;
    user.password = password || user.password;
    user.name = name || user.name;
    user.avi = avi || user.avi;
    user.referralCode = referralCode || user.referralCode;
    user.bio = bio || user.bio;
    const updatedUser = await user.save();
  
    return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    //-- Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await user.remove();
    
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
 }
};

const getUserProfile = async (req, res) => {
  try {
    //-- Get the user ID from the request object --//
    const userId = req.params.id;
      
    //-- Find the user in the database by ID --//
    const user = await User.findById(userId);
  
    //-- If the user is not found, return a 404 error --//
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    //-- If the user is found, return the user profile information --//
    const userProfile = {
      id: user._id,
      email: user.email,
      name: user.name,
      avi: user.avi,
      referralCode: user.referralCode,
      bio: user.bio,
    };
    
      return res.json(userProfile);
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
  };
 
module.exports = { createUser, deleteUser, updateUser, getAllUsers,  getUserProfile };