/**
 * @author mrdoob / http://mrdoob.com/
 */

var Sidebar = function ( editor ) {

	var container = new UI.Panel();
	container.setId( 'sidebar' );

	//

	var viewTab = new UI.Text( 'VIEW MODE' ).onClick( onClick );
	var editTab = new UI.Text( 'EDIT MODE' ).onClick( onClick );
	var settingsTab = new UI.Text( 'SETTINGS' ).onClick( onClick );

	var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	tabs.add( viewTab, editTab, settingsTab );
	container.add( tabs );

	function onClick( event ) {

		select( event.target.textContent );

	}

	//

	var view = new UI.Span().add(
		new Sidebar.ViewMode(null)
	);
    var edit = new UI.Span().add(
        new Sidebar.EditMode(null)
    );
    var settings = new UI.Span().add(
        new Sidebar.Settings(null)
    );
	container.add( view );
    container.add( edit );
    container.add( settings );
/*
	var project = new UI.Span().add(
		new Sidebar.Project( editor )
	);
	container.add( project );

	var settings = new UI.Span().add(
		new Sidebar.Settings( editor ),
		new Sidebar.History( editor )
	);
	container.add( settings );
*/
	//

	function select( section ) {

		viewTab.setClass( '' );
		editTab.setClass( '' );
		settingsTab.setClass( '' );

		view.setDisplay( 'none' );
		edit.setDisplay( 'none' );
		settings.setDisplay( 'none' );

		switch ( section ) {
			case 'VIEW MODE':
				viewTab.setClass( 'selected' );
				view.setDisplay( '' );
				break;
			case 'EDIT MODE':
				editTab.setClass( 'selected' );
				edit.setDisplay( '' );
				break;
			case 'SETTINGS':
				settingsTab.setClass( 'selected' );
				settings.setDisplay( '' );
				break;
		}


	}

	select( 'VIEW MODE' );

	return container;

};