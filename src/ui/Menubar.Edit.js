
Menubar.Edit = function ( editor ) {

    var container = new UI.Panel();
    container.setClass( 'menu' );

    var title = new UI.Panel();
    title.setClass( 'title' );
    title.setTextContent( 'Edit' );
    container.add( title );

    var options = new UI.Panel();
    options.setClass( 'options' );
    container.add( options );


    var open = new UI.Row();
    open.setClass( 'option' );
    open.setTextContent( 'Undo' );
    open.onClick( function () {

        var fileInput = document.createElement( 'input' );
        fileInput.type = 'file';
        fileInput.addEventListener( 'change', function ( event ) {



        } );
        fileInput.click();


    } );

    options.add(open);
    var open = new UI.Row();
    open.setClass( 'option' );
    open.setTextContent( 'Redo' );
    open.onClick( function () {

        var fileInput = document.createElement( 'input' );
        fileInput.type = 'file';
        fileInput.addEventListener( 'change', function ( event ) {



        } );
        fileInput.click();


    } );

    options.add(open);
    //

    options.add( new UI.HorizontalRule() );


    var open = new UI.Row();
    open.setClass( 'option' );
    open.setTextContent( 'Copy Tile' );
    open.onClick( function () {
        var fileInput = document.createElement( 'input' );
        fileInput.type = 'file';
        fileInput.addEventListener( 'change', function ( event ) {



        } );
        fileInput.click();
    } );
    options.add(open);

    var open = new UI.Row();
    open.setClass( 'option' );
    open.setTextContent( 'Paste Tile' );
    open.onClick( function () {
        var fileInput = document.createElement( 'input' );
        fileInput.type = 'file';
        fileInput.addEventListener( 'change', function ( event ) {



        } );
        fileInput.click();
    } );
    options.add(open);



    var link = document.createElement( 'a' );
    link.style.display = 'none';
    document.body.appendChild( link ); // Firefox workaround, see #6594

    function save( blob, filename ) {

        link.href = URL.createObjectURL( blob );
        link.download = filename || 'data.json';
        link.click();

        // URL.revokeObjectURL( url ); breaks Firefox...

    }

    function saveString( text, filename ) {

        save( new Blob( [ text ], { type: 'text/plain' } ), filename );

    }

    return container;

};