ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	
	'game.entities.player',
	'game.entities.spike',
	'game.levels.test',
    'game.TileShader',
    'game.camera',
    'impact.debug.debug'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	gravity: 300, // All entities are affected by this
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
    tileShader:null,
    player:null,
    forceDraw:false,
    camera:null,
    ambient:10,
    kpTimer:null,
    currenTileSet:1,
    tileSet1:null,
    tileSet2:null,
    instructions:true,
	
	
	init: function() {
		// Bind keys
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.X, 'jump' );
		ig.input.bind( ig.KEY.C, 'shoot' );
        ig.input.bind( ig.KEY.L, 'los' );
        ig.input.bind( ig.KEY.A, 'ambient' );
        ig.input.bind( ig.KEY.I, 'inner' );
        ig.input.bind( ig.KEY.O, 'outer' );
        ig.input.bind( ig.KEY.T, 'tileset' );
        ig.input.bind( ig.KEY.F, 'fill' );
        ig.input.bind( ig.KEY.S, 'shade' );
        ig.input.bind( ig.KEY.N, 'ishade' );
        ig.input.bind( ig.KEY.H, 'instructions' );

        this.camera = new Camera(ig.system.width / 4, ig.system.height / 3, 5);
        this.camera.trap.size.x = 100;
        this.camera.trap.size.y = 60;
        this.camera.lookAhead.x = ig.ua.mobile ? ig.system.width / 6 : 0;

        this.tileSet1 = new ig.Image('media/lighttiles1.png');
        this.tileSet2 = new ig.Image('media/lighttiles2.png');

		this.loadLevel( LevelTest );
        this.tileShader = new TileShader('main',this.tileSet1);
        this.ambient= 10;
        this.tileShader.ambientLight=this.ambient;
        this.tileShader.losShade=true;
        this.player= this.getEntitiesByType( EntityPlayer )[0];

        this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
        this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;
        this.camera.set(this.player, this.getEntitiesByType(EntityBottomLeftLimit)[0], this.getEntitiesByType(EntityTopRightLimit)[0]);

        this.kpTimer = new ig.Timer(.25);

    },
	
	update: function() {

        if (this.kpTimer.delta() > 0)
        {
        if( ig.input.state('los') ) {

            this.tileShader.losShade = !this.tileShader.losShade;
            this.forceDraw=true;
            this.kpTimer.reset();
        }

            if( ig.input.state('fill') ) {

                this.tileShader.fillCircle = !this.tileShader.fillCircle;
                this.forceDraw=true;
                this.kpTimer.reset();
            }

            if( ig.input.state('instructions') ) {

                this.instructions = !this.instructions;
                this.kpTimer.reset();
            }

            if( ig.input.state('inner') ) {

                this.tileShader.innerRadius++;
                if (this.tileShader.innerRadius > 10) this.tileShader.innerRadius = 0;
                this.forceDraw=true;
                this.kpTimer.reset();
            }

            if( ig.input.state('shade') ) {

                this.tileShader.shadeCircle = !this.tileShader.shadeCircle;
                this.forceDraw=true;
                this.kpTimer.reset();
            }

            if( ig.input.state('outer') ) {

                this.tileShader.outerRadius++;
                if (this.tileShader.outerRadius > 10) this.tileShader.outerRadius = 0;
                this.forceDraw=true;
                this.kpTimer.reset();
            }

            if( ig.input.state('ishade') ) {

                this.tileShader.innerShade++;
                if (this.tileShader.innerShade > 10) this.tileShader.innerShade = 0;
                this.forceDraw=true;
                this.kpTimer.reset();
            }

            if( ig.input.state('tileset') ) {

                this.currenTileSet++;
                if (this.currenTileSet > 2) this.currenTileSet=1;
              if (this.currenTileSet == 1) this.tileShader.lightMap.setTileset(this.tileSet1);
                if (this.currenTileSet == 2) this.tileShader.lightMap.setTileset(this.tileSet2);
                this.forceDraw=true;
                this.kpTimer.reset();
            }

        if( ig.input.state('ambient') ) {

            this.ambient++;
            if (this.ambient > 10) this.ambient=0;

            this.tileShader.ambientLight=this.ambient;
            this.forceDraw=true;
            this.kpTimer.reset();
        }


        }


        this.parent();
        this.camera.follow(this.player);

	},
	
	draw: function() {
		// Draw all entities and BackgroundMaps
		this.parent();

        this.tileShader.draw(this.player.pos.x+8,this.player.pos.y+4,this.forceDraw);

        if (this.instructions)
        {
            this.font.draw( 'Arrow Keys, X, C, L:Los('+ this.tileShader.losShade.toString()+ '), A: Ambient('+ this.ambient.toString()+')', 2, 2 );
            this.font.draw( 'O:Outer Radius('+ this.tileShader.outerRadius.toString()+ '), I: Inner Radius('+ this.tileShader.innerRadius.toString()+')', 2, 12 );
            this.font.draw( 'T:Tile Set, S:Shade('+ this.tileShader.shadeCircle.toString()+'),F:Fill('+ this.tileShader.fillCircle.toString()+'), N:Inner Shade('+ this.tileShader.innerShade.toString()+')', 2, 24 );
            this.font.draw( 'H:Toggle Help', 2, 36 );
        }
        this.forceDraw=false;
	}
});


// Start the Game with 60fps, a resolution of 240x160, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 240, 160,2);

});
