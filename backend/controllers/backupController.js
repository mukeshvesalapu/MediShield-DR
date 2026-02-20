const { Backup } = require('../utils/models');
const { sendAlert } = require('../utils/mailer');

const simulateHospitalData = () => {
    return {
        hospital: "City General Hospital",
        timestamp: new Date(),
        floors: [
            { floorNumber: 6, wardName: "Pediatric Ward", totalPeople: 18, ventilator: 3, wheelchair: 5, canWalk: 10, priority: "HIGH" },
            { floorNumber: 5, wardName: "Maternity Ward", totalPeople: 15, ventilator: 0, wheelchair: 2, canWalk: 13, priority: "HIGH" },
            { floorNumber: 4, wardName: "Surgery Ward", totalPeople: 12, ventilator: 0, wheelchair: 7, canWalk: 5, priority: "MEDIUM" },
            { floorNumber: 3, wardName: "General Ward", totalPeople: 35, ventilator: 0, wheelchair: 5, canWalk: 30, priority: "LOW" },
            { floorNumber: 2, wardName: "ICU", totalPeople: 8, ventilator: 8, wheelchair: 0, canWalk: 0, priority: "HIGH" },
            { floorNumber: 1, wardName: "Emergency Ward", totalPeople: 20, ventilator: 2, wheelchair: 8, canWalk: 10, priority: "MEDIUM" }
        ],
        totalPatients: 108,
        criticalCount: 13,
        resources: {
            oxygenCylinders: 12,
            stretchers: 8,
            wheelchairs: 15,
            flashlights: 20,
            firstAidKits: 10
        }
    };
};

const runBackup = async (req, res) => {
    try {
        const isManual = !!req; // true if triggered via HTTP request, false via CRON
        const snapshotId = `SNAP-${Date.now()}`;
        const hospitalData = simulateHospitalData();
        const mockSizeTB = (Math.random() * (1.5 - 0.8) + 0.8).toFixed(1); // random size between 0.8 and 1.5 TB

        const newBackup = new Backup({
            snapshotId,
            hospitalData,
            triggeredBy: isManual && req.user ? req.user.username : 'SYSTEM_SCHEDULER',
            size: parseFloat(mockSizeTB)
        });

        await newBackup.save();
        console.log(`[Backup] Success - ID: ${snapshotId}`);

        // Send Alert Notification
        await sendAlert(
            `Backup Successful - ${snapshotId}`,
            `A new disaster recovery snapshot [${snapshotId}] of City General Hospital was successfully stored.`
        );

        const result = { success: true, message: 'Backup created successfully', data: newBackup };
        if (res) return res.json(result);
        return result;

    } catch (error) {
        console.error(`[Backup Error] ${error.message}`);

        // Notification for failure
        await sendAlert(
            `CRITICAL: Backup Failed`,
            `The disaster recovery snapshot process encountered a failure: ${error.message}`
        );

        const result = { success: false, message: 'Backup failed to create' };
        if (res) return res.status(500).json(result);
        return result;
    }
};

const listBackups = async (req, res) => {
    try {
        const backups = await Backup.find().sort({ timestamp: -1 }).limit(15);
        res.json({ success: true, count: backups.length, backups });
    } catch (error) {
        console.error(`[Backup List Error] ${error.message}`);
        res.status(500).json({ success: false, message: 'Failed to fetch backups' });
    }
}

module.exports = { runBackup, listBackups };
