// loadserver.js - script for Windows PM2 to start runtime
//
// To register with PM2 on Windows (from cityteam-checkins directory):
//
//   pm2 start loadserver.js --name checkins --env production
//   pm2 save

const server = require("./dist/server");
