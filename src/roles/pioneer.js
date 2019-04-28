
export default {
    refillAndUpgrade: function(creep) {
        if(Memory.debug) creep.say("Pioneer");
        if(creep.memory.spawnWasFull) {
            let controller = creep.room.controller;

            if(creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(controller);
            }
        } else {

            let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: function (structure) {
                    let IsCorrectType = (structure.structureType === STRUCTURE_SPAWN
                        || structure.structureType === STRUCTURE_EXTENSION);
                    let HasRoom = (structure.energy < structure.energyCapacity);
                    return IsCorrectType && HasRoom;
                }
            });

            if (structure !== null) {
                let answer = creep.transfer(structure, RESOURCE_ENERGY);
                if (answer === ERR_NOT_IN_RANGE) {
                    creep.say("> " + structure.structureType);
                    creep.moveTo(structure);
                } else if (answer === ERR_FULL) {
                    console.log("Logic error in harvester tried to fill full spawn.");
                    creep.say("Whyyyy!!");
                    creep.memory.spawnWasFull = true;
                }
            } else {
                creep.memory.spawnWasFull = true;
            }
        }
    },
    run: function(creep) {
        if (creep.memory.working === true && creep.carry.energy === 0) {
            creep.memory.working = false;
        } else if (creep.memory.working === false && creep.carry.energy === creep.carryCapacity) {
            creep.memory.working = true;
        }

        if(!creep.memory.working) {
            creep.memory.spawnWasFull = false;
            let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
            return;
        }
        this.refillAndUpgrade(creep);
    }
}