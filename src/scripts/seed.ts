/**
 * Seed Script (Plain JavaScript — no TypeScript needed)
 *
 * 1. Make sure your server is STOPPED before running this
 * 2. Run from your project root:
 *      node src/scripts/seed.js
 */

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// ── Config ────────────────────────────────────────────────────────────────────
const MONGO_URI = 'mongodb://localhost:27017/blackandwhiteDB'
const DB_NAME   = 'blackandwhiteDB'

// SupportRole enum values
const SupportRole = {
    SUPER_ADMIN : 0,
    ADMIN       : 1,
    MANAGER     : 2,
    SUPPORT     : 3,
}

// ── Schema ────────────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
    {
        name      : { type: String,  required: true, trim: true },
        email     : { type: String,  required: true, unique: true, lowercase: true, trim: true },
        password  : { type: String,  required: true },
        role      : { type: Number,  enum: [0, 1, 2, 3], default: SupportRole.SUPPORT },
        isActive  : { type: Boolean, default: true },
        lastLogin : { type: Date },
    },
    { timestamps: true }
)

const UserModel = mongoose.model('User', userSchema)

// ── Users to seed ─────────────────────────────────────────────────────────────
const SEED_USERS = [
    {
        name     : 'Super Admin',
        email    : 'digital@blacknwhite.agency',
        password : 'blacknwhite@2025',
        role     : SupportRole.SUPER_ADMIN,
        isActive : true,
    },
    {
        name     : 'Admin User',
        email    : 'admin@blackandwhite.com',
        password : 'Admin@1234',
        role     : SupportRole.ADMIN,
        isActive : true,
    },
]

// ── Main ──────────────────────────────────────────────────────────────────────
async function seed() {
    console.log('\n--- SEED SCRIPT STARTED ---')

    try {
        console.log(`Connecting to MongoDB: ${MONGO_URI}  dbName: ${DB_NAME}`)
        await mongoose.connect(MONGO_URI, { dbName: DB_NAME })
        console.log('Connected!\n')
    } catch (err) {
        console.error('FAILED to connect to MongoDB:', err.message)
        console.error('Make sure MongoDB is running on localhost:27017')
        process.exit(1)
    }

    for (const data of SEED_USERS) {
        try {
            const existing = await UserModel.findOne({ email: data.email })

            if (existing) {
                console.log(`SKIP — already exists: ${data.email}`)
                continue
            }

            const hashed = await bcrypt.hash(data.password, 10)
            const created = await UserModel.create({ ...data, password: hashed })

            console.log(`CREATED — ${created.email}  role: ${data.role}  id: ${created._id}`)
        } catch (err) {
            console.error(`ERROR creating ${data.email}:`, err.message)
        }
    }

    console.log('\n--- SEED COMPLETE ---')
    console.log('Login credentials for Postman:')
    console.log('  POST http://localhost:5000/api/user/login')
    console.log('  Body: { "email": "superadmin@blackandwhite.com", "password": "Admin@1234" }')

    await mongoose.disconnect()
    console.log('Disconnected. Done.')
    process.exit(0)
}

seed()