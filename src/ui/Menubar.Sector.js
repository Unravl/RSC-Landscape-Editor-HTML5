
Menubar.Sector = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Sector' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// New
    var open = new UI.Row();
    open.setClass( 'option' );
    open.setTextContent( 'Sector ->' );
    open.onClick( function () {

        var fileInput = document.createElement( 'input' );
        fileInput.type = 'file';
        fileInput.addEventListener( 'change', function ( event ) {



        } );
        fileInput.click();
    } );

    options.add(open);

	options.add( new UI.HorizontalRule() );

    var open = new UI.Row();
    open.setClass( 'option' );
    open.setTextContent( 'Varrock' );
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
    open.setTextContent( 'Falador' );
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
    open.setTextContent( 'Lumbridge' );
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
    open.setTextContent( 'Edgeville' );
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
    open.setTextContent( 'Draynor' );
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
    open.setTextContent( 'Karamja' );
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
    open.setTextContent( 'Al Kharid' );
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
    open.setTextContent( 'Ardougne' );
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
    open.setTextContent( 'Catherby' );
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