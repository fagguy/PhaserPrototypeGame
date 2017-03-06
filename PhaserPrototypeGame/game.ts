class SimpleGame extends Phaser.Game {
    // -------------------------------------------------------------------------
    constructor() {
        // init game
        super(640, 400, Phaser.AUTO, "content", State);
    }
}