/**
 * Created by Unravel with help from Fish on 12/1/2016.
 */

var TILE_COUNT = 48;
var TILE_MESH_SIZE = 1;
var SectorX = 50;
var SectorY = 47;

var container;
var camera, scene, renderer, controls;
var mouse, raycaster, isShiftDown = false;
var camera, stats;
var Sectors = new Array();
var overlay_map = {};
var Tiles;
var masterGeometry;


function initEditor() {
    try {
        setup();
        html();
        animate();
    } catch(err) {
        alert(err);
    }
}

function openFile(event) {
    var file = event.target.files[0];
    var jsZip = new JSZip()
    jsZip.loadAsync(file).then(function (zip) {
        var offsets = [[-1, -1],[0, -1],[1, -1], [-1, 0],[0, 0],[1, 0], [-1, 1],[0, 1],[1, 1]];
        for(var i=0; i < offsets.length; i++) {
            var name = "h0x" + (SectorX + offsets[i][0]) + "y" + (SectorY + offsets[i][1]);
            console.error("reading " + name);
            zip.file(name).async('arraybuffer').then(function (fileData) {
                var view = new DataView(fileData);
                Sectors.push(view);
            })
        }
    })
}

function unpackSectors() {
    Tiles = new Array((TILE_COUNT*TILE_COUNT) * Sectors.length);
    var sectX = 0;
    var sectY = 0;
    for(var s=0; s < Sectors.length; s++) {
        if (sectX == Math.sqrt(Sectors.length)) {
            sectX = 0;
            sectY++;
        }
        var sectorIndex = s;
        var idx = 0;
        var view = Sectors[s];
        for (var x = 0; x < TILE_COUNT; x++) {
            for (var y = 0; y < TILE_COUNT; y++) {
                var tile = new Tile(sectorIndex, sectX, sectY, x, y, view.getUint8(idx), view.getUint8(idx + 1), view.getUint8(idx + 2), view.getUint8(idx + 3), view.getUint8(idx + 4), view.getUint8(idx + 5), view.getUint32(idx + 6), s);

                Tiles[((x * 48) + y) + 48 * 48 * sectorIndex] = tile;
                idx += 10;
            }
        }
        sectX++;
    }
}



