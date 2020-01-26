require("dotenv/config");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const corse = require("cors")({ origin: true });
const webPush = require("web-push");

const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

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

      // handling push notification
      webPush.setVapidDetails(
        "mailto:tajpouria4@gmail.com",
        PUBLIC_KEY,
        PRIVATE_KEY
      );

      const subs = await admin
        .database()
        .ref("/subs")
        .once("value");

      subs.forEach(sub => {
        pushConfig = sub.val();

        webPush.sendNotification(
          pushConfig,
          JSON.stringify({
            title: "New Post!",
            body: `${title} on ${location}`,
            image,
            data: {
              url: "/help"
            }
          })
        );
      });

      return response.status(201).json({ id });
    } catch (err) {
      return response.status(500).send("Internal server error!");
    }
  });
});
