# Idrols screeps ai

This repository is a WIP rewrite of my screeps AI.  

## Setup
### Short version
```
npm install
npm run build
```

## How it works

##Systems
- Spawner
    - Reads jobs from queue and spawns from queue
- Room manager
    - Manages a room with active controller  
      Keeps 6 pioneers alive under RCL 3  
      After RCL 3 starts running builder and job handler.
- Job Handler
    - Active after RCL 3  
      After RCL 3 detects appropriate jobs and spawn required role.
- Builder
    - Scans rooms and builds roads to improve speeds.  
      Makes sure that required builder creeps are alive when constriction sites exists.  
    - 1 creep for extensions  
    - 1 creep for upgrade containers  
    - 2 creep for roads  

## Roles
- Pioneer
    - Versatile role that builds up room to RCL 3
      First mines the refills spawn and then builds after that upgrades.  
      Only used until RCL 3
### Used after RCL 3
- Miner
    - Dedicated miner that mines and puts content into container for hauler to distribute.
- Hauler
    - Hauls resources from mining containers to spawn and then to upgrade containers.
- Builder
    - Spawned on demand to build construction sites.
- Uppgrader
    - Takes resources from a container and upgrades controller.
    
