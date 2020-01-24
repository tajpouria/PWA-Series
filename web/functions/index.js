const functions = require("firebase-functions");
const admin = require("firebase-admin");
const corse = require("cors")({ origin: true });

admin.initializeApp(functions.config().firebase);

exports.newPost = functions.https.onRequest((request, response) => {
  corse(request, response, async () => {
    try {
      const { id, title, location, image } = request.body;

      if (!id || !title || !location || !image) {
        return response.status(400).send("Bad request!");
      }

      await admin
        .database()
        .ref("/posts")
        .push({ id, title, location, image });

      return response.status(201).json({ id });
    } catch (err) {
      return response.status(500).send("Internal server error!");
    }
  });
});
