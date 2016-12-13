

var Menubar = function ( editor ) {

	var container = new UI.Panel();
	container.setId( 'menubar' );

	container.add( new Menubar.File( null ) );
    container.add( new Menubar.Edit(null ) );
    container.add( new Menubar.Sector( null ) );
	
	//var wireframe = new UI.THREE.Boolean( false, 'Edit Mode' ).setWidth(100);
	//container.add( wireframe );
	//container.add( new Menubar.Edit( editor ) );
	//container.add( new Menubar.Add( editor ) );
	//container.add( new Menubar.Play( editor ) );
	//container.add( new Menubar.View( editor ) );
	// container.add( new Menubar.Examples( editor ) );
	//container.add( new Menubar.Help( editor ) );

	//container.add( new Menubar.Status( editor ) );

	return container;

};