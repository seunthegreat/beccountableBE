const User = require("../models/user");

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


 
module.exports = { deleteUser, updateUser, getAllUsers,  getUserProfile };