# 🧠 QBCore Framework: TMG Mainframe Stabilized Core (`core.js`)

[![Architecture](https://img.shields.io/badge/Architecture-MongoDB%20Legacy%20Driver-blue.svg)]()
[![Stability](https://img.shields.io/badge/Stability-Fault--Tolerant-brightgreen.svg)]()
[![Security](https://img.shields.io/badge/Security-Atomic%20Protection%20Gate-red.svg)]()

Welcome to the **TMG Mainframe Stabilized Core** (`core.js`). This repository contains the foundational NoSQL driver integration for the TMG Mainframe ecosystem. It acts as the direct, fault-tolerant bridge between the FiveM server environment and the MongoDB cluster.

Standard SQL wrappers (and even basic NoSQL implementations) are prone to catastrophic failures: a single poorly formatted Lua query can crash the entire Node.js database driver, taking the server offline. The **TMG Mainframe Core** is engineered with an aggressive "Zero-Crash" philosophy, featuring automated query sanitization, atomic protection gates, and automated BSON indexing.

---

## 🏆 Why This Upgrade is Superior: The Architecture Leap

### 🛡️ The Atomic Protection Gate (`sanitizeUpdate`)
The most dangerous mistake a developer can make in MongoDB is executing an update without an atomic operator (like `$set` or `$inc`). Doing so will **remove the entire document**, replacing all saved data with just the single field provided.
* **Intelligent Interception:** The Mainframe intercepts every single `UpdateOne`, `UpdateMany`, and `UpdateAll` payload before it hits the database.
* **Auto-Correction:** The `sanitizeUpdate` function parses the object keys. If it detects that the developer forgot the `$set` operator (e.g., they passed `{ progress: 10 }`), the Mainframe dynamically wraps the payload into `{ "$set": { progress: 10 } }`.
* **Zero Data Loss:** This completely eliminates the risk of accidental document erasure caused by sloppy Lua scripting in downstream resources.

### 🧬 Bulletproof Query Serialization
Lua and JavaScript handle empty tables differently. A Lua `{}` often translates to a JavaScript `[]` (Array), which will instantly crash a MongoDB driver expecting a filter object.
* **Strict Type Enforcement:** Every read/write export (`FetchAll`, `CheckIfExists`, `Find`) forces the incoming query through a strict type-check: `(q && typeof q === 'object' && !Array.isArray(q)) ? q : {}`.
* **Crash Immunity:** If a broken script passes a `nil` value or an empty array to the database, the Mainframe autonomously corrects it to an empty BSON object, fulfilling the query safely rather than throwing a fatal Node.js exception.

### ⚡ Automated O(1) Index Injection
Relational SQL databases require manual schema building. If you forget an index, the server will lag as player counts rise.
* **Self-Optimizing Architecture:** The exact millisecond the Mainframe secures its connection to the MongoDB cluster, it executes automated index creations for the most heavily queried data points: `players.citizenid` and `player_vehicles.plate`.
* **Sub-Millisecond Lookups:** This guarantees that as your server scales to tens of thousands of character and vehicle documents, fetching a player's profile or checking car ownership remains a lightning-fast `O(1)` operation.

### 🔄 Unified Batch Processors
* **`performUpdateMany` Handler:** Standardizes how massive batch updates (like the botanical chronometer or vehicle restart scripts) are processed. It catches internal Promise rejections and safely returns a `false` boolean to Lua, ensuring the FiveM server thread never hangs waiting for a dead database callback.

---

## 📊 Technical Comparison Matrix

| Feature / Metric | Standard MongoDB Scripting | TMG Stabilized Core (`core.js`) |
| :--- | :--- | :--- |
| **Missing `$set` Operator** | **Removes entire document** | Autonomously wrapped & saved |
| **Empty Lua Table `{}`** | Crashes Node.js Driver | Safely cast to Object `{}` |
| **Query Error Handling** | Unhandled Promise Rejections | Try/Catch with Safe Booleans |
| **Index Management** | Manual (Compass/CLI) | Auto-Injected on Startup |
| **Upsert Logic** | Requires complex syntax | Streamlined `SaveToCollection` |

---

## 🛠️ The Mainframe Core API

This file establishes the global baseline for all TMG database interactions.

### 📥 Read Operations
* `exports['tmgnosql']:FetchOne(col, query)`: Retrieves a single document safely.
* `exports['tmgnosql']:FetchAll(col, query)`: Returns an array of all matching documents (automatically sanitizes array inputs).
* `exports['tmgnosql']:CheckIfExists(col, query)`: High-performance `countDocuments` check with a limit of 1.

### 📤 Write Operations
* `exports['tmgnosql']:UpdateOne(col, filter, update, options)`: Modifies a single document through the Atomic Protection Gate.
* `exports['tmgnosql']:UpdateMany(col, filter, update, options)`: Processes thousands of documents simultaneously.
* `exports['tmgnosql']:SaveToCollection(col, filter, data)`: The ultimate "Upsert" wrapper—updates if the document exists, inserts if it doesn't, automatically enforcing `$set`.

---

## ⚙️ Installation & Requirements

1. **Environment:** Designed for the Node.js runtime within the FiveM server architecture.
2. **Dependencies:** Requires the legacy `mongodb` package (`const MongoDB = require('mongodb')`). Ensure your `package.json` reflects the correct driver version.
3. **Initialization:** This file must be loaded first in your `fxmanifest.lua` `server_scripts` array to ensure the `db` variable and global connection states are established before `main.js` or `bridge.js` attempt queries.

## 🤝 Credits & Licensing
* **NoSQL Architecture & Stabilized Driver Refactor:** TMG Mainframe Team
* **License:** GPL-3.0

---
*Disclaimer: This is a highly modified, fault-tolerant database core designed exclusively for the TMG Mainframe ecosystem. Do not replace standard SQL drivers with this without fully understanding the BSON document architecture.*