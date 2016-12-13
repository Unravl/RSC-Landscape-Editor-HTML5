/**
 * Created by Unravel with help from Fish on 12/1/2016.
 */

var TILE_COUNT = 48;
var TILE_MESH_SIZE = 1;
var SectorX = 53;
var SectorY = 47;

var container;
var camera, scene, renderer, controls;
var mouse, raycaster, isShiftDown = false;
var camera, stats;
var Sectors = new Array();
var selected;
var overlay_map = {};
var Tiles;
var mesh;
var masterGeometry;
var offsets = [[-1, -1],[0, -1],[1, -1], [-1, 0],[0, 0],[1, 0], [-1, 1],[0, 1],[1, 1]];
var gui = new dat.GUI();
var guiItems =
    {
        localXY: "0, 0",
        sectorName: "0",
        sectorIdx: 0,
        tileIdx: 0,
        rscXY: "0",
        tile_elevation: 0,
        tile_texture: 0,
        tile_overlay: 0,
        tile_horizontal: 0,
        tile_vertical: 0,
        tile_diagonal: 0,
        tile_roof: 0

    };


function loadGui() {

    selected = gui.addFolder('Selected Tile');
    selected.add(guiItems, 'rscXY').name("RSC XY").listen();
    selected.add(guiItems, 'localXY').name("Local XY").listen();
    selected.add(guiItems, 'sectorName').name("Sector Name").listen();
    selected.add(guiItems, 'sectorIdx').name("Sector Index").listen();
    selected.add(guiItems, 'tileIdx').name("Tile Index").listen();
    selected.add(guiItems, 'tile_overlay').name("Overlay").listen();
    selected.add(guiItems, 'tile_texture').name("Texture").listen();
    selected.add(guiItems, 'tile_elevation').name("Elevation").listen();
    selected.add(guiItems, 'tile_horizontal').name("Horizontal Wall").listen();
    selected.add(guiItems, 'tile_vertical').name("Vertical Wall").listen();
    selected.add(guiItems, 'tile_diagonal').name("Diagonal").listen();
    selected.add(guiItems, 'tile_roof').name("Roof").listen();
    //selected.open();
    gui.open();
}


function initEditor() {
    try {
        setup();
        html();
        //   loadGui();
        animate();
    } catch(err) {
        alert(err);
    }
}

function openFile(event) {
    var file = event.target.files[0];
    var jsZip = new JSZip()
    jsZip.loadAsync(file).then(function (zip) {

        for(var i=0; i < offsets.length; i++) {
            var name = "h0x" + (SectorX + offsets[i][0]) + "y" + (SectorY + offsets[i][1]);
            console.error("reading " + name);
            zip.file(name).async('arraybuffer').then(function (fileData) {
                var view = new DataView(fileData);
                Sectors.push(view);
            })
        }
    })
    var timer = setInterval(load_timer, 500);
    function load_timer() {
        if(sectorsLoaded) {
            clearInterval(timer);
            sectorsLoaded = false;
            unpackSectors();
            updateSectors();
            camera.position.set(0,0,200);
            //camera.target.set(0, 0, 0);
            //	camera.rotation.set(-200, 0, 0);
            controls = new THREE.OrbitControls( camera, renderer.domElement );
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.zoomSpeed = 0.5;
            //controls.target..x -= 100;
            //controls.target.set(50, (48/2*3), -100);
            controls.enabled = false;
            controls.enabled = true;
            controls.enablePan = true;
            controls.enableZoom = true;
            controls.update();
            animate();
        }
    }

}


var sectorsLoaded = false;
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
                var tile = new Tile(sectorIndex, sectX, sectY, x, y, view.getUint8(idx), view.getUint8(idx + 1), view.getUint8(idx + 2), view.getUint8(idx + 3), view.getUint8(idx + 4), view.getUint8(idx + 5), view.getUint32(idx + 6), s, (SectorX + offsets[sectorIndex][0]),(SectorY + offsets[sectorIndex][1]) );

                Tiles[((x * 48) + y) + 48 * 48 * sectorIndex] = tile;
                idx += 10;
            }
        }
        sectX++;
    }
    sectorsLoaded = true;
}

var masterGeometry;

function temp() {

}

