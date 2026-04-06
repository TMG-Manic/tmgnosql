<<<<<<< Updated upstream
# tmgnosql
The core part of the TMG-Core Framework. (WIP)

Inspired by: https://github.com/nbredikhin/fivem-mongodb
=======
# 🧠 QBCore Framework: TMG NoSQL Mainframe Core (`tmgnosql`)

[![Architecture](https://img.shields.io/badge/Architecture-MongoDB%20%2F%20BSON-blue.svg)]()
[![Performance](https://img.shields.io/badge/Performance-Asynchronous%20Caching-brightgreen.svg)]()
[![Compatibility](https://img.shields.io/badge/Compatibility-QBCore%20Bridge-orange.svg)]()

Welcome to the **TMG NoSQL Mainframe Core**. This is the beating heart of the entire TMG Mainframe ecosystem. This resource completely replaces legacy relational SQL drivers (`oxmysql`, `ghmattimysql`) with a hyper-optimized, asynchronous **MongoDB Node.js Architecture**. 

By utilizing document-based BSON storage, atomic operators (`$inc`, `$set`, `$push`), and aggressive server-side RAM caching, the Mainframe eradicates database deadlocks, JSON truncation errors, and query timeouts that plague high-population FiveM servers.

---

## 🏆 Why This Upgrade is Superior: The Architecture Leap

### 🌉 The QBCore Translation Bridge (`bridge.js`)
Transitioning an entire framework from SQL to NoSQL usually requires rewriting thousands of files. The Mainframe solves this with the Translation Bridge.
* **Function Interception:** The bridge seamlessly hooks into `QBCore.Functions.GetPlayer` and overrides legacy logic. When a standard script calls `Player.Functions.SetMetaData`, the bridge translates this into an atomic BSON update.
* **Native Fallbacks:** Shared data (`QBCore.Shared.Items`, `Jobs`, `Gangs`) is globally cached and served natively, allowing standard QBCore resources to run alongside the NoSQL infrastructure without throwing "nil value" errors.

### 💾 Volatile Player Caching & Auto-Saves (`player.js`)
Standard QBCore saves player data constantly—every time an item moves, money changes, or metadata updates, a heavy SQL `UPDATE` query is fired, bottlenecking the server thread.
* **Object-Oriented RAM State:** When a player authenticates, their entire BSON profile is loaded into an active `TMGPlayer` object in server memory.
* **Dirty State Management:** Modifications simply flag the object as `isDirty = true`. A decentralized background loop sweeps through the RAM cache every 5 minutes (300,000ms), batch-saving only the modified profiles to the database natively.
* **Crash-Proof Disconnects:** If a player drops (`playerDropped`), the Mainframe instantly forces a localized save, ensuring zero rollback.

### 👻 "Ghost Profile" DB Saturation (`setup_db.js`)
Legacy QBCore hardcodes SQL checks (e.g., checking the `bans` table for active bans before letting a player join). If the SQL table is missing, the server halts.
* **The Mainframe Bypass:** On startup, the Mainframe executes a "Ghost Profile Saturation" pulse. It autonomously constructs the necessary MongoDB collections (`bans`, `players`) and injects a dummy `system_init` document.
* **Index Enforcement:** It automatically enforces unique BSON indexes (`citizenid: 1`, `id: 1`) to ensure data integrity matches standard SQL primary keys without the relational overhead.

### ⚡ Universal Asynchronous Exports (`main.js` & `database.js`)
* **Unified API:** Replaces messy SQL syntax with clean, Promise-based exports. Scripts simply call `exports['tmgnosql']:FetchOne` or `exports['tmgnosql']:UpdateMany`.
* **Bulletproof Queries:** Filter parsing ensures that if a script accidentally passes a nil query, the Mainframe safely converts it into a valid BSON object, preventing query crashes.

---

## 📊 Technical Comparison Matrix

| Feature / Metric | Legacy SQL Wrappers (`oxmysql`) | TMG NoSQL Mainframe |
| :--- | :--- | :--- |
| **Data Structure** | Relational Tables & `longtext` JSON | Schema-less BSON Documents |
| **Player Saves** | Sync/Async Overwrites (Constant) | Sweeping `isDirty` RAM Cache (5 min) |
| **Nested Updates** | Decode > Edit > Encode > Save | Atomic Dot-Notation (`$set: {"a.b": 1}`) |
| **QBCore Support** | Native Dependency | Transparent Interception Bridge |
| **Indexing** | Rigid Table Schemas | Dynamic Index Creation |

---

## 🛠️ The Mainframe Export API

To harness the power of the Mainframe in your own scripts, utilize these globally accessible exports:

### 📥 Data Retrieval
* `exports['tmgnosql']:FetchOne(collection, query, projection)`: Returns a single BSON document.
* `exports['tmgnosql']:FetchAll(collection, query)`: Streams a full array of matching documents.
* `exports['tmgnosql']:CheckIfExists(collection, query)`: Returns a high-speed boolean without downloading the document.

### 📤 Data Mutation
* `exports['tmgnosql']:InsertDocument(collection, data)`: Safely inserts a new document.
* `exports['tmgnosql']:UpdateOne(collection, filter, update)`: Uses atomic operators (`$inc`, `$set`) for targeted edits.
* `exports['tmgnosql']:SaveToCollection(collection, filter, data)`: Upserts (Updates if exists, Inserts if missing).
* `exports['tmgnosql']:BulkUpdate(collection, operations)`: Executes high-velocity batch updates.

### 🛡️ Core Utilities
* `exports['tmgnosql']:SaveBanNoSQL(license, data)`: Bypasses SQL to instantly blacklist an exploiter.
* `exports['tmgnosql']:BulkDeleteCharacter(citizenid)`: Surgically deletes a Citizen across 11 different collections instantly.

---

## ⚙️ Installation & Requirements

1. **MongoDB Engine:** You **MUST** install [MongoDB Community Server](https://www.mongodb.com/try/download/community) on your host machine.
2. **Node Dependencies:** Navigate to `resources/[tmg]/tmgnosql/server` and run:
   ```bash
   npm install
3. Server Configuration: Add the following Convars to your server.cfg BEFORE starting the resource:
```bash
set mongodb_uri "mongodb://localhost:27017"
set mongodb_db "TMG_Mainframe"

ensure tmgnosql
ensure qb-core
Note: tmgnosql must be started before QBCore to establish the bridge.
```

## 🤝 Credits & Licensing
* **Original Heist Logic:** [QBCore Framework Team](https://github.com/qbcore-framework)
* **NoSQL Architecture & Security Refactor:** TMG Mainframe Team
* **License:** GPL-3.0

---
*Disclaimer: This is a custom, highly modified NoSQL refactor and is not officially affiliated with or supported by the core QBCore Framework Team. Please do not submit issues regarding this version to the official QBCore repositories.*
>>>>>>> Stashed changes
