const axios = require('axios');
const { Floor, Backup } = require('../utils/models');

const analyzeSystem = async (req, res) => {
    try {
        const floors = await Floor.find().sort({ floorNumber: -1 });
        const latestBackup = await Backup.findOne().sort({ timestamp: -1 });
        const totalBackups = await Backup.countDocuments();

        let totalPeople = 0;
        let totalVentilator = 0;
        let totalWheelchair = 0;
        let totalWalk = 0;
        let criticalCount = 0;

        floors.forEach(f => {
            totalPeople += f.totalPeople;
            totalVentilator += f.ventilator;
            totalWheelchair += f.wheelchair;
            totalWalk += f.canWalk;
            if (f.ventilator > 0 || f.wheelchair > 0) criticalCount += (f.ventilator + f.wheelchair);
        });

        const prompt = `You are an AI assistant for a hospital disaster recovery system. A disaster has occurred.

Current hospital status:
${JSON.stringify(floors, null, 2)}

Total people inside: ${totalPeople}
Critical patients on ventilator: ${totalVentilator}
Patients needing wheelchair: ${totalWheelchair}
Patients who can walk: ${totalWalk}
Total backups secured: ${totalBackups}

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "healthScore": number 0-100,
  "systemHealth": "Good" or "Warning" or "Critical",
  "riskLevel": "Low" or "Medium" or "High" or "Critical",
  "summary": "2 sentence explanation",
  "rescueOrder": [
    {
      "floor": number,
      "ward": "string",
      "reason": "string",
      "action": "string",
      "teamsNeeded": number
    }
  ],
  "recommendations": [
    "string", "string", "string"
  ],
  "disasterReadiness": "percentage string",
  "recoveryPriority": "string",
  "estimatedRTO": "string",
  "aiInsight": "string",
  "resourcesNeeded": {
    "oxygenUnits": number,
    "stretchers": number,
    "rescueTeams": number
  }
}`;

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

        let analysisData;

        try {
            const response = await axios.post(url, {
                contents: [{ parts: [{ text: prompt }] }]
            });

            const text = response.data.candidates[0].content.parts[0].text;
            const jsonMatch = text.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
                analysisData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No valid JSON extracted from Gemini response');
            }

        } catch (geminiError) {
            console.warn(`[AI Warning] Gemini API failed or formatting issue. Falling back to calculated defaults. Message: ${geminiError.message}`);

            // Fallback response with real calculated numbers if AI call fails
            analysisData = {
                healthScore: totalVentilator > 5 ? 45 : 85,
                systemHealth: totalVentilator > 5 ? 'Critical' : 'Good',
                riskLevel: totalVentilator > 5 ? 'High' : 'Low',
                summary: `The hospital is managing ${totalPeople} total patients, with ${totalVentilator} requiring critical ventilator support. Immediate evacuation focus should be on the highest priority floors.`,
                rescueOrder: floors.filter(f => f.priority === 'HIGH').map(f => ({
                    floor: f.floorNumber,
                    ward: f.wardName,
                    reason: 'Critical patients located here',
                    action: 'Deploy emergency transport',
                    teamsNeeded: Math.ceil((f.ventilator + f.wheelchair) / 2) || 1
                })),
                recommendations: [
                    'Prioritize immediate power redundancy for all ventilators',
                    'Deploy specialized rescue teams to HIGH priority floors',
                    'Prepare staging area for walking wounded'
                ],
                disasterReadiness: '80%',
                recoveryPriority: 'Critical Care DB / Patient Records',
                estimatedRTO: '< 3 sec',
                aiInsight: 'Calculated using real-time local logic formulas due to AI API unavailability.',
                resourcesNeeded: {
                    oxygenUnits: totalVentilator * 3,
                    stretchers: totalVentilator + totalWheelchair,
                    rescueTeams: Math.ceil(criticalCount / 4) || 2
                }
            };
        }

        res.json({ success: true, analysis: analysisData });

    } catch (error) {
        console.error(`[AI System Error] ${error.message}`);
        res.status(500).json({ success: false, message: 'Failed to complete AI System Analysis' });
    }
};

module.exports = { analyzeSystem };
