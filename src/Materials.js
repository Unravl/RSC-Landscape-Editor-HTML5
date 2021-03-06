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
    overlay_map[8] = new THREE.MeshBasicMaterial({color: 0x000000}); // black tile
    overlay_map[9] = new THREE.MeshBasicMaterial({color: 0xA9A9A9}); // grey mountain side surface
    // new THREE.MeshBasicMaterial({color: 0x367f23});

    overlay_map[3] = new THREE.MeshBasicMaterial({map: floor}); // floor wooden
    overlay_map[2] = new THREE.MeshBasicMaterial({map: water}); // water
    // vertical walls starts at 300
    overlay_map[300 + 1] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3222.png'), side: THREE.DoubleSide});
    overlay_map[300 + 8] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3222.png'), side: THREE.DoubleSide});
    overlay_map[300 + 4] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3222w.png'), side: THREE.DoubleSide});
    overlay_map[300 + 5] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3230.png'), side: THREE.DoubleSide, transparent: true});
    overlay_map[300 + 128] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3230.png'), side: THREE.DoubleSide, transparent: true});
    overlay_map[300 + 15] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3241.png'), side: THREE.DoubleSide});
    overlay_map[300 + 16] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3241w.png'), side: THREE.DoubleSide});
    overlay_map[300 + 6] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/6.png'), side: THREE.DoubleSide, transparent: true});
    overlay_map[300 + 7] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/7.bmp'), side: THREE.DoubleSide});
    overlay_map[300 + 14] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/14.png'), side: THREE.DoubleSide});
    overlay_map[300 + 35] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/35.bmp'), side: THREE.DoubleSide});
    overlay_map[300 + 19] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3243.png'), side: THREE.DoubleSide});
    overlay_map[300 + 42] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/42.png'), side: THREE.DoubleSide, transparent: true});
    overlay_map[300 + 11] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/11.png'), side: THREE.DoubleSide, transparent: true});


    // horizontal walls start at 350
    overlay_map[350 + 1] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3222v.png'), side: THREE.DoubleSide});
    overlay_map[350 + 11] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/11v.png'), side: THREE.DoubleSide, transparent: true});
    overlay_map[350 + 6] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/6v.png'), side: THREE.DoubleSide, transparent: true});
    overlay_map[350 + 7] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/7v.bmp'), side: THREE.DoubleSide});
    overlay_map[350 + 14] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/14v.png'), side: THREE.DoubleSide});
    overlay_map[350 + 35] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/35v.bmp'), side: THREE.DoubleSide});
    overlay_map[350 + 19] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3243v.png'), side: THREE.DoubleSide});
    overlay_map[350 + 8] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3222v.png'), side: THREE.DoubleSide});
    overlay_map[350 + 4] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3222vw.png'), side: THREE.DoubleSide});
    overlay_map[350 + 5] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3230v.png'), side: THREE.DoubleSide, transparent: true});
    overlay_map[350 + 128] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/3230v.png'), side: THREE.DoubleSide, transparent: true});
    overlay_map[350 + 42] = new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('img/42v.png'), side: THREE.DoubleSide, transparent: true});
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



