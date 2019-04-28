import spawner from "./spawner"
import pioneer from "../roles/pioneer"

export default {
    initialize: function(room) {
        Memory.rooms[room.name].outpost = {
            spawnQueuedPioneers: "unused"
        };
    },
    isUninitialized: function(room) {
        return typeof Memory.rooms[room.name].outpost === 'undefined';
    },
    spawnPioneer: function(room) {
        spawner.queueSpawn(room, [WORK, MOVE, CARRY], {role: "pioneer", working: false, spawnWasFull: false}, "pioneerCreated", "pioneerCreationFailed");
        Memory.rooms[room.name].outpost.spawnQueuedPioneers++;
    },
    pioneerCreated: function(room, creepName) {
        console.log("Pioneer " + creepName + " was spawned in " + room.name);

    },
    pioneerCreationFailed: function(room, error) {

    },
    initializeCallback: function() {
        Memory.callbacks["pioneerCreated"] = this.pioneerCreated;
        Memory.callbacks["pioneerCreationFailed"] = this.pioneerCreationFailed;
    },
    run: function (room) {
        if(this.isUninitialized(room)) this.initialize(room);

        let creeps = room.find(FIND_MY_CREEPS, {
            filter: function(creep) {
                return creep.memory.role === "pioneer";
            }
        });
        let pioneerCount = creeps.length;
        let pioneersToSpawn = 6 - pioneerCount - spawner.getQueuedCreepsByRoleCount(room, "pioneer");
        if(pioneersToSpawn > 0) {
            for(let i = 0; i < pioneersToSpawn; i++) {
                this.spawnPioneer(room);
            }
        }
        creeps.forEach(pioneerCreep => {
            pioneer.run(pioneerCreep);
        });
    }
}