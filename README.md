# 🚀 TMGNoSQL - FiveM MongoDB Framework

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![FiveM](https://img.shields.io/badge/platform-FiveM-orange.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**TMGNoSQL** is a high-performance, NoSQL-based core for FiveM. It is designed to replace traditional, bottleneck-prone SQL dependencies with a reactive, scalable MongoDB architecture.

[View Demo Video](https://www.youtube.com/watch?v=dl9AMzFIVg4)

---

## ✨ Features
* **Reactive Architecture:** Real-time data handling without the overhead of relational queries.
* **High Performance:** Built for speed and horizontal scalability.
* **NoSQL Flexibility:** Easily modify data structures without complex migrations.
* **Developer Friendly:** Simple exports for quick integration into existing scripts.

---

## 🛠️ Installation

### 1. Prerequisites
* Install **[MongoDB Community Server](https://www.mongodb.com/try/download/community)**.
* Ensure you have **Node.js** installed for dependency management.

### 2. Setup
1. Clone the repository into your `resources` folder.
2. Navigate to the `server/` folder of the resource.
3. Open your terminal in that directory and run:
   ```bash
   npm install
   ```

3. Configuration
Add the following lines to your server.cfg:
```
set mongodb_uri "mongodb://localhost:27017"
set mongodb_db "TMG_Mainframe"
```
ensure TMGNoSQL

## 💻 Example Usage

### Inserting Data (Post to DB)
Using `TMGNoSQL` is straightforward. Here is an example of how to assign an apartment to a player using the `InsertOne` export.

```lua
local function CreateApartment(source, apartmentType, apartmentNumber)
    local Player = TMGCore.Functions.GetPlayer(source)
    local citizenid = Player.PlayerData.citizenid

    local apartmentData = {
        citizenid = citizenid,
        name = apartmentType,
        number = apartmentNumber,
        label = apartmentType .. " " .. apartmentNumber
    }

    -- TMGNoSQL Export
    exports['tmgnosql']:InsertOne('apartments', apartmentData)

    Player.Functions.SetMetaData("currentapartment", apartmentType)
    
    print("^5[TMG]^7 Mainframe: Apartment " .. apartmentData.label .. " assigned to " .. citizenid)
end
```
