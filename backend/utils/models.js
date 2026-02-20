const mongoose = require('mongoose');

// MODEL 1: Backup
const backupSchema = new mongoose.Schema({
    snapshotId: String,
    timestamp: { type: Date, default: Date.now },
    triggeredBy: String,
    hospitalData: Object,
    size: Number,
    status: { type: String, default: 'success' }
});

// MODEL 2: Floor
const floorSchema = new mongoose.Schema({
    floorNumber: Number,
    wardName: String,
    totalPeople: Number,
    ventilator: Number,
    wheelchair: Number,
    canWalk: Number,
    priority: String,
    safeExit: String,
    blockedExit: String,
    lastUpdated: { type: Date, default: Date.now }
});

// MODEL 3: RescueLog
const rescueLogSchema = new mongoose.Schema({
    floorNumber: Number,
    action: String,
    teamName: String,
    timestamp: { type: Date, default: Date.now },
    peopleRescued: Number,
    notes: String
});

// MODEL 4: Alert
const alertSchema = new mongoose.Schema({
    type: String,
    message: String,
    floor: Number,
    timestamp: { type: Date, default: Date.now },
    resolved: { type: Boolean, default: false }
});

module.exports = {
    Backup: mongoose.model('Backup', backupSchema),
    Floor: mongoose.model('Floor', floorSchema),
    RescueLog: mongoose.model('RescueLog', rescueLogSchema),
    Alert: mongoose.model('Alert', alertSchema)
};
