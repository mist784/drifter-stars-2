var DEFAULTS = {

    // dom canvas
    canvas: null,

    // settings
    particleCount: 32,
    flareCount: 32,
    motion: 0.05,
    particleColor: '#FDE8E1',
    flareColor: '#757575',
    linkColor: 'white',
    particleSizeBase: 1,
    particleSizeMultiplier: 0.5,
    flareSizeBase: 100,
    flareSizeMultiplier: 100,
    lineWidth: 2,
    linkChance: 100,         // chance per frame of link, higher: smaller chance
    linkLengthMin: 3,        // min linked vertices
    linkLengthMax: 5,        // max linked vertices
    linkOpacity: 0.3,        // number between 0 & 1
    linkFade: 28,            // link fade-out frames
    linkSpeed: 4,            // distance a link travels in 1 frame
    renderParticles: true,
    renderFlares: true,
    renderLinks: false,
    flicker: true,
    flickerSmoothing: 12,    // higher: smoother flicker
    randomMotion: true,
    noiseLength: 1000,
    noiseStrength: 4,
    pointsMultiplier: 1000   // multiplier for delaunay points, since floats too small can mess up the algorithm
};

module.exports = DEFAULTS;