const admin = require('firebase-admin');
const { load } = require('../util/jsonPersist');

// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
// });

module.exports.send = (title, body, from, to, callback) => {
  const allUsers = load();
  const toUsers = allUsers.filter(u => to.includes(u.id));
  const fromUser = allUsers.find(u => u.id === from);
  sendMessage(title, body, fromUser, toUsers, callback);
  // toUsers.forEach(u => sendMessage(title, body, fromUser, u));
};

const sendMessage = async (title, body, fromUser, toUsers, callback) => {
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

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log(`${response.successCount} messages were sent successfully`);
    callback({
      message: `${response.successCount} messages were sent successfully`,
      successCount: response.successCount,
      success: true,
    });
  } catch (error) {
    callback({
      message: `Error sending message:`,
      error: error,
      successCount: 0,
      success: false,
    });
  }
};
