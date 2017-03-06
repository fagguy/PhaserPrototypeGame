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
        var dron: Phaser.Sprite = this.add.sprite(320, 100, "Atlas", "dron1", this.world);
        dron.anchor.setTo(0.5, 0.5);
    }
}