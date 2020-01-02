#!/usr/bin/env node
"use strict";

require("v8-compile-cache");

const fs = require("fs"),
  path = require("path");

const IDBORM = "idborm";
const IDBORM_UTILITY = `${IDBORM}-utility.js`;
const IMPORT_SCRIPT_CONTENT = `// ${IDBORM}: do not edit following line manually\r\nimportScripts('./${IDBORM_UTILITY}');\r\n`;

const args = require("minimist")(process.argv.slice(2));

process.once("uncaughtException", err => {
  console.error(IDBORM, err);
  process.exitCode = 2;
});

const swPath = args.serviceworker;

if (swPath) {
  // TODO: Copy then replace strategy

  fs.readFile(swPath, "utf8", (err, targetData) => {
    if (err) {
      console.error(IDBORM, err.message);
      process.exitCode = 2;
    }

    fs.writeFile(
      swPath,
      [IMPORT_SCRIPT_CONTENT, targetData].join("\n"),
      err => {
        if (err) {
          console.error(IDBORM, err.message);
          process.exitCode = 2;
        }

        console.info(`${IDBORM}: "${swPath}" modified successfully. ✔`);

        fs.readFile(
          path.resolve(__dirname, `../lib/${IDBORM_UTILITY}`),
          "utf8",
          (err, idbORMUtility) => {
            if (err) {
              console.error(IDBORM, err.message);
              process.exitCode = 2;
            }

            const swPathArr = swPath.split("/");
            swPathArr[swPathArr.length - 1] = IDBORM_UTILITY;
            const utilityPath = swPathArr.join("/");

            fs.writeFile(utilityPath, idbORMUtility, err => {
              if (err) {
                console.error(IDBORM, err.message);
                process.exitCode = 2;
              }

              console.info(
                `${IDBORM}: "${utilityPath}" created successfully. ✔`
              );
              process.exitCode = 0;
            });
          }
        );
      }
    );
  });
} else {
  console.error(
    `${IDBORM}: --serviceworker <path to your service worker> not specified correctly.`
  );
  process.exit(1);
}