function updateSectors() {



    var masterGeometry = new THREE.PlaneGeometry(0 , 0 , 0, 0);

    var sectX = 0;
    var sectY = 0;

    var masterGeometry = new THREE.PlaneGeometry(0 , 0 , 0, 0);

    for(var s=0; s < Sectors.length; s++) {
        if (sectX == Math.sqrt(Sectors.length)) {
            sectX = 0;
            sectY++;
        }
        var sectorIndex = s;
        var idx = 0;
        var view = Sectors[s];
        var geometry = new THREE.PlaneGeometry((TILE_MESH_SIZE * TILE_COUNT), (TILE_MESH_SIZE * TILE_COUNT), TILE_COUNT, TILE_COUNT);

        /**
         *
         * Tile Elevations
         *
         */



        for (var xx = 0; xx < 48; xx++) {
            for (var yy = 0; yy < 48; yy++) {
                t = (xx * 48 + yy) + 48 * 48 * sectorIndex;
                v = (xx * 49 + yy);
                if (Tiles[t] == null) continue;

                var base = 0;
                var multi = 0.04;
                if(Tiles[t].groundElevation < 128) {
                    base -= multi * (128 - Tiles[t].groundElevation);
                } else {
                    base += multi * Math.abs((128 - Tiles[t].groundElevation));
                }
                geometry.vertices[v].z = base;
            }
        }



        /**
         *
         * Tile gradients & overlays
         *
         */
        l = geometry.faces.length / 2;
        for (var i = 0; i < l; i++) {
            var j = 2 * i;
            var til = Tiles[i + 48 * 48 * sectorIndex];

            if (til == null)
                continue;

            if (til.groundTexture > 0) { // tile gradient
                geometry.faces[j].materialIndex = til.groundTexture + 500;
                geometry.faces[j + 1].materialIndex = til.groundTexture + 500;
            }

            var obj = overlay_map[til.groundOverlay];
            if(obj != null) {
                geometry.faces[j].materialIndex = til.groundOverlay;
                geometry.faces[j + 1].materialIndex = til.groundOverlay;
            }
        }

        /**
         *
         * Walls
         *
         */
        var tempGeom = new THREE.PlaneGeometry(0, 0);
        var tempMesh = new THREE.Mesh(tempGeom, new THREE.MeshFaceMaterial(materials));
        l = geometry.faces.length / 2;




        for (var i = 0; i < l; i++) {
            var j = 2 * i;
            var til = Tiles[i + 48 * 48 * sectorIndex];
            if (til == null)
                continue;

            var base = 0;
            var multi = 0.04;
            if(til.groundElevation < 128) {
                base -= multi * (128 - til.groundElevation);
            } else {
                base += multi * Math.abs((128 - til.groundElevation));
            }
            if (til.verticalWall >  0) {
                var overlayGeom = new THREE.PlaneGeometry(1, 1);
                var obj = overlay_map[til.verticalWall + 300];
                if(obj != null) {
                    overlayGeom.faces[0].materialIndex = til.verticalWall + 300;
                    overlayGeom.faces[1].materialIndex = til.verticalWall + 300;
                    var wall = new THREE.Mesh(overlayGeom, new THREE.MeshFaceMaterial(materials));
                    wall.rotation.x = Math.PI / 2;
                    wall.position.x = til.x - (TILE_COUNT / 2) + 0.5;
                    wall.position.y = til.y - (TILE_COUNT / 2);
                    wall.position.z = base + 0.5;
                    wall.updateMatrix();
                    tempGeom.merge(wall.geometry, wall.matrix);
                }
            }

            if (til.horizontalWall > 0) {
                var overlayGeom = new THREE.PlaneGeometry(1, 1);
                var obj = overlay_map[til.horizontalWall + 350];
                if(obj != null) {
                    overlayGeom.faces[0].materialIndex = til.horizontalWall + 350;
                    overlayGeom.faces[1].materialIndex = til.horizontalWall + 350;

                    var wall = new THREE.Mesh(overlayGeom, new THREE.MeshFaceMaterial(materials));
                    wall.rotation.y = Math.PI / 2;
                    wall.position.x = til.x - (TILE_COUNT / 2);
                    wall.position.y = til.y - (TILE_COUNT / 2) + 0.5;
                    wall.position.z = base + 0.5;
                    wall.updateMatrix();
                    tempGeom.merge(wall.geometry, wall.matrix);
                }
            }

            if (til.diagonalWall > 0) {
                var overlayGeom = new THREE.PlaneGeometry(1, 1);
                var obj = overlay_map[1  + 350];
                if(obj != null) {
                    overlayGeom.faces[0].materialIndex = 1  + 350;
                    overlayGeom.faces[1].materialIndex = 1  + 350;

                    var wall = new THREE.Mesh(overlayGeom, new THREE.MeshFaceMaterial(materials));
                    wall.rotation.y = Math.PI / 2;
                    // wall.rotation.x = 20;
                    wall.position.x = til.x - (TILE_COUNT / 2);
                    wall.position.y = til.y - (TILE_COUNT / 2) + 0.5;
                    wall.position.z = base + 0.5;
                    //  wall.rotation.z = Math.PI / 2;
                    wall.updateMatrix();
                    tempGeom.merge(wall.geometry, wall.matrix);
                }
            }
        }





        tempMesh.rotation.z = -Math.PI / 2;
        tempMesh.updateMatrix();
        geometry.merge(tempMesh.geometry, tempMesh.matrix);

        var tmesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        tmesh.position.set(-(TILE_MESH_SIZE * TILE_COUNT / 2) - 48 * sectX, -(TILE_MESH_SIZE * TILE_COUNT / 2) - 48  * sectY, 0);
        tmesh.rotation.z = -Math.PI / 2;

        tmesh.updateMatrix();
        masterGeometry.merge(tmesh.geometry, tmesh.matrix);
        sectX++;

        //for (var xp = 0; xp < 48; xp++){
        //for( var yy = 0; yy < 48; yy++){
        //var til = ((xp * 48) + yy) * (1);
        //console.log(xp + "   " + Tiles[til].x + "    " + yy + "     " + Tiles[til].y + "   TEST 4");
        //}
        //}

    }

    mesh = new THREE.Mesh(masterGeometry, new THREE.MeshFaceMaterial(materials));
    scene.add(mesh);

    animate();
}

