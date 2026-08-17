export const BODY_PRESETS = {

    custom: {
        category: 'custom',
        name: 'Custom Body',
        mass: 1,
        radius: 0.5,
        color: '#44aaff'
    },


    // =========================================
    // SOLAR SYSTEM
    // =========================================

    mercury: {
        category: 'planet',
        name: 'Mercury',
        mass: 0.000000166,
        radius: 0.00350,
        color: '#9c9188'
    },

    venus: {
        category: 'planet',
        name: 'Venus',
        mass: 0.00000245,
        radius: 0.00869,
        color: '#d8b36a'
    },

    earth: {
        category: 'planet',
        name: 'Earth',
        mass: 0.00000300,
        radius: 0.00916,
        color: '#3498db'
    },

    moon: {
        category: 'moon',
        name: 'Moon',
        mass: 0.0000000369,
        radius: 0.00250,
        color: '#bfc3c7'
    },

    mars: {
        category: 'planet',
        name: 'Mars',
        mass: 0.000000323,
        radius: 0.00487,
        color: '#c65f3d'
    },

    jupiter: {
        category: 'planet',
        name: 'Jupiter',
        mass: 0.000954,
        radius: 0.1005,
        color: '#d6a76c'
    },

    saturn: {
        category: 'planet',
        name: 'Saturn',
        mass: 0.000286,
        radius: 0.0837,
        color: '#d9c28c'
    },

    uranus: {
        category: 'planet',
        name: 'Uranus',
        mass: 0.0000437,
        radius: 0.0365,
        color: '#82d8df'
    },

    neptune: {
        category: 'planet',
        name: 'Neptune',
        mass: 0.0000515,
        radius: 0.0354,
        color: '#4169d8'
    },


    // =========================================
    // STARS
    // =========================================

    sun: {
        category: 'star',
        name: 'Sun',
        mass: 1,
        radius: 1,
        color: '#ffaa00'
    },

    proximaCentauri: {
        category: 'star',
        name: 'Proxima Centauri',
        mass: 0.122,
        radius: 0.154,
        color: '#ff6d4a'
    },

    siriusA: {
        category: 'star',
        name: 'Sirius A',
        mass: 2.06,
        radius: 1.71,
        color: '#dce9ff'
    },

    polaris: {
        category: 'star',
        name: 'Polaris',
        mass: 5.4,
        radius: 37.5,
        color: '#fff0cc'
    },

    betelgeuse: {
        category: 'star',
        name: 'Betelgeuse',
        mass: 16.5,
        radius: 764,
        color: '#ff5a36'
    },


    // =========================================
    // COMPACT OBJECTS
    // =========================================

    whiteDwarf: {
        category: 'compact',
        name: 'White Dwarf',
        mass: 0.6,
        radius: 0.012,
        color: '#e7f3ff'
    },

    neutronStar: {
        category: 'compact',
        name: 'Neutron Star',
        mass: 1.4,
        radius: 0.000014,
        color: '#cceaff'
    },

    heavyNeutronStar: {
        category: 'compact',
        name: 'Heavy Neutron Star',
        mass: 2.1,
        radius: 0.000017,
        color: '#d9f4ff'
    },


    // =========================================
    // BLACK HOLES
    // =========================================

    stellarBlackHole: {
        category: 'blackHole',
        name: 'Stellar Black Hole',
        mass: 10,
        radius: 0.000042,
        color: '#050505'
    },

    intermediateBlackHole: {
        category: 'blackHole',
        name: 'Intermediate Black Hole',
        mass: 1000,
        radius: 0.00424,
        color: '#050505'
    },

    sagittariusA: {
        category: 'blackHole',
        name: 'Sagittarius A*',
        mass: 4300000,
        radius: 18.2,
        color: '#050505'
    },

    supermassiveBlackHole: {
        category: 'blackHole',
        name: 'Supermassive Black Hole',
        mass: 100000000,
        radius: 424,
        color: '#050505'
    }
};


// =============================================
// GET PRESET
// =============================================

export function getBodyPreset(key) {

    return (
        BODY_PRESETS[key] ||
        BODY_PRESETS.custom
    );
}