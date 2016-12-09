/**
 * Created by Hayden on 12/1/2016.
 */



var TILE_COUNT = 48;
var TILE_MESH_SIZE = 1;

var container;
var camera, scene, renderer, controls;
var mouse, raycaster, isShiftDown = false;
var camera, stats;
var Sectors = new Array();
var materials = [];
var overlay_map = {};

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
        var x=50, y=47;
        var offsets = [[-1, -1],[0, -1],[1, -1], [-1, 0],[0, 0],[1, 0], [-1, 1],[0, 1],[1, 1]];
        // var offsets = [[0, 0]];
        for(var i=0; i < offsets.length; i++) {
            var name = "h0x" + (x + offsets[i][0]) + "y" + (y + offsets[i][1]);
            console.error("reading " + name);
            zip.file(name).async('arraybuffer').then(function (fileData) {
                var view = new DataView(fileData);
                Sectors.push(view);
            })
        }
        //loadSectors();
    })
}

function prepMaterials() {


    // ground textures start at 500, to give room for other materials
    try {

        materials[0] = new THREE.MeshBasicMaterial({color: 0xffffff});
        for (var i = 0; i < tileColors.length; i++) {
            materials[500 + i] = new THREE.MeshBasicMaterial({
                color: tileColors[i]
            });
        }

        var floor = new THREE.ImageUtils.loadTexture('img/3223.png');
        floor.wrapS = floor.wrapT = THREE.RepeatWrapping;
        floor.repeat.set(16, 16);


        // index is the overlay ID.
        overlay_map[1] = new THREE.MeshBasicMaterial({color: 0x404040}); // grey tile

        overlay_map[5] = new THREE.MeshBasicMaterial({color: 0x404040}); //grey tile
        overlay_map[6] = new THREE.MeshBasicMaterial({color: 0x6F0410}); // red tile
        overlay_map[16] = new THREE.MeshBasicMaterial({color: 0x000000}); // black tile
        overlay_map[2] = new THREE.MeshBasicMaterial({color: 0x6699FF}); // water
        overlay_map[9] = new THREE.MeshBasicMaterial({color: 0xA9A9A9}); // grey mountain side surface
        // new THREE.MeshBasicMaterial({color: 0x367f23});

        overlay_map[3] = new THREE.MeshBasicMaterial({map: floor}); // floor wooden
        // vertical walls starts at 300
        overlay_map[300 + 1] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3222.png')});

        // horizontal walls start at 350
        overlay_map[350 + 1] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3222v.png')});

        for (var i = 0; i < 500; i++) {
            var obj = overlay_map[i];
            if (obj != null) {
            console.error("found " + i);
                materials[i] = obj;
            }
        }
        materials[0] = new THREE.MeshBasicMaterial({color: 0xffffff});
    } catch(error) {
        console.error(error);
    }





   /* materials[0] = new THREE.MeshBasicMaterial({color: 0x367f23}); // green grass
   // materials[1] = new THREE.MeshBasicMaterial({color: 0x404040}); // grey paths
    materials[2] = new THREE.MeshBasicMaterial({
        map: new THREE.ImageUtils.loadTexture('img/3222.png')
    }); // walls
    materials[3] = new THREE.MeshBasicMaterial({
        map: new THREE.ImageUtils.loadTexture('img/3222v.png')
    });
    var floor = new THREE.ImageUtils.loadTexture('img/3223.png');
   // floor.rotate.x = Math.PI / 2;
    floor.wrapS = floor.wrapT = THREE.RepeatWrapping;
    floor.repeat.set(16, 16);
    materials[4] = new THREE.MeshBasicMaterial({map: floor}); // floor wooden
    materials[5] = new THREE.MeshBasicMaterial({color: 0xA9A9A9}); // mountain sides
  //  materials[6] = new THREE.MeshBasicMaterial({color: 0x6699FF}); // grey paths
  //  materials[7] = new THREE.MeshBasicMaterial({color: 0x6F0410}); // red bank floor
    materials[8] = new THREE.MeshBasicMaterial({color: 0x000000}); // red bank floor
*/

}
function loadSectors() {

    var Tiles = new Array((TILE_COUNT*TILE_COUNT) * Sectors.length);

    var sectX = 0;
    var sectY = 0;

    var masterGeometry = new THREE.PlaneGeometry(0 , 0 , 0, 0);
    for(var s=0; s < Sectors.length; s++) {
        if (sectX == 3) {
            sectX = 0;
            sectY++;
        }
        var sectorIndex = s;
        var idx = 0;
        var view = Sectors[s];
        var geometry = new THREE.PlaneGeometry((TILE_MESH_SIZE * TILE_COUNT), (TILE_MESH_SIZE * TILE_COUNT), TILE_COUNT, TILE_COUNT);
        for (var x = 0; x < TILE_COUNT; x++) {
            for (var y = 0; y < TILE_COUNT; y++) {
                var tile = new Tile(sectorIndex + 1, sectX, sectY, x, y, view.getUint8(idx), view.getUint8(idx + 1), view.getUint8(idx + 2), view.getUint8(idx + 3), view.getUint8(idx + 4), view.getUint8(idx + 5), view.getUint32(idx + 6), s);

                Tiles[((x * 48) + y) * (sectorIndex + 1)] = tile;
                idx += 10;
            }
        }


        // set elevation
        for (var xx = 0; xx < 48; xx++) {
            for (var yy = 0; yy < 48; yy++) {
                t = (xx * 48 + yy) * (sectorIndex + 1);
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



        // paint tile
        l = geometry.faces.length / 2;
        for (var i = 0; i < l; i++) {
            var j = 2 * i;
            var til = Tiles[i * (sectorIndex + 1)];

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



            /*if(til.groundOverlay in overlay_map) {
                geometry.faces[j].materialIndex = overlay_map[til.groundOverlay];
                geometry.faces[j + 1].materialIndex = overlay_map[til.groundOverlay];
            }*/
            /*
            if (til.groundTexture > 0) { // tile gradient
                geometry.faces[j].materialIndex = 100 + til.groundTexture;
                geometry.faces[j + 1].materialIndex = 100 + til.groundTexture;
            }
            if (til.groundOverlay == 1 || til.groundOverlay == 6) { // grey paths
                geometry.faces[j].materialIndex = 1;
                geometry.faces[j + 1].materialIndex = 1;
            }

            if (til.groundOverlay == 6) { // red bank floors
                geometry.faces[j].materialIndex = 7;
                geometry.faces[j + 1].materialIndex = 7;
            }

            if (til.groundOverlay == 3) { // floor
                geometry.faces[j].materialIndex = 4;
                geometry.faces[j + 1].materialIndex = 4;
            }
            if (til.groundOverlay == 9) { // al kharid mine mountain?

                geometry.faces[j].materialIndex = 5;
                geometry.faces[j + 1].materialIndex = 5;
            }

            if (til.groundOverlay == 2) { // water

                geometry.faces[j].materialIndex = 6;
                geometry.faces[j + 1].materialIndex = 6;
            }

            if (til.groundOverlay == 16) { // black chequered tile
                geometry.faces[j].materialIndex = 8;
                geometry.faces[j + 1].materialIndex = 8;
            }*/

        }

        /**
         * Wall loading, clean this up make code smaller etc
         *
         */
        var tempGeom = new THREE.PlaneGeometry(0, 0);
        var tempMesh = new THREE.Mesh(tempGeom, new THREE.MeshFaceMaterial(materials));
        l = geometry.faces.length / 2;
        for (var i = 0; i < l; i++) {
            var j = 2 * i;
            var til = Tiles[i * (sectorIndex + 1)];
            if (til == null)
                continue;


            if (til.horizontalWall > 0) {



                var overlayGeom = new THREE.PlaneGeometry(1, 1);
                var obj = overlay_map[til.horizontalWall + 350];
                if(obj != null) {
                    overlayGeom.faces[0].materialIndex = til.horizontalWall + 350;
                    overlayGeom.faces[1].materialIndex = til.horizontalWall + 350;
                }
               // overlayGeom.faces[0].materialIndex = 300 + til.horizontalWall;
              //  overlayGeom.faces[1].materialIndex = 300 + til.horizontalWall;
                var wall = new THREE.Mesh(overlayGeom, new THREE.MeshFaceMaterial(materials));
                wall.rotation.y = Math.PI / 2;
                wall.position.x = til.x - (TILE_COUNT / 2);
                wall.position.y = til.y - (TILE_COUNT / 2) + 0.5;
                var base = 0;
                var multi = 0.04;
                if(til.groundElevation < 128) {
                    base -= multi * (128 - til.groundElevation);
                } else {
                    base += multi * Math.abs((128 - til.groundElevation));
                }
                wall.position.z = base + 0.5;

                wall.updateMatrix();
                tempGeom.merge(wall.geometry, wall.matrix);
            }

            if (til.verticalWall > 0) {

                var overlayGeom = new THREE.PlaneGeometry(1, 1);
                var obj = overlay_map[til.verticalWall + 300];
                if(obj != null) {
                    overlayGeom.faces[0].materialIndex = til.verticalWall + 300;
                    overlayGeom.faces[1].materialIndex = til.verticalWall + 300;
                }
               // overlayGeom.faces[0].materialIndex = 350 + til.verticalWall;
               // overlayGeom.faces[1].materialIndex = 350 + til.verticalWall;
                var wall = new THREE.Mesh(overlayGeom, new THREE.MeshFaceMaterial(materials));
                wall.rotation.x = Math.PI / 2;
                wall.position.x = til.x - (TILE_COUNT / 2) + 0.5;
                wall.position.y = til.y - (TILE_COUNT / 2);

                var base = 0;
                var multi = 0.04;
                if(til.groundElevation < 128) {
                    base -= multi * (128 - til.groundElevation);
                } else {
                    base += multi * Math.abs((128 - til.groundElevation));
                }
                wall.position.z = base + 0.5;

                wall.updateMatrix();
                tempGeom.merge(wall.geometry, wall.matrix);
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

    }

    for (var i = 0; i < materials.length; i++) {
        var obj = materials[i];
        if (obj != null) {
            console.error("foundd " + i);
          //  materials[i] = obj;
        }
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
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0x000000 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    var axisHelper = new THREE.AxisHelper( 5 );
    scene.add( axisHelper );

    camera.updateProjectionMatrix();

    //   controls.update();
    //document.addEventListener( 'mousedown', onDocumentMouseDown, false );
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
        loadSectors();
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

    event.preventDefault();

    /* mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
     mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

     raycaster.setFromCamera( mouse, camera );

     var intersects = raycaster.intersectObjects( objects );

     if ( intersects.length > 0 ) {

     var intersect = intersects[ 0 ];

     if ( isShiftDown ) {

     if ( intersect.object != plane ) {

     scene.remove( intersect.object );

     objects.splice( objects.indexOf( intersect.object ), 1 );

     }

     } else {

     var voxel = new THREE.Mesh( cubeGeometry, cubeMaterial );
     voxel.position.copy( intersect.point ).add( intersect.face.normal );
     voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
     scene.add( voxel );

     objects.push( voxel );

     }

     animate();

     }*/

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
