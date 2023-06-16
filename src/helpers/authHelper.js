const updateUserInfo = (user, firstName, lastName, hashedPwd) => {
  user.firstName = firstName;
  user.lastName = lastName;
  user.password = hashedPwd;
  user.profileProgress.completedSteps++;
  user.save();
};

const updateUserLocation = (user, location) => {
  user.location = location;
  user.profileProgress.completedSteps++;
  user.save();
};

const updateUserInterests = (user, interests) => {
  user.interests = interests;
  user.profileProgress.completedSteps++;
  user.save();
};

const updateBasicInfo = (user, dob, gender) => {
  user.dob = dob;
  user.gender = gender;
  user.profileProgress.completedSteps++;
  user.save();
};

const updateUserAviAndSocialMedia = (user, avi, socialMediaUrl, otp) => {
  user.avi = avi;
  user.socialMediaUrl = socialMediaUrl;
  user.profileProgress.completedSteps++;
  user.otp = otp;
  user.save();
  sendEmailWithOTP(user.firstName, user.email, otp);
};

module.exports = {
  updateUserInfo,
  updateUserLocation,
  updateUserInterests,
  updateBasicInfo,
  updateUserAviAndSocialMedia,
};
