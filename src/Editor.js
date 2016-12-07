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

function initEditor() {
    setup();
    html();
    animate();
}

function openFile(event) {
    var file = event.target.files[0];
    var jsZip = new JSZip()
    jsZip.loadAsync(file).then(function (zip) {
        var x=50, y=47;
        var offsets = [[-1, -1],[0, -1],[1, -1], [-1, 0],[0, 0],[1, 0], [-1, 1],[0, 1],[1, 1]];
        for(var i=0; i < offsets.length; i++) {
            zip.files["h0x" + (x + offsets[i][0]) + "y" + (y + offsets[i][1])].async('arraybuffer').then(function (fileData) {
                var view = new DataView(fileData);
                Sectors.push(view);
            })
        }
        loadSectors();
    })
}

function prepMaterials() {
    materials[0] = new THREE.MeshBasicMaterial({color: 0x367f23}); // green grass
    materials[1] = new THREE.MeshBasicMaterial({color: 0x404040}); // grey paths
    materials[2] = new THREE.MeshBasicMaterial({
        map: new THREE.ImageUtils.loadTexture('img/3222.png'),
        side: THREE.DoubleSide
    }); // walls
    materials[3] = new THREE.MeshBasicMaterial({
        map: new THREE.ImageUtils.loadTexture('img/3222v.png'),
        side: THREE.DoubleSide
    }); // walls vert
    var floor = new THREE.ImageUtils.loadTexture('img/3223.png');
    floor.wrapS = floor.wrapT = THREE.RepeatWrapping;
    floor.repeat.set(16, 16);
    materials[4] = new THREE.MeshBasicMaterial({map: floor}); // floor wooden
    materials[5] = new THREE.MeshBasicMaterial({color: 0xffffff}); // grey paths
    materials[6] = new THREE.MeshBasicMaterial({color: 0x6699FF}); // grey paths

    // set base tile gradient from array. starting them at 100.
    for (var i = 0; i < tileColors.length; i++) {
        materials[100 + i] = new THREE.MeshBasicMaterial({
            color: tileColors[i]
        });
    }


}
function loadSectors() {

    var Tiles = new Array((TILE_COUNT*TILE_COUNT) * Sectors.length);
    console.log(Sectors.length);

    var sectX = 0;
    var sectY = 0;

    prepMaterials();
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
                var tile = new Tile(sectorIndex, sectX, sectY, x, y + (s * 48), view.getUint8(idx), view.getUint8(idx + 1), view.getUint8(idx + 2), view.getUint8(idx + 3), view.getUint8(idx + 4), view.getUint8(idx + 5), view.getUint32(idx + 6), s);
                Tiles[((x * 48) + y) * sectorIndex] = tile;
                var pos = ((x * 48) + y);
                idx += 10;
            }
        }


        /**
         *
         * ELEVATION MESSIN AROUND. CANT SEEM TO GET THE CORRECT VERTICES OF EACH TILE, TO GO HIGHER/LOWER.
         */
        // set elevation
        for (var xx = 0; xx < 48; xx++) {
            for (var yy = 0; yy < 48; yy++) {
                t = (xx * 48 + yy) * sectorIndex;
                v = (xx * 49 + yy);
                if (Tiles[t] == null) continue;
                geometry.vertices[v].z = Tiles[t].groundElevation / 20;
            }
        }


        // paint tile
        l = geometry.faces.length / 2;
        for (var i = 0; i < l; i++) {
            var j = 2 * i;
            var til = Tiles[i * sectorIndex];
            if (til == null)
                continue;
            if (til.groundTexture > 0) { // tile gradient
                geometry.faces[j].materialIndex = 100 + til.groundTexture;
                geometry.faces[j + 1].materialIndex = 100 + til.groundTexture;
            }
            if (til.groundOverlay == 1) { // grey paths
                geometry.faces[j].materialIndex = 1;
                geometry.faces[j + 1].materialIndex = 1;
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

            /**
             *
             *
             *
             * REWRITE the below things, possibly in a new format like above, for fps.
             */
            if (til.verticalWall > 0) {

              /*  var overlayGeom = new THREE.PlaneGeometry(1, 1);
                var wall = new THREE.Mesh(overlayGeom, materials[4]);
                wall.rotation.x = Math.PI / 2;
                wall.position.x = (til.x * TILE_MESH_SIZE);
                wall.position.y = til.y * TILE_MESH_SIZE + (TILE_MESH_SIZE / 2);
                wall.position.z = til.cube.position.z + 0.3 + ((til.groundElevation/ 50) / 5);
                console.log(wall.position.z);

                scene.add(wall);*/
            }
            if (til.horizontalWall > 0) {

                /*var overlayGeom = new THREE.PlaneGeometry(1, 1);
                 var wall = new THREE.Mesh(overlayGeom, wallVertMat);
                 wall.rotation.y = Math.PI / 2;
                 wall.position.x = (tile.x * TILE_MESH_SIZE) + (TILE_MESH_SIZE / 2);
                 wall.position.y = tile.y * TILE_MESH_SIZE;
                 wall.position.z = tile.cube.position.z + 0.3 + ((tile.groundElevation/ 50) / 5);
                 console.log(wall.position.z);

                 scene.add(wall);
                 */
            }


            if (til.diagonalWall == 1) {
                /*
                 var overlayTexture = new THREE.ImageUtils.loadTexture( 'img/3222.png' );
                 var overlayMat = new THREE.MeshBasicMaterial( { map: overlayTexture, side:THREE.DoubleSide } );
                 var overlayGeom = new THREE.PlaneGeometry(1, 1);
                 var wall = new THREE.Mesh(overlayGeom, wallMat);
                 wall.rotation.y = Math.PI / 2;
                 //  wall.rotation.x = Math.PI / 8
                 //wall.rotation.x = Math.PI / 4; // corner
                 wall.position.x = (tile.x * TILE_MESH_SIZE) + (TILE_MESH_SIZE / 2);
                 wall.position.y = tile.y * TILE_MESH_SIZE;
                 wall.position.z = tile.cube.position.z + 1.5;
                 console.log(wall.position.z);
                 */
                //  scene.add(wall);
            }


        }

        l = geometry.faces.length / 2;
        for (var i = 0; i < l; i++) {
            var j = 2 * i;
            var til = Tiles[i * sectorIndex];
            if (til == null)
                continue;
            if (til.verticalWall > 0) {

                var overlayGeom = new THREE.PlaneGeometry(1, 1);
                overlayGeom.faces[0].materialIndex = 2;
                overlayGeom.faces[1].materialIndex = 2;
                var wall = new THREE.Mesh(overlayGeom, new THREE.MeshFaceMaterial(materials));
                wall.rotation.x = Math.PI / 2;
                wall.position.x = (til.x ) + (48 * sectX);
                wall.position.y =( til.y  )  + (48 * sectY);

              //  wall.position.set(til.x, til.y, 10);
              //  wall.position.z = ((til.groundElevation/ 20) + 5);
                wall.updateMatrix();
                geometry.merge(wall.geometry, wall.matrix);
               // scene.add(wall);
            }
        }


        // mesh
        var tmesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        tmesh.position.set(-(TILE_MESH_SIZE * TILE_COUNT / 2) - 48 * sectX, -(TILE_MESH_SIZE * TILE_COUNT / 2) - 48  * sectY, 0);
       tmesh.rotation.z = -Math.PI / 2
       // scene.add(tmesh);
      // tmesh.rotateZ( Math.PI);
        tmesh.updateMatrix();
        masterGeometry.merge(tmesh.geometry, tmesh.matrix);
        sectX++;

    }

    mesh = new THREE.Mesh(masterGeometry, new THREE.MeshFaceMaterial(materials));
    // mesh.position.set(-(TILE_MESH_SIZE*TILE_COUNT / 2) - 48, -(TILE_MESH_SIZE*TILE_COUNT / 2) - 48, 0);
   // mesh.position.set(-(TILE_MESH_SIZE * TILE_COUNT / 2) - 48 * sectX, -(TILE_MESH_SIZE * TILE_COUNT / 2) - 48  * sectY, 0);

    scene.add(mesh);


      /* for(var x=0; x < TILE_COUNT; x++) {
            Tiles[x] = new Array(TILE_COUNT);
            for(var y=0; y < TILE_COUNT; y++) {
              //  var tile = Tiles[x][y];
                var tile = Tiles[(x*48)+y];
                addTile(tile);
            }
        }

    }*/

    animate();
}

function setup() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );


    //camera.position.set(-40, -40, 80);
   // camera.position.y = -22.635656355403956;
   // camera.position.x = -21.190077055448253;
 //   camera.position.set( -11.148991658901329, -28.942319855662255, 39.94132960553199 );
  //  camera.rotation.set( 0.7650157386463888, -0.00138910089589484717, 0.0013335966942509471 );
    var light = new THREE.AmbientLight(  0x404040 ); // soft white light
    scene.add( light );
    //camera.up = new THREE.Vector3(0,0,1);
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
      //  controls.target.set(-23.248868591147353, -29.39917688607892, 0);
     //   camera.rotation.set(0, 0, 0);
        controls.zoomSpeed = 0.5;
       // controls.target.set(-20, -20, 200);
      //  controls.target.set(0, 0, 0);
     //   camera.rotation.set(0, 0, 0);
        camera.position.set(0, 0, 200);
        controls.enabled = false;

       // controls.position.set(-40, -40, 80);
        controls.enabled = true;
        controls.enablePan = true;
        controls.enableZoom = true;
        controls.update();
       // camera.lookAt(new THREE.Vector3(0,10,0));


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