function updateSectors() {


    scene.remove(mesh);
    masterGeometry = new THREE.PlaneGeometry(0 , 0 , 0, 0);

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
        var tmesh = drawSector(sectorIndex);
        tmesh.position.set(-(TILE_MESH_SIZE * TILE_COUNT / 2) - 48 * sectX, -(TILE_MESH_SIZE * TILE_COUNT / 2) - 48  * sectY, 0);
        tmesh.rotation.z = -Math.PI / 2;

        tmesh.updateMatrix();
        masterGeometry.merge(tmesh.geometry, tmesh.matrix);
        sectX++;

    }

    var add = mesh == null;
    mesh = new THREE.Mesh(masterGeometry, new THREE.MeshFaceMaterial(materials));
    // if(add)
    scene.add(mesh);
    //else {
    //    mesh.updateMatrix();
    //    mesh.geometry.verticesNeedUpdate = true;
    // }
}

function drawSector(sectorIndex) {

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
            var multi = 0.025;
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
        var multi = 0.025;
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
    return tmesh;

}

function setup() {

    prepMaterials();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    var light = new THREE.AmbientLight(  0x404040 ); // soft white light
    // scene.add( light );
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    renderer = new THREE.WebGLRenderer({ alpha: true } );
    renderer.setClearColor( 0x000000 );
    scene.background = new THREE.Color( 0xaaaaaa );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    //  var axisHelper = new THREE.AxisHelper( 5 );
    // scene.add( axisHelper );

    camera.updateProjectionMatrix();

    //   controls.update();
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    //  document.addEventListener( 'keydown', onDocumentKeyDown, false );
    //  document.addEventListener( 'keyup', onDocumentKeyUp, false );

}

function animate() {
    stats.begin();


    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    if(controls != null)
        controls.update();
    stats.end();
}

function html() {
    stats = new Stats();
    stats.showPanel( 0 );
    // document.body.appendChild( stats.dom );
    //var top = document.createElement('div');
    //top.innerHTML = '<input type="file" onchange="openFile(event)" > <button id="rendButton">Render</button><br><br>';
    //document.body.appendChild(top);
    container = document.createElement('div');
    document.body.appendChild(container);
    var info = document.createElement('div');
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    // info.innerHTML = '<input type="file" onchange="openFile(event)" ><br><br>';

    //container.appendChild(info);
    container.appendChild(renderer.domElement);
    window.addEventListener( 'resize', onWindowResize, false );


    /*  var button = document.getElementById("rendButton");
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
     animate();

     },false);*/
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

            // selected.open();
            tt.groundElevation = 255;
            // updateSectors();
            console.log("SUCCESS");

            var sectName = "h0x" + (SectorX + offsets[tt.sector][0]) + "y" + (SectorY + offsets[tt.sector][1]);
            guiItems.localXY = tt.x + ", " + tt.y;
            var rscX = ((tt.absoluteSectorX - 48) * 48) + tt.x;
            var rscY = ((((tt.absoluteSectorY - 36) * 48) + tt.y + 96) - 144) + (0 * 944) + 48 - 48;
            guiItems.rscXY = rscX + ", " + rscY;
            ui_coords.setValue("RSC XY: " + rscX + ", " + rscY);
            ui_local_coords.setValue("Local XY: " + tt.x + ", " + tt.y);
            sectorIdx.setValue("Sector Index: " + tt.sector);
            sectorName.setValue("Sector Name: " + sectName);
            tileIdx.setValue("Tile Index: " + tile);
            tile_elevation.setValue("Elevation: " + tt.groundElevation);
            tile_overlay.setValue("Overlay: " + tt.groundOverlay);
            tile_texture.setValue("Texture: " + tt.groundTexture);
            tile_horizontal.setValue("Horizontal Wall: " + tt.horizontalWall);
            tile_vertical.setValue("Vertical Wall: " + tt.verticalWall);
            tile_diagonal.setValue("Diagonal Wall: " + tt.diagonalWall);
            tile_roof.setValue("Roof Texture: " + tt.roofTexture);

            /* // scene.remove(mesh);
             var tmesh = drawSector(sectorIndex);
             tmesh.position.set(-(TILE_MESH_SIZE * TILE_COUNT / 2) - 48 * tt.sectX, -(TILE_MESH_SIZE * TILE_COUNT / 2) - 48  * tt.sectY, 0);
             tmesh.rotation.z = -Math.PI / 2;

             tmesh.updateMatrix();
             masterGeometry.merge(tmesh.geometry, tmesh.matrix);
             mesh.geometry.computeFaceNormals();
             mesh.geometry.computeVertexNormals();
             mesh.geometry.normalsNeedUpdate = true;
             mesh.geometry.verticesNeedUpdate = true;
             mesh.geometry.dynamic = true;
             //scene.add(mesh);
             animate();*/


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