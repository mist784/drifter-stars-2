(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["DrifterStars2"] = factory();
	else
		root["DrifterStars2"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

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

var Delaunay = __webpack_require__(1);
var merjeJson = __webpack_require__(2);

var defaults = __webpack_require__(3);

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

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var Delaunay;

(function() {
  "use strict";

  var EPSILON = 1.0 / 1048576.0;

  function supertriangle(vertices) {
    var xmin = Number.POSITIVE_INFINITY,
        ymin = Number.POSITIVE_INFINITY,
        xmax = Number.NEGATIVE_INFINITY,
        ymax = Number.NEGATIVE_INFINITY,
        i, dx, dy, dmax, xmid, ymid;

    for(i = vertices.length; i--; ) {
      if(vertices[i][0] < xmin) xmin = vertices[i][0];
      if(vertices[i][0] > xmax) xmax = vertices[i][0];
      if(vertices[i][1] < ymin) ymin = vertices[i][1];
      if(vertices[i][1] > ymax) ymax = vertices[i][1];
    }

    dx = xmax - xmin;
    dy = ymax - ymin;
    dmax = Math.max(dx, dy);
    xmid = xmin + dx * 0.5;
    ymid = ymin + dy * 0.5;

    return [
      [xmid - 20 * dmax, ymid -      dmax],
      [xmid            , ymid + 20 * dmax],
      [xmid + 20 * dmax, ymid -      dmax]
    ];
  }

  function circumcircle(vertices, i, j, k) {
    var x1 = vertices[i][0],
        y1 = vertices[i][1],
        x2 = vertices[j][0],
        y2 = vertices[j][1],
        x3 = vertices[k][0],
        y3 = vertices[k][1],
        fabsy1y2 = Math.abs(y1 - y2),
        fabsy2y3 = Math.abs(y2 - y3),
        xc, yc, m1, m2, mx1, mx2, my1, my2, dx, dy;

    /* Check for coincident points */
    if(fabsy1y2 < EPSILON && fabsy2y3 < EPSILON)
      throw new Error("Eek! Coincident points!");

    if(fabsy1y2 < EPSILON) {
      m2  = -((x3 - x2) / (y3 - y2));
      mx2 = (x2 + x3) / 2.0;
      my2 = (y2 + y3) / 2.0;
      xc  = (x2 + x1) / 2.0;
      yc  = m2 * (xc - mx2) + my2;
    }

    else if(fabsy2y3 < EPSILON) {
      m1  = -((x2 - x1) / (y2 - y1));
      mx1 = (x1 + x2) / 2.0;
      my1 = (y1 + y2) / 2.0;
      xc  = (x3 + x2) / 2.0;
      yc  = m1 * (xc - mx1) + my1;
    }

    else {
      m1  = -((x2 - x1) / (y2 - y1));
      m2  = -((x3 - x2) / (y3 - y2));
      mx1 = (x1 + x2) / 2.0;
      mx2 = (x2 + x3) / 2.0;
      my1 = (y1 + y2) / 2.0;
      my2 = (y2 + y3) / 2.0;
      xc  = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
      yc  = (fabsy1y2 > fabsy2y3) ?
        m1 * (xc - mx1) + my1 :
        m2 * (xc - mx2) + my2;
    }

    dx = x2 - xc;
    dy = y2 - yc;
    return {i: i, j: j, k: k, x: xc, y: yc, r: dx * dx + dy * dy};
  }

  function dedup(edges) {
    var i, j, a, b, m, n;

    for(j = edges.length; j; ) {
      b = edges[--j];
      a = edges[--j];

      for(i = j; i; ) {
        n = edges[--i];
        m = edges[--i];

        if((a === m && b === n) || (a === n && b === m)) {
          edges.splice(j, 2);
          edges.splice(i, 2);
          break;
        }
      }
    }
  }

  Delaunay = {
    triangulate: function(vertices, key) {
      var n = vertices.length,
          i, j, indices, st, open, closed, edges, dx, dy, a, b, c;

      /* Bail if there aren't enough vertices to form any triangles. */
      if(n < 3)
        return [];

      /* Slice out the actual vertices from the passed objects. (Duplicate the
       * array even if we don't, though, since we need to make a supertriangle
       * later on!) */
      vertices = vertices.slice(0);

      if(key)
        for(i = n; i--; )
          vertices[i] = vertices[i][key];

      /* Make an array of indices into the vertex array, sorted by the
       * vertices' x-position. */
      indices = new Array(n);

      for(i = n; i--; )
        indices[i] = i;

      indices.sort(function(i, j) {
        return vertices[j][0] - vertices[i][0];
      });

      /* Next, find the vertices of the supertriangle (which contains all other
       * triangles), and append them onto the end of a (copy of) the vertex
       * array. */
      st = supertriangle(vertices);
      vertices.push(st[0], st[1], st[2]);
      
      /* Initialize the open list (containing the supertriangle and nothing
       * else) and the closed list (which is empty since we havn't processed
       * any triangles yet). */
      open   = [circumcircle(vertices, n + 0, n + 1, n + 2)];
      closed = [];
      edges  = [];

      /* Incrementally add each vertex to the mesh. */
      for(i = indices.length; i--; edges.length = 0) {
        c = indices[i];

        /* For each open triangle, check to see if the current point is
         * inside it's circumcircle. If it is, remove the triangle and add
         * it's edges to an edge list. */
        for(j = open.length; j--; ) {
          /* If this point is to the right of this triangle's circumcircle,
           * then this triangle should never get checked again. Remove it
           * from the open list, add it to the closed list, and skip. */
          dx = vertices[c][0] - open[j].x;
          if(dx > 0.0 && dx * dx > open[j].r) {
            closed.push(open[j]);
            open.splice(j, 1);
            continue;
          }

          /* If we're outside the circumcircle, skip this triangle. */
          dy = vertices[c][1] - open[j].y;
          if(dx * dx + dy * dy - open[j].r > EPSILON)
            continue;

          /* Remove the triangle and add it's edges to the edge list. */
          edges.push(
            open[j].i, open[j].j,
            open[j].j, open[j].k,
            open[j].k, open[j].i
          );
          open.splice(j, 1);
        }

        /* Remove any doubled edges. */
        dedup(edges);

        /* Add a new triangle for each edge. */
        for(j = edges.length; j; ) {
          b = edges[--j];
          a = edges[--j];
          open.push(circumcircle(vertices, a, b, c));
        }
      }

      /* Copy any remaining open triangles to the closed list, and then
       * remove any triangles that share a vertex with the supertriangle,
       * building a list of triplets that represent triangles. */
      for(i = open.length; i--; )
        closed.push(open[i]);
      open.length = 0;

      for(i = closed.length; i--; )
        if(closed[i].i < n && closed[i].j < n && closed[i].k < n)
          open.push(closed[i].i, closed[i].j, closed[i].k);

      /* Yay, we're done! */
      return open;
    },
    contains: function(tri, p) {
      /* Bounding box test first, for quick rejections. */
      if((p[0] < tri[0][0] && p[0] < tri[1][0] && p[0] < tri[2][0]) ||
         (p[0] > tri[0][0] && p[0] > tri[1][0] && p[0] > tri[2][0]) ||
         (p[1] < tri[0][1] && p[1] < tri[1][1] && p[1] < tri[2][1]) ||
         (p[1] > tri[0][1] && p[1] > tri[1][1] && p[1] > tri[2][1]))
        return null;

      var a = tri[1][0] - tri[0][0],
          b = tri[2][0] - tri[0][0],
          c = tri[1][1] - tri[0][1],
          d = tri[2][1] - tri[0][1],
          i = a * d - b * c;

      /* Degenerate tri. */
      if(i === 0.0)
        return null;

      var u = (d * (p[0] - tri[0][0]) - b * (p[1] - tri[0][1])) / i,
          v = (a * (p[1] - tri[0][1]) - c * (p[0] - tri[0][0])) / i;

      /* If we're outside the tri, fail. */
      if(u < 0.0 || v < 0.0 || (u + v) > 1.0)
        return null;

      return [u, v];
    }
  };

  if(true)
    module.exports = Delaunay;
})();


/***/ }),
/* 2 */
/***/ (function(module, exports) {

// JSON Konstruktor für die Überprüfung ob ein Objekt JSON ist
var jsonC = {}.constructor ;

var isJSON = function(json){
	if(json && json.constructor === jsonC){
		return true ;
	}else{
		return false ;
	}
}

exports.isJSON = isJSON ;


var mergeJSON = function(json1, json2){
	var result = null ;
	if(isJSON(json2)){
		result = {} ;
		if(isJSON(json1)){
			for(var key in json1){
				result[key] = json1[key] ;
			}
		}

		for(var key in json2){
			if(typeof result[key] === "object" && typeof json2 === "object"){
				result[key] = mergeJSON(result[key], json2[key]) ;
			}else{
				result[key] = json2[key] ;
			}
		}
	}else if(Array.isArray(json1) && Array.isArray(json2)){
		result = json1 ;

		for(var i = 0; i < json2.length; i++){
			if(result.indexOf(json2[i]) === -1){
				result[result.length] = json2[i] ;
			}
		}
	}else{
		result = json2 ;
	}

	return result ;
}

exports.merge = mergeJSON ;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

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

/***/ })
/******/ ]);
});