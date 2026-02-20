const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { Backup, Floor } = require('../utils/models');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const totalBackups = await Backup.countDocuments();
        const latestBackup = await Backup.findOne().sort({ timestamp: -1 });
        const floors = await Floor.find();

        let totalPeople = 0;
        let criticalPatients = 0;

        floors.forEach(f => {
            totalPeople += f.totalPeople;
            criticalPatients += f.ventilator;
        });

        // Provide default hackathon numbers if db isn't seeded yet
        if (totalPeople === 0) {
            totalPeople = 108;
            criticalPatients = 13;
        }

        res.json({
            system: 'MediShield DR',
            status: 'operational',
            totalBackups: totalBackups,
            lastBackup: latestBackup ? latestBackup.timestamp : '-',
            uptime: process.uptime(),
            rpo: '2 minutes',
            rto: '< 3 seconds',
            totalPeople,
            criticalPatients,
            timestamp: new Date()
        });
    } catch (error) {
        console.error(`[Status Route Error] ${error.message}`);
        res.status(500).json({ success: false, message: 'Failed to retrieve system status' });
    }
});

module.exports = router;