function setup() {

    prepMaterials();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    var light = new THREE.AmbientLight(  0x404040 ); // soft white light
    scene.add( light );
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    renderer = new THREE.WebGLRenderer({ alpha: true } );
    renderer.setClearColor( 0x000000 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    var axisHelper = new THREE.AxisHelper( 5 );
    scene.add( axisHelper );

    camera.updateProjectionMatrix();

    //   controls.update();
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    //  document.addEventListener( 'keydown', onDocumentKeyDown, false );
    //  document.addEventListener( 'keyup', onDocumentKeyUp, false );

}

function animate() {
    stats.begin();
    stats.end();

    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    if(controls != null)
        controls.update();
}

function html() {
    stats = new Stats();
    stats.showPanel( 0 );
    document.body.appendChild( stats.dom );
    var top = document.createElement('div');
    top.innerHTML = '<input type="file" onchange="openFile(event)" > <button id="rendButton">Render</button><br><br>';
    document.body.appendChild(top);
    container = document.createElement('div');
    document.body.appendChild(container);
    var info = document.createElement('div');
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    // info.innerHTML = '<input type="file" onchange="openFile(event)" ><br><br>';

    container.appendChild(info);
    container.appendChild(renderer.domElement);
    window.addEventListener( 'resize', onWindowResize, false );


    var button = document.getElementById("rendButton");
    button.addEventListener("click",function(e){
        unpackSectors();
        updateSectors();
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.zoomSpeed = 0.5;
        camera.position.set(0, 0, 200);
        controls.enabled = false;
        controls.enabled = true;
        controls.enablePan = true;
        controls.enableZoom = true;
        controls.update();


    },false);
}

function onWindowResize() {
    console.error(camera.position.x + ", " + camera.position.y + ", " +camera.position.z);
    console.error(camera.rotation.x + ", " + camera.rotation.y + ", " +camera.rotation.z);
    console.error("tgt: " + controls.target.x + ", " + controls.target.y + ", " + controls.target.z);
    console.error("obj: " + controls.object.position.x + ", " + controls.object.position.y + ", " + controls.object.position.z);
    console.error(controls.zoom);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    animate();
}

function onDocumentMouseDown( event ) {

    if(event.button != 0)
        return;
    event.preventDefault();
    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects(scene.children );
    if ( intersects.length > 0 ) {

        var intersect = intersects[ 0 ];

        var x = Math.floor(Math.abs(intersect.point.x));
        var y = Math.floor(Math.abs(intersect.point.y)) - 1;

        var tempSectX = 0;
        var tempSectY = 0;
        while(x >= 48){
            x -= 48;
            tempSectX++;
        }
        while(y >= 48){
            y -= 48;
            tempSectY++;
        }

        var sectorIndex = 3 * tempSectY + tempSectX;

        //console.log("  X: " + x + "  Y: " + y + "  SX: " + tempSectX + "  SY: " + tempSectY + "  sectorIndex: " + sectorIndex) ;

        var tile = ((x * 48) + y) + 48 * 48 * sectorIndex;
        if(Tiles == null)
            return;
        var tt = Tiles[tile];
        if(tt == null)
            return;

        if (tt.x == x && tt.y == y) {

            tt.groundElevation = 255;
            updateSectors();
            console.log("SUCCESS");

        }
        else console.log("FAIL");
        // var voxel = new THREE.Mesh( cubeGeometry, cubeMaterial );
        // voxel.position.copy( intersect.point ).add( intersect.face.normal );
        // voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
        //scene.add( voxel );

        //objects.push( voxel );


    }

}

function onDocumentKeyDown( event ) {
    /*switch( event.keyCode ) {
     case 16: isShiftDown = true; break;
     }*/
}

function onDocumentKeyUp( event ) {
    /* switch( event.keyCode ) {
     case 16: isShiftDown = false; break;
     }*/
}