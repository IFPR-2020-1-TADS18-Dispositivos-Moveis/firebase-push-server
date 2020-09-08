const express = require('express');
const router = express.Router();
const { store, load } = require('../util/jsonPersist');
const { send } = require('../firebase');

router.post('/register', function (req, res, next) {
  const { name, key } = req.body;
  const createdAt = Date.now();

  const id = store({ name, key, createdAt });

  res.json({ status: 'success', data: { id } });
});

router.post('/message', function (req, res, next) {
  const { title, body, from, to } = req.body;

  if (!title || !body || !from || !to)
    throw new Error(
      'You need to provide: title (string), body (string), from (your ID), to (list of IDs)'
    );

  send(title, body, from, to, response => {
    res.json({
      status: response.success ? 'success' : 'fail',
      message: response.message,
      data: response.success ? null : { error: response.error },
    });
  });
});

router.get('/users', function (req, res, next) {
  const users = load()
    .sort((u1, u2) => u2.createdAt - u1.createdAt)
    .map(u => ({ id: u.id, name: u.name }));

  res.json({ status: 'success', data: { users } });
});

module.exports = router;
