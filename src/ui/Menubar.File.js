/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.File = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'File' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// New

	var open = new UI.Row();
	open.setClass( 'open' );
	open.setTextContent( 'Load .rscd' );
	open.onClick( function () {

	var fileInput = document.createElement( 'input' );
	fileInput.type = 'file';
	fileInput.addEventListener( 'change', function ( event ) {

		openFile( event );
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

	} );
	fileInput.click();
	

	} );
	
	options.add(open);
	
		var open = new UI.Row();
	open.setClass( 'open' );
	open.setTextContent( 'Load .jag' );
	open.onClick( function () {

	var fileInput = document.createElement( 'input' );
	fileInput.type = 'file';
	fileInput.addEventListener( 'change', function ( event ) {

		

	} );
	fileInput.click();
	

	} );
	options.add( new UI.HorizontalRule() );
	options.add(open);

	//

	//options.add( new UI.HorizontalRule() );



	

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