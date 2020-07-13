module.exports = {
  port: process.env.PORT,
  db: process.env.DBURL,
  timeToLive: process.env.TIME_TO_LIVE,
  maxAge: process.env.MAX_AGE,
  sessionSecret: process.env.SESS_SECRET,
  autoRemoveInterval: process.env.AUTO_REMOVE_INT
  };