import pioneer from "../roles/pioneer";
import outpost from "./outpostManager";
import builder from "./roomBuilder";
import spawner from "./spawner";

export default {
    initialize: function() {
        Memory.rooms = {};
        Object.keys(Game.spawns).forEach(spawnName => {
            let spawn = Game.spawns[spawnName];
            let rcl = spawn.room.controller.level;
            let state = this.ROOM_OUTPOST;
            if(rcl > 3) state = this.ROOM_BASE;
            Memory.rooms[spawn.room.name] = {
                state: state
            }
        })
    },
    runRoom: function(room) {
        spawner.run(room);
        // Disable for now base not implemented
        //if(Memory.rooms[room.name].state === this.ROOM_OUTPOST) {
            outpost.run(room);
        //}
        builder.run(room);
    },
    run: function() {
        if(typeof Memory.rooms === 'undefined') {
            this.initialize();
        }
        Object.keys(Memory.rooms).forEach(roomName => {
            let room = Game.rooms[roomName];
            this.runRoom(room);
        })
    },

    // Room states
    ROOM_HARVEST: 0, // Room is being harvested by another room. Currently unused.
    ROOM_OUTPOST: 1,
    ROOM_BASE: 2
}