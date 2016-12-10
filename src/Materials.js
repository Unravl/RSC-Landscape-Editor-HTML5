/**
 * Created by Hayden on 12/10/2016.
 */

var materials = [];

function prepMaterials() {

    // ground textures start at 500, to give room for other materials
    materials[0] = new THREE.MeshBasicMaterial({color: 0xffffff});
    for (var i = 0; i < tileColors.length; i++) {
        materials[500 + i] = new THREE.MeshBasicMaterial({
            color: tileColors[i]
        });
    }

    var floor = new THREE.ImageUtils.loadTexture('img/3223.png');
    floor.wrapS = floor.wrapT = THREE.RepeatWrapping;
    floor.repeat.set(64, 64);

    var water = new THREE.ImageUtils.loadTexture('img/3221.png');
    water.wrapS = water.wrapT = THREE.RepeatWrapping;
    water.repeat.set(64, 64);


    // index is the overlay ID.
    overlay_map[1] = new THREE.MeshBasicMaterial({color: 0x404040}); // grey tile

    overlay_map[5] = new THREE.MeshBasicMaterial({color: 0x404040}); //grey tile
    overlay_map[6] = new THREE.MeshBasicMaterial({color: 0x6F0410}); // red tile
    overlay_map[16] = new THREE.MeshBasicMaterial({color: 0x000000}); // black tile
    overlay_map[9] = new THREE.MeshBasicMaterial({color: 0xA9A9A9}); // grey mountain side surface
    // new THREE.MeshBasicMaterial({color: 0x367f23});

    overlay_map[3] = new THREE.MeshBasicMaterial({map: floor}); // floor wooden
    overlay_map[2] = new THREE.MeshBasicMaterial({map: water}); // water
    // vertical walls starts at 300
    overlay_map[300 + 1] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3222.png'), side: THREE.DoubleSide});
    overlay_map[300 + 4] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3222w.png'), side: THREE.DoubleSide});
    overlay_map[300 + 5] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3230.png'), side: THREE.DoubleSide, transparent: true});
    overlay_map[300 + 128] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3230.png'), side: THREE.DoubleSide, transparent: true});
    overlay_map[300 + 15] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3241.png'), side: THREE.DoubleSide});
    overlay_map[300 + 16] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3241w.png'), side: THREE.DoubleSide});

    // horizontal walls start at 350
    overlay_map[350 + 1] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3222v.png'), side: THREE.DoubleSide});
    overlay_map[350 + 4] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3222vw.png'), side: THREE.DoubleSide});
    overlay_map[350 + 5] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3230v.png'), side: THREE.DoubleSide, transparent: true});
    overlay_map[350 + 128] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3230v.png'), side: THREE.DoubleSide, transparent: true});
    overlay_map[350 + 15] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3241v.png'), side: THREE.DoubleSide});
    overlay_map[350 + 16] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3241vw.png'), side: THREE.DoubleSide});

    // dump into materials
    for (var i = 0; i < 500; i++) {
        var obj = overlay_map[i];
        if (obj != null) {
            materials[i] = obj;
        }
    }
    materials[0] = new THREE.MeshBasicMaterial({color: 0xffffff});

}