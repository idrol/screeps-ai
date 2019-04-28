
export default {
    run: function (creep) {
        if(Memory.debug) creep.say("Builder");
        if (creep.memory.working === true && creep.carry.energy === 0) {
            creep.memory.working = false;
        }

        else if (creep.memory.working === false && creep.carry.energy === creep.carryCapacity) {
            creep.memory.working = true;
        }

        if(creep.memory.working) {
            // Builds assigned buildings first. After that finds any construction sites and helps out until end of life.
            let constructionSite = undefined;
            let preferedConstructionSites = creep.room.find(FIND_CONSTRUCTION_SITES, {
                filter: (s) => s.structureType === creep.memory.buildType
            });
            if(preferedConstructionSites.length > 0) {
                constructionSite = preferedConstructionSites[0];
            } else {
                constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            }
            if(constructionSite !== undefined) {
                if(creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSite);
                }
            }
        } else {
            let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
}