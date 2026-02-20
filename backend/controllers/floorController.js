const { Floor } = require('../utils/models');

const defaultFloors = [
    { floorNumber: 6, wardName: 'Pediatric Ward', totalPeople: 18, ventilator: 3, wheelchair: 5, canWalk: 10, priority: 'HIGH', safeExit: 'East Staircase', blockedExit: 'West Staircase' },
    { floorNumber: 5, wardName: 'Maternity Ward', totalPeople: 15, ventilator: 0, wheelchair: 2, canWalk: 13, priority: 'HIGH', safeExit: 'West Staircase', blockedExit: 'South Exit' },
    { floorNumber: 4, wardName: 'Surgery Ward', totalPeople: 12, ventilator: 0, wheelchair: 7, canWalk: 5, priority: 'MEDIUM', safeExit: 'North Staircase', blockedExit: 'None' },
    { floorNumber: 3, wardName: 'General Ward', totalPeople: 35, ventilator: 0, wheelchair: 5, canWalk: 30, priority: 'LOW', safeExit: 'Any Staircase', blockedExit: 'None' },
    { floorNumber: 2, wardName: 'ICU', totalPeople: 8, ventilator: 8, wheelchair: 0, canWalk: 0, priority: 'HIGH', safeExit: 'West Staircase', blockedExit: 'East Staircase' },
    { floorNumber: 1, wardName: 'Emergency Ward', totalPeople: 20, ventilator: 2, wheelchair: 8, canWalk: 10, priority: 'MEDIUM', safeExit: 'Main Exit', blockedExit: 'None' }
];

const getAllFloors = async (req, res) => {
    try {
        let floors = await Floor.find().sort({ floorNumber: -1 });

        // Seed database if empty
        if (floors.length === 0) {
            console.log('[Floor Controller] Database empty. Seeding initial floor data.');
            await Floor.insertMany(defaultFloors);
            floors = await Floor.find().sort({ floorNumber: -1 });
        }

        res.json({ success: true, count: floors.length, floors });
    } catch (error) {
        console.error(`[Floor Read Error] ${error.message}`);
        res.status(500).json({ success: false, message: 'Failed to fetch floor data' });
    }
};

const updateFloor = async (req, res) => {
    try {
        const { floorNumber } = req.params;
        let updates = req.body;

        // Retrieve old state entirely just to be safe if client sends partial update
        const existing = await Floor.findOne({ floorNumber: parseInt(floorNumber) });
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Floor not found' });
        }

        const vent = updates.ventilator !== undefined ? updates.ventilator : existing.ventilator;
        const wheel = updates.wheelchair !== undefined ? updates.wheelchair : existing.wheelchair;
        const walk = updates.canWalk !== undefined ? updates.canWalk : existing.canWalk;

        // Recalculate Totals
        updates.totalPeople = vent + wheel + walk;

        // Recalculate Priorities
        if (vent > 0) {
            updates.priority = 'HIGH';
        } else if (wheel > 0) {
            updates.priority = 'MEDIUM';
        } else {
            updates.priority = 'LOW';
        }

        updates.lastUpdated = new Date();

        const updatedFloor = await Floor.findOneAndUpdate(
            { floorNumber: parseInt(floorNumber) },
            { $set: updates },
            { new: true }
        );

        res.json({ success: true, message: 'Floor updated successfully', floor: updatedFloor });
    } catch (error) {
        console.error(`[Floor Update Error] ${error.message}`);
        res.status(500).json({ success: false, message: 'Failed to update floor data' });
    }
};

module.exports = { getAllFloors, updateFloor };
