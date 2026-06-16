const db = require('../config/db');

(async () => {
  try {
    const r = await db.query('DELETE FROM users WHERE email = $1', ['tmpuser@example.com']);
    console.log('deleted count', r.rowCount);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
