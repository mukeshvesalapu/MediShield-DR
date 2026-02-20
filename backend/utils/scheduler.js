const cron = require('node-cron');
const { runBackup } = require('../controllers/backupController');

// Run backup every 2 minutes
cron.schedule('*/2 * * * *', async () => {
    console.log('[Scheduler] Triggering automatic 2-minute backup...');
    try {
        const result = await runBackup();
        if (result.success) {
            console.log(`[Scheduler] Backup Success: Snapshot ${result.data.snapshotId}`);
        } else {
            console.log(`[Scheduler] Backup Failed: ${result.message}`);
        }
    } catch (error) {
        console.error(`[Scheduler Error] ${error.message}`);
    }
});