var tileColors = new Array(new THREE.Color("rgb(255, 255, 255)"), new THREE.Color("rgb(251, 254, 251)"), new THREE.Color("rgb(247, 252, 247)"),
    new THREE.Color("rgb(243, 250, 243)"), new THREE.Color("rgb(239, 248, 239)"), new THREE.Color("rgb(235, 247, 235)"), new THREE.Color("rgb(231, 245, 231)"),
    new THREE.Color("rgb(227, 243, 227)"), new THREE.Color("rgb(223, 241, 223)"), new THREE.Color("rgb(219, 240, 219)"), new THREE.Color("rgb(215, 238, 215)"),
    new THREE.Color("rgb(211, 236, 211)"), new THREE.Color("rgb(207, 234, 207)"), new THREE.Color("rgb(203, 233, 203)"), new THREE.Color("rgb(199, 231, 199)"),
    new THREE.Color("rgb(195, 229, 195)"), new THREE.Color("rgb(191, 227, 191)"), new THREE.Color("rgb(187, 226, 187)"), new THREE.Color("rgb(183, 224, 183)"),
    new THREE.Color("rgb(179, 222, 179)"), new THREE.Color("rgb(175, 220, 175)"), new THREE.Color("rgb(171, 219, 171)"), new THREE.Color("rgb(167, 217, 167)"),
    new THREE.Color("rgb(163, 215, 163)"), new THREE.Color("rgb(159, 213, 159)"), new THREE.Color("rgb(155, 212, 155)"), new THREE.Color("rgb(151, 210, 151)"),
    new THREE.Color("rgb(147, 208, 147)"), new THREE.Color("rgb(143, 206, 143)"), new THREE.Color("rgb(139, 205, 139)"), new THREE.Color("rgb(135, 203, 135)"),
    new THREE.Color("rgb(131, 201, 131)"), new THREE.Color("rgb(127, 199, 127)"), new THREE.Color("rgb(123, 198, 123)"), new THREE.Color("rgb(119, 196, 119)"),
    new THREE.Color("rgb(115, 194, 115)"), new THREE.Color("rgb(111, 192, 111)"), new THREE.Color("rgb(107, 191, 107)"), new THREE.Color("rgb(103, 189, 103)"),
    new THREE.Color("rgb(99, 187, 99)"), new THREE.Color("rgb(95, 185, 95)"), new THREE.Color("rgb(91, 184, 91)"), new THREE.Color("rgb(87, 182, 87)"),
    new THREE.Color("rgb(83, 180, 83)"), new THREE.Color("rgb(79, 178, 79)"), new THREE.Color("rgb(75, 177, 75)"), new THREE.Color("rgb(71, 175, 71)"),
    new THREE.Color("rgb(67, 173, 67)"), new THREE.Color("rgb(63, 171, 63)"), new THREE.Color("rgb(59, 170, 59)"), new THREE.Color("rgb(55, 168, 55)"),
    new THREE.Color("rgb(51, 166, 51)"), new THREE.Color("rgb(47, 164, 47)"), new THREE.Color("rgb(43, 163, 43)"), new THREE.Color("rgb(39, 161, 39)"),
    new THREE.Color("rgb(35, 159, 35)"), new THREE.Color("rgb(31, 157, 31)"), new THREE.Color("rgb(27, 156, 27)"), new THREE.Color("rgb(23, 154, 23)"),
    new THREE.Color("rgb(19, 152, 19)"), new THREE.Color("rgb(15, 150, 15)"), new THREE.Color("rgb(11, 149, 11)"), new THREE.Color("rgb(7, 147, 7)"),
    new THREE.Color("rgb(3, 145, 3)"), new THREE.Color("rgb(0, 144, 0)"), new THREE.Color("rgb(3, 144, 0)"), new THREE.Color("rgb(6, 144, 0)"),
    new THREE.Color("rgb(9, 144, 0)"), new THREE.Color("rgb(12, 144, 0)"), new THREE.Color("rgb(15, 144, 0)"), new THREE.Color("rgb(18, 144, 0)"),
    new THREE.Color("rgb(21, 144, 0)"), new THREE.Color("rgb(24, 144, 0)"), new THREE.Color("rgb(27, 144, 0)"), new THREE.Color("rgb(30, 144, 0)"),
    new THREE.Color("rgb(33, 144, 0)"), new THREE.Color("rgb(36, 144, 0)"), new THREE.Color("rgb(39, 144, 0)"), new THREE.Color("rgb(42, 144, 0)"),
    new THREE.Color("rgb(45, 144, 0)"), new THREE.Color("rgb(48, 144, 0)"), new THREE.Color("rgb(51, 144, 0)"), new THREE.Color("rgb(54, 144, 0)"),
    new THREE.Color("rgb(57, 144, 0)"), new THREE.Color("rgb(60, 144, 0)"), new THREE.Color("rgb(63, 144, 0)"), new THREE.Color("rgb(66, 144, 0)"),
    new THREE.Color("rgb(69, 144, 0)"), new THREE.Color("rgb(72, 144, 0)"), new THREE.Color("rgb(75, 144, 0)"), new THREE.Color("rgb(78, 144, 0)"),
    new THREE.Color("rgb(81, 144, 0)"), new THREE.Color("rgb(84, 144, 0)"), new THREE.Color("rgb(87, 144, 0)"), new THREE.Color("rgb(90, 144, 0)"),
    new THREE.Color("rgb(93, 144, 0)"), new THREE.Color("rgb(96, 144, 0)"), new THREE.Color("rgb(99, 144, 0)"), new THREE.Color("rgb(102, 144, 0)"),
    new THREE.Color("rgb(105, 144, 0)"), new THREE.Color("rgb(108, 144, 0)"), new THREE.Color("rgb(111, 144, 0)"), new THREE.Color("rgb(114, 144, 0)"),
    new THREE.Color("rgb(117, 144, 0)"), new THREE.Color("rgb(120, 144, 0)"), new THREE.Color("rgb(123, 144, 0)"), new THREE.Color("rgb(126, 144, 0)"),
    new THREE.Color("rgb(129, 144, 0)"), new THREE.Color("rgb(132, 144, 0)"), new THREE.Color("rgb(135, 144, 0)"), new THREE.Color("rgb(138, 144, 0)"),
    new THREE.Color("rgb(141, 144, 0)"), new THREE.Color("rgb(144, 144, 0)"), new THREE.Color("rgb(147, 144, 0)"), new THREE.Color("rgb(150, 144, 0)"),
    new THREE.Color("rgb(153, 144, 0)"), new THREE.Color("rgb(156, 144, 0)"), new THREE.Color("rgb(159, 144, 0)"), new THREE.Color("rgb(162, 144, 0)"),
    new THREE.Color("rgb(165, 144, 0)"), new THREE.Color("rgb(168, 144, 0)"), new THREE.Color("rgb(171, 144, 0)"), new THREE.Color("rgb(174, 144, 0)"),
    new THREE.Color("rgb(177, 144, 0)"), new THREE.Color("rgb(180, 144, 0)"), new THREE.Color("rgb(183, 144, 0)"), new THREE.Color("rgb(186, 144, 0)"),
    new THREE.Color("rgb(189, 144, 0)"), new THREE.Color("rgb(192, 144, 0)"), new THREE.Color("rgb(191, 143, 0)"), new THREE.Color("rgb(189, 141, 0)"),
    new THREE.Color("rgb(188, 140, 0)"), new THREE.Color("rgb(186, 138, 0)"), new THREE.Color("rgb(185, 137, 0)"), new THREE.Color("rgb(183, 135, 0)"),
    new THREE.Color("rgb(182, 134, 0)"), new THREE.Color("rgb(180, 132, 0)"), new THREE.Color("rgb(179, 131, 0)"), new THREE.Color("rgb(177, 129, 0)"),
    new THREE.Color("rgb(176, 128, 0)"), new THREE.Color("rgb(174, 126, 0)"), new THREE.Color("rgb(173, 125, 0)"), new THREE.Color("rgb(171, 123, 0)"),
    new THREE.Color("rgb(170, 122, 0)"), new THREE.Color("rgb(168, 120, 0)"), new THREE.Color("rgb(167, 119, 0)"), new THREE.Color("rgb(165, 117, 0)"),
    new THREE.Color("rgb(164, 116, 0)"), new THREE.Color("rgb(162, 114, 0)"), new THREE.Color("rgb(161, 113, 0)"), new THREE.Color("rgb(159, 111, 0)"),
    new THREE.Color("rgb(158, 110, 0)"), new THREE.Color("rgb(156, 108, 0)"), new THREE.Color("rgb(155, 107, 0)"), new THREE.Color("rgb(153, 105, 0)"),
    new THREE.Color("rgb(152, 104, 0)"), new THREE.Color("rgb(150, 102, 0)"), new THREE.Color("rgb(149, 101, 0)"), new THREE.Color("rgb(147, 99, 0)"),
    new THREE.Color("rgb(146, 98, 0)"), new THREE.Color("rgb(144, 96, 0)"), new THREE.Color("rgb(143, 95, 0)"), new THREE.Color("rgb(141, 93, 0)"),
    new THREE.Color("rgb(140, 92, 0)"), new THREE.Color("rgb(138, 90, 0)"), new THREE.Color("rgb(137, 89, 0)"), new THREE.Color("rgb(135, 87, 0)"),
    new THREE.Color("rgb(134, 86, 0)"), new THREE.Color("rgb(132, 84, 0)"), new THREE.Color("rgb(131, 83, 0)"), new THREE.Color("rgb(129, 81, 0)"),
    new THREE.Color("rgb(128, 80, 0)"), new THREE.Color("rgb(126, 78, 0)"), new THREE.Color("rgb(125, 77, 0)"), new THREE.Color("rgb(123, 75, 0)"),
    new THREE.Color("rgb(122, 74, 0)"), new THREE.Color("rgb(120, 72, 0)"), new THREE.Color("rgb(119, 71, 0)"), new THREE.Color("rgb(117, 69, 0)"),
    new THREE.Color("rgb(116, 68, 0)"), new THREE.Color("rgb(114, 66, 0)"), new THREE.Color("rgb(113, 65, 0)"), new THREE.Color("rgb(111, 63, 0)"),
    new THREE.Color("rgb(110, 62, 0)"), new THREE.Color("rgb(108, 60, 0)"), new THREE.Color("rgb(107, 59, 0)"), new THREE.Color("rgb(105, 57, 0)"),
    new THREE.Color("rgb(104, 56, 0)"), new THREE.Color("rgb(102, 54, 0)"), new THREE.Color("rgb(101, 53, 0)"), new THREE.Color("rgb(99, 51, 0)"),
    new THREE.Color("rgb(98, 50, 0)"), new THREE.Color("rgb(96, 48, 0)"), new THREE.Color("rgb(95, 49, 0)"), new THREE.Color("rgb(93, 51, 0)"),
    new THREE.Color("rgb(92, 52, 0)"), new THREE.Color("rgb(90, 54, 0)"), new THREE.Color("rgb(89, 55, 0)"), new THREE.Color("rgb(87, 57, 0)"),
    new THREE.Color("rgb(86, 58, 0)"), new THREE.Color("rgb(84, 60, 0)"), new THREE.Color("rgb(83, 61, 0)"), new THREE.Color("rgb(81, 63, 0)"),
    new THREE.Color("rgb(80, 64, 0)"), new THREE.Color("rgb(78, 66, 0)"), new THREE.Color("rgb(77, 67, 0)"), new THREE.Color("rgb(75, 69, 0)"),
    new THREE.Color("rgb(74, 70, 0)"), new THREE.Color("rgb(72, 72, 0)"), new THREE.Color("rgb(71, 73, 0)"), new THREE.Color("rgb(69, 75, 0)"),
    new THREE.Color("rgb(68, 76, 0)"), new THREE.Color("rgb(66, 78, 0)"), new THREE.Color("rgb(65, 79, 0)"), new THREE.Color("rgb(63, 81, 0)"),
    new THREE.Color("rgb(62, 82, 0)"), new THREE.Color("rgb(60, 84, 0)"), new THREE.Color("rgb(59, 85, 0)"), new THREE.Color("rgb(57, 87, 0)"),
    new THREE.Color("rgb(56, 88, 0)"), new THREE.Color("rgb(54, 90, 0)"), new THREE.Color("rgb(53, 91, 0)"), new THREE.Color("rgb(51, 93, 0)"),
    new THREE.Color("rgb(50, 94, 0)"), new THREE.Color("rgb(48, 96, 0)"), new THREE.Color("rgb(47, 97, 0)"), new THREE.Color("rgb(45, 99, 0)"),
    new THREE.Color("rgb(44, 100, 0)"), new THREE.Color("rgb(42, 102, 0)"), new THREE.Color("rgb(41, 103, 0)"), new THREE.Color("rgb(39, 105, 0)"),
    new THREE.Color("rgb(38, 106, 0)"), new THREE.Color("rgb(36, 108, 0)"), new THREE.Color("rgb(35, 109, 0)"), new THREE.Color("rgb(33, 111, 0)"),
    new THREE.Color("rgb(32, 112, 0)"), new THREE.Color("rgb(30, 114, 0)"), new THREE.Color("rgb(29, 115, 0)"), new THREE.Color("rgb(27, 117, 0)"),
    new THREE.Color("rgb(26, 118, 0)"), new THREE.Color("rgb(24, 120, 0)"), new THREE.Color("rgb(23, 121, 0)"), new THREE.Color("rgb(21, 123, 0)"),
    new THREE.Color("rgb(20, 124, 0)"), new THREE.Color("rgb(18, 126, 0)"), new THREE.Color("rgb(17, 127, 0)"), new THREE.Color("rgb(15, 129, 0)"),
    new THREE.Color("rgb(14, 130, 0)"), new THREE.Color("rgb(12, 132, 0)"), new THREE.Color("rgb(11, 133, 0)"), new THREE.Color("rgb(9, 135, 0)"),
    new THREE.Color("rgb(8, 136, 0)"), new THREE.Color("rgb(6, 138, 0)"), new THREE.Color("rgb(5, 139, 0)"), new THREE.Color("rgb(3, 141, 0)"),
    new THREE.Color("rgb(2, 142, 0)")
);