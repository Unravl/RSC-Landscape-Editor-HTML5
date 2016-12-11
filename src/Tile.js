/**
 * Created by Hayden on 12/1/2016.
 */

function Tile(sector, sectX, sectY, x, y, groundElevation, groundTexture, groundOverlay, roofTexture, horizontalWall, verticalWall, diagonalWall, sect, absoluteSectorX, absoluteSectorY) {

    this.x = x;
    this.y = y;
    this.sector = sector;
    this.sectX = sectX;
    this.sectY = sectY;
    this.absoluteSectorX = absoluteSectorX;
    this.absoluteSectorY = absoluteSectorY;



    this.groundElevation = groundElevation;
    this.groundTexture = groundTexture;
    this.groundOverlay = groundOverlay;
    this.roofTexture = roofTexture;
    this.horizontalWall = horizontalWall;
    this.verticalWall = verticalWall;
    this.diagonalWall = diagonalWall;
    this.meshColor = tileColors[this.groundTexture].getHex();

}
