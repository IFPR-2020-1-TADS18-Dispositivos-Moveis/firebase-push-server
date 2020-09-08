const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const filePath = path.join(__dirname, '..', 'data', 'db.json');

module.exports.store = data => {
  const allData = this.load();
  let user = allData.find(u => u.key === data.key);
  if (user) {
    user.name = data.name;
  } else {
    user = { ...data, id: uuidv4() };
    allData.push(user);
  }

  try {
    fs.writeFileSync(filePath, JSON.stringify(allData));
    return user.id;
  } catch (err) {
    console.error(err);
  }
};

module.exports.load = () => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return [];
  }
};
