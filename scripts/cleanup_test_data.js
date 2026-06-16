const db = require('../config/db');

(async () => {
    try {
        // Find users with 'testuser' in their email
        const usersRes = await db.query("SELECT uid, email FROM users WHERE email ILIKE '%testuser%'");
        const users = usersRes.rows;

        for (const u of users) {
            console.log('Deleting posts by user', u.uid, u.email);
            await db.query('DELETE FROM posts WHERE creator = $1', [u.uid]);
            console.log('Deleting user', u.uid);
            await db.query('DELETE FROM users WHERE uid = $1', [u.uid]);
        }

        // Delete posts created during automated test by title
        const titles = ['Auto Test Post', 'Updated Title from Test'];
        for (const t of titles) {
            const r = await db.query('DELETE FROM posts WHERE title = $1 RETURNING pid', [t]);
            if (r.rowCount) console.log('Deleted posts with title', t);
        }

        console.log('Cleanup complete');
        process.exit(0);
    } catch (e) {
        console.error('Cleanup error', e);
        process.exit(1);
    }
})();
