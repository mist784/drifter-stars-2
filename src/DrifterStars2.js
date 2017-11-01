/**
 * Stars
 * Inspired by Steve Courtney's poster art for Celsius GS's Drifter - http://celsiusgs.com/drifter/posters.php
 * by Cory Hughart - http://coryhughart.com
 *
 * Copyright (c) 2017 by Cory Hughart (https://codepen.io/cr0ybot/pen/zNyYeW)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *
 * This file has been modified by me, HungryCosmos, to fit my personal website https://hungrycosmos.com
 *
 * Mofifications include, but not limited to:
 * - removed particle glare
 * - deleting comments and metadata
 * - changes of variables, such as deleting, adding and mutating existing values
 * - changes of methods, such as deleting whole methods or it's parts, adding new instructions to existing methods,
 *   adding new conditions to make system more customizeable
 * - added json configuration
 *
 *
 * VERSION: 2.0.0
 * DATE: 1 Nov 2017
 * UPDATES AND DOCS AT: https://github.com/HungryCosmos/drifter-stars-2
 *
 * @licence MIT License, Copyright (c) 2017 by Cory Hughart (https://codepen.io/cr0ybot/pen/zNyYeW) - original author,
 * 2017 HungryCosmos - modifications, new configurations, builds, docs
 * @author https://github.com/HungryCosmos
 */

var Delaunay = require('delaunay-fast');
var merjeJson = require('merge-json');

var defaults = require('./cfg/DrifterStars2.defaults');

var config, canvas = null, context,
    sw, sh, raf,
    mouse = { x: 0, y: 0 },
    n = 0,
    nAngle = (Math.PI * 2) / 1000,
    nRad = 17,
    nPos = {x: 0, y: 0},
    points = [],
    vertices = [],
    triangles = [],
    links = [],
    particles = [],
    flares = [];

function init(pref) {
    config = merjeJson.merge(defaults, pref);

    if (!config.canvas) {
        throw new Error('canvas is mandatory!');
    }

    canvas = config.canvas;
    nAngle = (Math.PI * 2) / config.noiseLength;
    context = canvas.getContext('2d');


    var i, j, k;

    // Size canvas
    window.addEventListener('resize', onResize, true);
    onResize();

    raf = window.requestAnimationFrame(animate);

    mouse.x = canvas.clientWidth / 2;
    mouse.y = canvas.clientHeight / 2;

    // Create particle positions
    for (i = 0; i < config.particleCount; i++) {
        var p = new Particle();
        particles.push(p);
        points.push([p.x*config.pointsMultiplier, p.y*config.pointsMultiplier]);
    }

    // Delaunay triangulation
    vertices = Delaunay.triangulate(points);

    // Create an array of "triangles" (groups of 3 indices)
    var tri = [];
    for (i = 0; i < vertices.length; i++) {
        if (tri.length == 3) {
            triangles.push(tri);
            tri = [];
        }
        tri.push(vertices[i]);
    }

    // Tell all the particles who their neighbors are
    for (i = 0; i < particles.length; i++) {

        // Loop through all tirangles
        for (j = 0; j < triangles.length; j++) {

            // Check if this particle's index is in this triangle
            k = triangles[j].indexOf(i);

            // If it is, add its neighbors to the particles contacts list
            if (k !== -1) {
                triangles[j].forEach(function(value, index, array) {
                    if (value !== i && particles[i].neighbors.indexOf(value) == -1) {
                        particles[i].neighbors.push(value);
                    }
                });
            }
        }
    }

    if (config.renderFlares) {

        // Create flare positions
        for (i = 0; i < config.flareCount; i++) {
            flares.push(new Flare());
        }
    }
}

// Animation loop
// function animloop(){
//     requestAnimFrame(animloop);
//     context.clearRect(0, 0, sw, sh);
//     render();
// }

function animate() {
    raf = window.requestAnimationFrame(animate);
    context.clearRect(0, 0, sw, sh);
    render();
}

