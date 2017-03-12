class State extends Phaser.State {

    private static CANNON_SPEED = 2;
    private static MISSILE_SPEED = 6;

    private _cannon: Phaser.Sprite;
    private _cannonTip: Phaser.Point = new Phaser.Point();

    private _space: Phaser.Key;

    private _drones: Phaser.Group;
    private _dronesCollisionGroup: Phaser.Physics.P2.CollisionGroup;
    private _missiles: Phaser.Group;
    private _missilesCollisionGroup: Phaser.Physics.P2.CollisionGroup;

    // -------------------------------------------------------------------------
    preload() {
        // background image
        this.game.load.image("BG", "Graphics/bg.jpg");
        // load sprite images in atlas
        this.game.load.atlas("Atlas", "Graphics/atlas.png", "Graphics/atlas.json");
    }

    // -------------------------------------------------------------------------
    create() {
        // background
        this.add.image(0, 0, "BG");

        // set physiscs to P2 physics engin
        this.game.physics.startSystem(Phaser.Physics.P2JS);

        // cannon - place it in the bottom center
        this._cannon = this.game.add.sprite(this.world.centerX, this.world.height, "Atlas", "cannon");
        // offset it from position
        this._cannon.anchor.setTo(-0.75, 0.5);
        // make it point straight up
        this._cannon.rotation = -Math.PI / 2;

        // cannon base - place over cannon, so it overlaps it
        var base = this.game.add.sprite(this.world.centerX, this.world.height, "Atlas", "base");
        base.anchor.setTo(0.5, 1);


        //  Game input
        this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this._space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // following keys will not be propagated to browser
        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR]);


        // allow inpact events
        this.game.physics.p2.setImpactEvents(true);

        //  collision groups for drones
        this._dronesCollisionGroup = this.game.physics.p2.createCollisionGroup();
        //  collision groups for missiles
        this._missilesCollisionGroup = this.physics.p2.createCollisionGroup();


        // drones group
        this._drones = this.add.group();
        this._drones.physicsBodyType = Phaser.Physics.P2JS;
        this._drones.enableBody = true;

        // create 8 drones
        this._drones.classType = Dron;
        this._drones.createMultiple(8, "Atlas", "dron1");
        this._drones.forEach(function (aDron: Dron) {
            // setup movements and animations
            aDron.setUp();
            // setup physics
            var body: Phaser.Physics.P2.Body = aDron.body;
            body.setCircle(aDron.width / 2);
            body.kinematic = true; // does not respond to forces
            body.setCollisionGroup(this._dronesCollisionGroup);
            // adds group drones will collide with and callback
            body.collides(this._missilesCollisionGroup, this.hitDron, this);
            //body.debug = true;
        }, this);

        // missiles group
        this._missiles = this.add.group();
        this._missiles.physicsBodyType = Phaser.Physics.P2JS;
        this._missiles.enableBody = true;

        // create 10 missiles
        this._missiles.createMultiple(10, "Atlas", "missile");
        this._missiles.forEach(function (aMissile: Phaser.Sprite) {
            aMissile.anchor.setTo(0.5, 0.5);
            // physics
            var body: Phaser.Physics.P2.Body = aMissile.body;
            body.setRectangle(aMissile.width, aMissile.height);
            body.setCollisionGroup(this._missilesCollisionGroup);
            body.collides(this._dronesCollisionGroup);
            // body.debug = true;
        }, this);
    }

    // -------------------------------------------------------------------------
    update() {
        // shortcut
        var keyboard: Phaser.Keyboard = this.game.input.keyboard;

        // left and right key
        if (keyboard.isDown(Phaser.Keyboard.LEFT)) {
            // calculate frame independent speed - 45 degrees (PI/4) in 1 second adjusted with cannon speed
            this._cannon.rotation -= this.time.elapsedMS * State.CANNON_SPEED / 1000 * (Math.PI / 4);
        } else if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this._cannon.rotation += this.time.elapsedMS * State.CANNON_SPEED / 1000 * (Math.PI / 4);
        }

        // spacebar
        if (this._space.justDown) {  // fire missile
            // get firtst missile from pool
            var missile: Phaser.Sprite = this._missiles.getFirstExists(false);

            if (missile) {
                // calculate position of cannon tip. Put distance from cannon base along x axis and rotate it to cannon angle
                this._cannonTip.setTo(this._cannon.width * 2, 0);
                this._cannonTip.rotate(0, 0, this._cannon.rotation);

                missile.reset(this._cannon.x + this._cannonTip.x, this._cannon.y + this._cannonTip.y);
                (<Phaser.Physics.P2.Body>missile.body).rotation = this._cannon.rotation;
                // life of missile in millis
                missile.lifespan = 1500;
                // set velocity of missile in direction of cannon barrel
                (<Phaser.Physics.P2.Body>missile.body).velocity.x = this._cannonTip.x * State.MISSILE_SPEED;
                (<Phaser.Physics.P2.Body>missile.body).velocity.y = this._cannonTip.y * State.MISSILE_SPEED;
            }
        }

        // limit cannon rotation to left and right to +/- 45 degrees ... -135 to -45 degrees here
        this._cannon.rotation = Phaser.Math.clamp(this._cannon.rotation, -1.5 * Math.PI / 2, -0.5 * Math.PI / 2);
    }

    // -------------------------------------------------------------------------
    render() {
        /*
        // uncomment to visual debug, also uncommnet "body.debug = true;" when creating missiles and drones
        this._drones.forEach(function (aDron: Dron) {
            this.game.debug.body(aDron);
        }, this);

        this._missiles.forEach(function (aMissile: Phaser.Sprite) {
            this.game.debug.body(aMissile);
        }, this);
        */
    }

    // -------------------------------------------------------------------------
    private hitDron(aObject1: any, aObject2: any) {
        // explode dron and remove missile - kill it, not destroy
        (<Dron>aObject1.sprite).explode();
        (<Phaser.Sprite>aObject2.sprite).kill();
    }
}