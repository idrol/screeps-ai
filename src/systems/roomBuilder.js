import spawner from "./spawner"
import builder from "../roles/builder"

export default {
    initialize: function(room) {
        Memory.rooms[room.name].builder = {
            lastRun: 0,
            buildingPlans: {}
        }
    },
    isUninitialized: function(room) {
        return typeof Memory.rooms[room.name].builder === 'undefined';
    },
    initializeCallbacks: function() {
        Memory.callbacks["roadWorkerCreated"] = this.roadWorkerCreated;
        Memory.callbacks["roadWorkerCreationFailed"] = this.roadWorkerCreationFailed;
    },
    positionContainsRoad: function(roomPosition) {
        let lookList = roomPosition.lookFor(LOOK_STRUCTURES);
        lookList.forEach(lookElement => {
            if(lookElement.structureType === STRUCTURE_ROAD) {
                return true;
            }
        });
        return false;
    },
    spawnRoadWorker: function(room) {
        spawner.queueSpawn(
            room,
            [WORK, MOVE, CARRY],
            {
                role: "builder",
                buildType: STRUCTURE_ROAD,
                working: false
            },
            "roadWorkerCreated",
            "roadWorkerCreationFailed"
        );
    },
    requestRoadBuilders: function(room) {

    },
    roadWorkerCreated: function(room, creepName) {
        console.log("Builder " + creepName + " was spawned in " + room.name);

    },
    roadWorkerCreationFailed: function(room, error) {

    },
    /**
     *
     * @param {Room} room
     * @param {RoomPosition} pos1
     * @param {RoomPosition} pos2
     */
    buildRoad: function(room, pos1, pos2, roadID) {
        if(typeof Memory.rooms[room.name].builder.buildingPlans[roadID] === 'undefined') {
            let path = pos1.findPathTo(pos2, {
                ignoreCreeps: true,
                ignoreRoads: true
            });
            path.forEach(pathElement => {
                pathElement.structureType = STRUCTURE_ROAD;
            });
            Memory.rooms[room.name].builder.buildingPlans[roadID] = path;
        }
    },

    ROAD_SPAWN_CONTROLLER: 0,
    ROAD_SOURCE1_SPAWN: 1,
    ROAD_SOURCE2_SPAWN: 2,
    ROAD_SOURCE3_SPAWN: 3,

    buildRoads: function(room) {
        //Spawn to controller
        let spawn = room.find(FIND_MY_SPAWNS)[0];
        let controller = room.controller;
        this.buildRoad(room, spawn.pos, controller.pos, this.ROAD_SPAWN_CONTROLLER);

        //Source to spawn
        let sources = room.find(FIND_SOURCES);
        for(let i = 0; i < sources.length; i++) {
            let source = sources[i];
            this.buildRoad(room, spawn.pos, source.pos, this.ROAD_SOURCE1_SPAWN+i);
        }
    },
    buildExtensionLeafLayer: function(room, startX, startY, buildLength, xDir, yDir) {
        for(let i = 0; i < buildLength; i++) {
            let offset = i;
            let xOffset = offset*xDir;
            let yOffset = (offset*yDir)-yDir;
            room.visual.circle(startX+xOffset, startY+yOffset);
            //let pos = new RoomPosition(, room.name);
        }
    },
    buildExtensions: function(room) {
        let spawn = room.find(FIND_MY_SPAWNS)[0];
        for(let i = 0; i < 4; i++) {
            this.buildExtensionLeafLayer(room, spawn.pos.x-1, spawn.pos.y-i*2, 1+(i*2), -1, 1);
        }
        for(let i = 0; i < 4; i++) {
            this.buildExtensionLeafLayer(room, spawn.pos.x+1, spawn.pos.y-i*2, 1+(i*2), 1, 1);
        }
        for(let i = 0; i < 4; i++) {
            this.buildExtensionLeafLayer(room, spawn.pos.x-1, spawn.pos.y+i*2, 1+(i*2), -1, -1);
        }
        for(let i = 0; i < 4; i++) {
            this.buildExtensionLeafLayer(room, spawn.pos.x+1, spawn.pos.y+i*2, 1+(i*2), 1, -1);
        }
    },
    checkBuildingPlans(room) {
        Object.keys(Memory.rooms[room.name].builder.buildingPlans).forEach(function (key) {
            let buildingPlan = Memory.rooms[room.name].builder.buildingPlans[key];
            buildingPlan.forEach(function (position) {
                let roomPosition = new RoomPosition(position.x, position.y, room.name);
                // TODO check for exisitng sturcture
                roomPosition.createConstructionSite(position.structureType);
            })
        })
    },
    run: function (room) {
        if(this.isUninitialized(room)) this.initialize(room);
        this.buildExtensions(room);
        this.buildRoads(room);
        this.checkBuildingPlans(room);

        let queuedBuilders = spawner.getQueuedCreepsByRoleCount(room, "builder");

        let creeps = room.find(FIND_MY_CREEPS, {
            filter: function(creep) {
                return creep.memory.role === "builder";
            }
        });

        let toSpawn = 2 - creeps.length - queuedBuilders;

        for(let i = 0; i < toSpawn; i++) {
            this.spawnRoadWorker(room);
        }

        creeps.forEach(creep => {
            builder.run(creep);
        });
    }
}