function render() {
    if (config.randomMotion) {
        n++;
        if (n >= config.noiseLength) {
            n = 0;
        }

        nPos = noisePoint(n);
    }

    if (config.renderParticles) {
        for (var i = 0; i < config.particleCount; i++) {
            particles[i].render();
        }
    }

    if (config.renderLinks) {
        if (random(0, config.linkChance) === config.linkChance) {
            var length = random(config.linkLengthMin, config.linkLengthMax);
            var start = random(0, particles.length - 1);
            startLink(start, length);
        }

        // Render existing links
        // Iterate in reverse so that removing items doesn't affect the loop
        for (var l = links.length - 1; l >= 0; l--) {
            if (links[l] && !links[l].finished) {
                links[l].render();
            }
            else {
                delete links[l];
            }
        }
    }

    if (config.renderFlares) {
        for (var j = 0; j < config.flareCount; j++) {
            flares[j].render();
        }
    }
}


function onResize() {
    // canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
    // canvas.height = canvas.width * (canvas.clientHeight / canvas.clientWidth);

    var pos = canvas.getBoundingClientRect();
    sw = pos.width;
    sh = pos.height;

    canvas.width = sw;
    canvas.height = sh;
    context = canvas.getContext('2d');
}

function startLink(vertex, length) {
    links.push(new Link(vertex, length));
}

// Particle class
var Particle = function() {
    this.x = random(-0.1, 1.1, true);
    this.y = random(-0.1, 1.1, true);
    this.z = random(0,4);
    this.opacity = random(0.1,1,true);
    this.flicker = 0;
    this.neighbors = []; // placeholder for neighbors
};

Particle.prototype.render = function() {
    var pos = position(this.x, this.y, this.z),
        r = ((this.z * config.particleSizeMultiplier) + config.particleSizeBase) * (sizeRatio() / 1000),
        o = this.opacity;

    if (config.flicker) {
        var newVal = random(-0.5, 0.5, true);
        this.flicker += (newVal - this.flicker) / config.flickerSmoothing;
        if (this.flicker > 0.5) this.flicker = 0.5;
        if (this.flicker < -0.5) this.flicker = -0.5;
        o += this.flicker;
        if (o > 1) o = 1;
        if (o < 0) o = 0;
    }

    context.fillStyle = config.particleColor;
    context.globalAlpha = o;
    context.beginPath();
    context.arc(pos.x, pos.y, r, 0, 2 * Math.PI, false);
    context.fill();
    context.closePath();

    context.globalAlpha = 1;
};

// Flare class
var Flare = function() {
    this.x = random(-0.25, 1.25, true);
    this.y = random(-0.25, 1.25, true);
    this.z = random(0,2);
    this.opacity = random(0.01, 0.05, true);
};

Flare.prototype.render = function() {
    var pos = position(this.x, this.y, this.z),
        r = ((this.z * config.flareSizeMultiplier) + config.flareSizeBase) * (sizeRatio() / 1000);

    context.beginPath();
    context.globalAlpha = this.opacity;
    context.arc(pos.x, pos.y, r, 0, 2 * Math.PI, false);
    context.fillStyle = config.flareColor;
    context.fill();
    context.closePath();
    context.globalAlpha = 1;
};

// Link class
var Link = function(startVertex, numPoints) {
    this.length = numPoints;
    this.verts = [startVertex];
    this.stage = 0;
    this.linked = [startVertex];
    this.distances = [];
    this.traveled = 0;
    this.fade = 0;
    this.finished = false;
};

