const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Hardcoded users for hackathon (Passwords will be hashed on load)
let users = [
    { id: 1, username: 'admin', rawPassword: 'admin123', role: 'Admin' },
    { id: 2, username: 'rescue', rawPassword: 'rescue123', role: 'Rescue Team' },
    { id: 3, username: 'doctor', rawPassword: 'doctor123', role: 'Doctor' }
];

// Hash passwords at startup
(async () => {
    for (let u of users) {
        u.password = await bcrypt.hash(u.rawPassword, 10);
    }
})();

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password required' });
        }

        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error(`[Auth] Login Error: ${error.message}`);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = { login };
