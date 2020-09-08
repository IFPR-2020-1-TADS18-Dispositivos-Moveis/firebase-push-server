const admin = require('firebase-admin');
const { load } = require('../util/jsonPersist');

// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
// });

module.exports.send = (title, body, from, to) => {
  const allUsers = load();
  const toUsers = allUsers.filter(u => to.includes(u.id));
  const fromUser = allUsers.find(u => u.id === from);
  sendMessage(title, body, fromUser, toUsers);
  // toUsers.forEach(u => sendMessage(title, body, fromUser, u));
};

const sendMessage = (title, body, fromUser, toUsers) => {
  const tokens = toUsers.map(u => u.key);
  var message = {
    data: {
      title,
      body,
      fromName: fromUser.name,
      fromId: fromUser.id,
    },
    tokens,
  };
  console.log(message);

  admin
    .messaging()
    .sendMulticast(message)
    .then(response => {
      console.log(`${response.successCount} messages were sent successfully`);
    })
    .catch(error => {
      console.log('Error sending message:', error);
    });
};
