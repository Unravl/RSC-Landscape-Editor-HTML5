

var ui_coords = new UI.Text( "" );
var ui_local_coords = new UI.Text( "" );
var sectorIdx = new UI.Text( "" );
var sectorName = new UI.Text( "" );
var  tileIdx = new UI.Text( "" );
var tile_elevation = new UI.Text( "" );
var tile_overlay = new UI.Text( "" );
var tile_texture = new UI.Text( "" );
var   tile_vertical = new UI.Text( "" );
var  tile_diagonal = new UI.Text( "" );
var tile_horizontal = new UI.Text( "" );
var tile_roof = new UI.Text( "" );

Sidebar.ViewMode = function ( editor ) {


    var buttons = new UI.Panel();

    buttons.add(new UI.Row().add( ui_coords ));
    buttons.add(new UI.Row().add( ui_local_coords ));
    buttons.add(new UI.Row().add(sectorName  ));
    buttons.add(new UI.Row().add(tileIdx ));
    buttons.add(new UI.Row().add( tile_elevation));
    buttons.add(new UI.Row().add(tile_overlay ));
    buttons.add(new UI.Row().add(tile_texture ));
    buttons.add(new UI.Row().add(tile_vertical));
    buttons.add(new UI.Row().add( tile_horizontal ));
    buttons.add(new UI.Row().add( tile_diagonal ));
    buttons.add(new UI.Row().add( tile_roof));


  /*  var objectTab = new UI.Text( 'OBJECT' ).onClick( onClick );
    var geometryTab = new UI.Text( 'GEOMETRY' ).onClick( onClick );
    var materialTab = new UI.Text( 'MATERIAL' ).onClick( onClick );

    var tabs = new UI.Div();
    tabs.setId( 'tabs' );
    tabs.add( objectTab, geometryTab, materialTab );
    container.add( tabs );

    function onClick( event ) {
        select( event.target.textContent );
    }

    //

    var object = new UI.Span().add(
        new Sidebar.Object( editor )
    );
    container.add( object );

    var geometry = new UI.Span().add(
        new Sidebar.Geometry( editor )
    );
    container.add( geometry );

    var material = new UI.Span().add(
        new Sidebar.Material( editor )
    );
    container.add( material );

    //

    function select( section ) {

        objectTab.setClass( '' );
        geometryTab.setClass( '' );
        materialTab.setClass( '' );

        object.setDisplay( 'none' );
        geometry.setDisplay( 'none' );
        material.setDisplay( 'none' );

        switch ( section ) {
            case 'OBJECT':
                objectTab.setClass( 'selected' );
                object.setDisplay( '' );
                break;
            case 'GEOMETRY':
                geometryTab.setClass( 'selected' );
                geometry.setDisplay( '' );
                break;
            case 'MATERIAL':
                materialTab.setClass( 'selected' );
                material.setDisplay( '' );
                break;
        }

    }

    select( 'OBJECT' );
    */

    return buttons;

};