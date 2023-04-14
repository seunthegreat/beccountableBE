const Fake = require('@faker-js/faker');
const User = require('../models/user');

//-- Generate 10 fake users --//
const users = Array.from({ length: 10 }, () => ({
  email: Fake.faker.internet.email(),
  password: Fake.faker.internet.password(),
  name: Fake.faker.name.fullName(),
  avi: Fake.faker.image.avatar(),
  referralCode: Fake.faker.random.alphaNumeric(6),
  bio: Fake.faker.lorem.sentence(),
  lastSeen: Fake.faker.date.recent(),
  role: 'user'
}));

//-- Save the users to the database --//
if (users.length > 0) {
    User.insertMany(users)
        .then(() => console.log('Mock users created!'))
        .catch((err) => console.log(err));
} else {
    console.log('No users to insert into the database.');
}

