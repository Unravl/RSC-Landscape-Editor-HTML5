
var Toolbar = function ( editor ) {

	

	var container = new UI.Panel();
	container.setId( 'toolbar' );

	var buttons = new UI.Panel();
	container.add( buttons );

	//buttons.add( new UI.Text( 'FPS: 60 ' ).setWidth('80px') );
	

	//buttons.add( grid );
	var wireframe = new UI.THREE.Boolean( false, 'Wireframe' ).onChange( update );
	buttons.add( wireframe );
    var axis = new UI.THREE.Boolean( false, 'Axis' ).onChange( update );
    buttons.add( axis );
    var sects = new UI.THREE.Boolean( false, 'Surrounding Sectors' ).onChange( update );
    buttons.add( sects );
    sects.setValue(true);

	var roofs = new UI.THREE.Boolean( false, 'Roofs' ).onChange( update );
	buttons.add( roofs );

	
	/*

	var local = new UI.THREE.Boolean( false, 'local' ).onChange( update );
	buttons.add( local );

	var showGrid = new UI.THREE.Boolean( true, 'show' ).onChange( update );
	buttons.add( showGrid );*/

	function update() {

		//signals.snapChanged.dispatch( snap.getValue() === true ? grid.getValue() : null );
		//signals.spaceChanged.dispatch( local.getValue() === true ? "local" : "world" );
		//signals.showGridChanged.dispatch( showGrid.getValue() );

	}

	return container;

};