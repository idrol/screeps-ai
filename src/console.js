
export default {
    removeConstructionSites: function(roomName) {
        let room = Game.rooms[roomName];
        let construction_sites = room.find(FIND_CONSTRUCTION_SITES);
        construction_sites.forEach(construction_site => {
            construction_site.remove();
        })
    },
    removeStructures: function(structureType, roomName) {
        let room = Game.rooms[roomName];
        let structures = room.find(FIND_STRUCTURES, {
            filter: function (structure) {
                return structure.structureType === structureType;
            }
        });
        structures.forEach(structure => {
            structure.destroy();
        });
        return true;
    },
    resetBuilder: function(roomName) {
        delete Memory.rooms[roomName].builder;
    },
    pause: function() {
        Memory.pause = true;
    },
    resume: function() {
        Memory.pause = false;
    },
    enableDebug: function() {
        Memory.debug = true;
    },
    disableDebug: function() {
        Memory.debug = false;
    },
    killCreepsWithRole: function(roomName, role) {
        let room = Game.rooms[roomName];
        let creeps = room.find(FIND_MY_CREEPS, {
            filter: function (creep) {
                return creep.memory.role === role;
            }
        });
        creeps.forEach(creep => {
            creep.say("C Kill");
            creep.suicide();
        });
    }
}