Link.prototype.render = function() {
    // Stages:
    // 0. Vertex collection
    // 1. Render line reaching from vertex to vertex
    // 2. Fade out
    // 3. Finished (delete me)

    var i, p, pos, points;

    switch (this.stage) {
        // VERTEX COLLECTION STAGE
        case 0:

            // Grab the last member of the link
            var last = particles[this.verts[this.verts.length-1]];
            if (last && last.neighbors && last.neighbors.length > 0) {

                // Grab a random neighbor
                var neighbor = last.neighbors[random(0, last.neighbors.length-1)];

                // If we haven't seen that particle before, add it to the link
                if (this.verts.indexOf(neighbor) == -1) {
                    this.verts.push(neighbor);
                }

                // If we have seen that particle before, we'll just wait for the next frame
            } else {
                this.stage = 3;
                this.finished = true;
            }

            if (this.verts.length >= this.length) {

                // Calculate all distances at once
                for (i = 0; i < this.verts.length-1; i++) {
                    var p1 = particles[this.verts[i]],
                        p2 = particles[this.verts[i+1]],
                        dx = p1.x - p2.x,
                        dy = p1.y - p2.y,
                        dist = Math.sqrt(dx*dx + dy*dy);

                    this.distances.push(dist);
                }
                this.stage = 1;
            }
            break;

        // RENDER LINE ANIMATION STAGE
        case 1:
            if (this.distances.length > 0) {

                points = [];
                //var a = 1;

                // Gather all points already linked
                for (i = 0; i < this.linked.length; i++) {
                    p = particles[this.linked[i]];
                    pos = position(p.x, p.y, p.z);
                    points.push([pos.x, pos.y]);
                }

                var linkSpeedRel = config.linkSpeed * 0.00001 * canvas.width;
                this.traveled += linkSpeedRel;
                var d = this.distances[this.linked.length-1];

                // Calculate last point based on linkSpeed and distance travelled to next point
                if (this.traveled >= d) {
                    this.traveled = 0;

                    // We've reached the next point, add coordinates to array
                    this.linked.push(this.verts[this.linked.length]);
                    p = particles[this.linked[this.linked.length-1]];
                    pos = position(p.x, p.y, p.z);
                    points.push([pos.x, pos.y]);

                    if (this.linked.length >= this.verts.length) {
                        this.stage = 2;
                    }
                }
                else {
                    // We're still travelling to the next point, get coordinates at travel distance
                    // http://math.stackexchange.com/a/85582
                    var a = particles[this.linked[this.linked.length-1]],
                        b = particles[this.verts[this.linked.length]],
                        t = d - this.traveled,
                        x = ((this.traveled * b.x) + (t * a.x)) / d,
                        y = ((this.traveled * b.y) + (t * a.y)) / d,
                        z = ((this.traveled * b.z) + (t * a.z)) / d;

                    pos = position(x, y, z);
                    points.push([pos.x, pos.y]);
                }

                this.drawLine(points);
            }
            else {
                this.stage = 3;
                this.finished = true;
            }
            break;

        // FADE OUT STAGE
        case 2:
            if (this.verts.length > 1) {
                if (this.fade < config.linkFade) {
                    this.fade++;

                    // Render full link between all vertices and fade over time
                    points = [];
                    var alpha = (1 - (this.fade / config.linkFade)) * config.linkOpacity;
                    for (i = 0; i < this.verts.length; i++) {
                        p = particles[this.verts[i]];
                        pos = position(p.x, p.y, p.z);
                        points.push([pos.x, pos.y]);
                    }
                    this.drawLine(points, alpha);
                }
                else {
                    this.stage = 3;
                    this.finished = true;
                }
            }
            else {
                this.stage = 3;
                this.finished = true;
            }
            break;

        // FINISHED STAGE
        case 3:
        default:
            this.finished = true;
            break;
    }
};

Link.prototype.drawLine = function(points, alpha) {
    if (typeof alpha !== 'number') alpha = config.linkOpacity;

    if (points.length > 1 && alpha > 0) {
        context.globalAlpha = alpha;
        context.beginPath();
        for (var i = 0; i < points.length-1; i++) {
            context.moveTo(points[i][0], points[i][1]);
            context.lineTo(points[i+1][0], points[i+1][1]);
        }
        context.strokeStyle = config.linkColor;
        context.lineWidth = config.lineWidth;
        context.stroke();
        context.closePath();
        context.globalAlpha = 1;
    }
};


// Utils
function noisePoint(i) {
    var a = nAngle * i,
        cosA = Math.cos(a),
        sinA = Math.sin(a),
        rad = nRad;
    return {
        x: rad * cosA,
        y: rad * sinA
    };
}

function position(x, y, z) {
    return {
        x: (x * canvas.width) + ((((canvas.width / 2) - mouse.x + ((nPos.x - 0.5) * config.noiseStrength)) * z) * config.motion),
        y: (y * canvas.height) + ((((canvas.height / 2) - mouse.y + ((nPos.y - 0.5) * config.noiseStrength)) * z) * config.motion)
    };
}

function sizeRatio() {
    return canvas.width >= canvas.height ? canvas.width : canvas.height;
}

function random(min, max, float) {
    return float ?
        Math.random() * (max - min) + min :
        Math.floor(Math.random() * (max - min + 1)) + min;
}

function setFlareColor(newFlareColor) {
    config.flareColor = newFlareColor;
}

function setEnableLinks(newFlag) {
    config.renderLinks = newFlag;
}

module.exports = {
    init: init,
    setFlareColor: setFlareColor,
    setEnableLinks: setEnableLinks
};