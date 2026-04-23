# TMGNoSQL - FiveM MongoDB Framework

A high-performance, NoSQL-based core for FiveM, replacing traditional SQL dependencies with a reactive MongoDB architecture.

## Installation
1. Install **MongoDB Community Server**.
2. Run `npm install` inside the `server/` folder of this resource.
3. Add the following to your `server.cfg`:
   ```cfg
   set mongodb_uri "mongodb://localhost:27017"
   set mongodb_db "TMG_Mainframe"
   ensure TMGNoSQL

## Development
Use exports['TMGNoSQL']:GetPlayer(source) to access the live Player Object.

VIDEO OF IT IN ACTION
https://www.youtube.com/watch?v=dl9AMzFIVg4
