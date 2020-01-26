require("dotenv/config");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const corse = require("cors")({ origin: true });
const webPush = require("web-push");
const uuid = require("uuid-v4");
const Bosboy = require("busboy");
const os = require("os");
const path = require("path");
const fs = require("fs");

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

      const uid = uuid();

      const busboy = new Bosboy({ headers: request.headers });
      let uploads;
      const fields = {};

      busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        const filePath = path.join(os.tmpdir());
        uploads = { file: filePath, type: mimetype };
        file.pipe(fs.createWriteStream(filePath));
      });

      busboy.on(
        "field",
        (
          fieldname,
          val,
          fieldnameTruncated,
          valTruncated,
          encoding,
          mimetype
        ) => {
          fields[fieldname] = val;
        }
      );

      busboy.on("finish", () => {
        const bucket = admin.storage().bucket("pwa-gram-7c869.appspot.com");
      });

      bucket.upload(
        uploads.file,
        {
          uploadType: "media",
          metadata: {
            metadata: {
              contentType: upload.type,
              firebaseStorageDownloadTokens: uid
            }
          }
        },
        async (err, uploadedFile) => {
          if (!err) {
            await admin
              .database()
              .ref("/posts")
              .push({
                id: fields.id,
                title: fields.title,
                location: fields.location,
                image:
                  "https://firebasestorage.googleapis.com/v0/b/" +
                  bucket.name +
                  "/o/" +
                  encodeURIComponent(uploadedFile.name) +
                  "?alt=media&token=" +
                  uid
              });

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

            return response.status(201).json({ id: fields.id });
          }
        }
      );

      busboy.end(request.rawBody);
    } catch (err) {
      return response.status(500).send("Internal server error!");
    }
  });
});
