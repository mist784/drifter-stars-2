# preyon-2 [![Working Demo](https://img.shields.io/badge/demo-running-brightgreen.svg)](https://hungrycosmos.com/drifter-stars-2) [![Rawgit](https://img.shields.io/badge/rawgit-v2.0.0-orange.svg)](https://cdn.rawgit.com/HungryCosmos/drifter-stars-2/v2.0.0/dist/umd/DrifterStars2.min.js)

> Json-configurable version of Drifter Stars by @cr0ybot which now bundles delaunay by @ironwallaby. Particle glare is removed btw.


## About

**Stars**  
> Inspired by Steve Courtney's [poster art](http://celsiusgs.com/drifter/posters.php) for Celsius GS's Drifter  
by [Cory Hughart](http://coryhughart.com)

Though original [Drifter Stars](https://codepen.io/cr0ybot/pen/zNyYeW) is already easy to configure, it still has 
external dependency of [Delaunay](https://github.com/ironwallaby/delaunay) triangulation library. This project solves 
two problems for me: it allows to configure Stars from outside, using json or js object, and it bundles all production 
dependencies into one single minified file. Both `DrifterStars2` and [DrifterStars](https://codepen.io/cr0ybot/pen/zNyYeW)
developed and intended for _in-browser_ use only.  

**Compatibility**: _works_ in my ie 11  
**Demo**: [running](https://hungrycosmos.com/drifter-stars-2)  


## Quick Start

1. Download packaged [DrifterStars2.min.js](/dist/umd/DrifterStars2.min.js) (or other distribution from [repo](/dist))
and load it with from local files, or use [rawgit](https://rawgit.com) at your own risk:  
   ```html
   <script src="https://cdn.rawgit.com/HungryCosmos/drifter-stars-2/v2.0.0/dist/umd/DrifterStars2.min.js"></script>
   ```
2. Initialize `DrifterStars2` with required params in javascript:  
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <!--metadata-->
   </head>
   <body>
       <!--MUST HAVE CANVAS TO DRAW-->
       <canvas id="canvas"></canvas>
   
       <!--content-->
       <div id="content">
           <div id="centered-cell">
               <span id="useful-text">Eh, I've seen <a href='https://hungrycosmos.com'>better</a></span>
           </div>
       </div>
   
       <!--loading this library-->
       <script src="https://cdn.rawgit.com/HungryCosmos/drifter-stars-2/v2.0.0/dist/umd/DrifterStars2.min.js"></script>
   
       <!--initialization-->
       <script>
           // First, we need to get reference to canvas element
           var fullScreenCanvas = document.getElementById('canvas');
   
           // Take a look at all possible options. You can change what you want right here, but we will skip it for now.
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
   
           // These MUST BE configured
           DEFAULTS.canvas = fullScreenCanvas;
   
           // This is optional, in case we want to see links in between
           DEFAULTS.renderLinks = true;
   
           // And to change big particles color
           DEFAULTS.flareColor = 'white';
   
           // We can pack our custom config into separate object. This is minimal implementation.
           var config = {
               canvas: canvas
           };
   
           // And it will overwrite defaults. Note, DrifterStars2.init(DEFAULTS); will work as well
           DrifterStars2.init(config);
   
           // And there is special endpoint for two particular mutations
           DrifterStars2.setEnableLinks(true);
           DrifterStars2.setFlareColor('#fff');
       </script>
   </body>
   ```
4. Good Day Sir!


## References

1. Original project: [codepen](https://codepen.io/cr0ybot/pen/zNyYeW)  
   Original creator and copyright holder of [DrifterStars](/src/DrifterStars2.js): [Cory Hughart](https://github.com/cr0ybot), his [website](http://coryhughart.com)  
   Original license: MIT  
   > Copyright (c) 2017 by Cory Hughart [https://codepen.io/cr0ybot/pen/zNyYeW](https://codepen.io/cr0ybot/pen/zNyYeW)
               

2. [DrifterStars source file](/src/DrifterStars2.js) has been modified by [me](https://github.com/HungryCosmos), to fit my [personal website](https://hungrycosmos.com)  
Mofifications include, but not limited to:
   - _removed_ particle glare
   - deleting comments and metadata
   - changes of variables, such as deleting, adding and mutating existing values
   - changes of methods, such as deleting whole methods or it's parts, adding new instructions to existing methods,
     adding new conditions to make system more customizeable
   - added json configuration

3. [LICENSE](LICENSE) file has been updated to include my copyright notice. Original copyright saved above.  

4. Added [webpack](https://github.com/webpack/webpack) build scripts to produce browser-ready umd bundle, which includes the following unmodified 
distributions from [npmjs](https://www.npmjs.com): 
   - [delaunay-fast v1.0.1](https://www.npmjs.com/package/delaunay-fast) by [ironwallaby](https://github.com/ironwallaby/delaunay) | No Copyright [CC0 1.0 Universal (CC0 1.0), Public Domain Dedication](https://creativecommons.org/publicdomain/zero/1.0/)
   - [merge-json v0.1.0-b.3](https://www.npmjs.com/package/merge-json) | Copyright (c) 2016 jacob418 | [MIT License](https://github.com/jacob418/node_json-merge/blob/master/LICENSE)

Modifications are licensed under MIT license, Copyright (c) 2017 HungryCosmos
