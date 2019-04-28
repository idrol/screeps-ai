
export default {
    initialize: function(room) {
        Memory.rooms[room.name].spawner = {
            spawnQueue: []
        };
    },
    queueSpawn: function(room, body, memory, callback, failedCallback) {
        Memory.rooms[room.name].spawner.spawnQueue.push({
            body: body,
            memory: memory,
            callback: callback,
            failedCallback: failedCallback
        });
    },
    getQueuedCreepsByRoleCount: function(room, role) {
        let count = 0;
        Memory.rooms[room.name].spawner.spawnQueue.forEach(queueEntry => {
            if(queueEntry.memory.role === role) count++;
        });
        return count;
    },
    isUninitialized: function(room) {
        return typeof Memory.rooms[room.name].spawner === 'undefined';
    },
    isSpawnQueueEmpty: function(room) {
        return Memory.rooms[room.name].spawner.spawnQueue.length === 0;
    },
    run: function (room) {
        if(this.isUninitialized(room)) this.initialize(room);
        if(this.isSpawnQueueEmpty(room)) return;
        let spawn = room.find(FIND_MY_SPAWNS)[0];
        if(!spawn.spawning) {
            let creepSpawn = Memory.rooms[room.name].spawner.spawnQueue[0];
            let creepName = "creep" + Game.time;
            let dryRun = spawn.spawnCreep(creepSpawn.body, creepName, {
                memory: creepSpawn.memory,
                dryRun: true});
            if(dryRun === ERR_INVALID_ARGS) {
                console.log("Warning spawn object had invalid args removing. Role was " + creepSpawn.memory.role);
                Memory.rooms[room.name].spawner.spawnQueue.shift();
                console.log(creepSpawn.failedCallback);
                console.log(creepSpawn.callback);
                Memory.callbacks[creepSpawn.failedCallback](room, dryRun);
            }
            if(dryRun === OK) {
                spawn.spawnCreep(creepSpawn.body, creepName, {
                    memory: creepSpawn.memory,
                });
                Memory.callbacks[creepSpawn.callback](room, creepName);
                Memory.rooms[room.name].spawner.spawnQueue.shift(); // Remove first element
            }
        }
    }
}