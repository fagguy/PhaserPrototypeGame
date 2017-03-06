class State extends Phaser.State {

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
        // dron sprite
        var dron: Dron = new Dron(this.game, 320, 100, "Atlas", "dron1");
        // physics
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.enable(dron);
        dron.body.kinematic = true;
        // setup dron
        dron.setUp();
        // add dron to world group
        this.world.add(dron);
    }
}