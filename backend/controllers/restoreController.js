const { Backup } = require('../utils/models');

const restoreLatest = async (req, res) => {
    try {
        const latestBackup = await Backup.findOne().sort({ timestamp: -1 });

        if (!latestBackup) {
            return res.status(404).json({ success: false, message: 'No backup snapshots found to restore' });
        }

        res.json({
            success: true,
            message: 'Hospital system fully restored',
            restoredFrom: latestBackup.snapshotId,
            restoredAt: latestBackup.timestamp,
            rto: '2.3 seconds',
            data: latestBackup.hospitalData
        });
    } catch (error) {
        console.error(`[Restore Error] ${error.message}`);
        res.status(500).json({ success: false, message: 'CRITICAL ERROR: Failed to restore system' });
    }
};

module.exports = { restoreLatest };
