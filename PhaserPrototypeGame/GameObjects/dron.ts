﻿class Dron extends Phaser.Sprite {

    // -------------------------------------------------------------------------
    public setUp() {
        this.anchor.setTo(0.5, 0.5);

        // random position
        this.reset(this.game.rnd.between(40, 600), this.game.rnd.between(60, 150));

        // random movement range
        var range: number = this.game.rnd.between(60, 120);
        // random duration of complete move
        var duration: number = this.game.rnd.between(30000, 50000);
        // random parameters for wiggle easing function
        var xPeriod1: number = this.game.rnd.between(2, 13);
        var xPeriod2: number = this.game.rnd.between(2, 13);
        var yPeriod1: number = this.game.rnd.between(2, 13);
        var yPeriod2: number = this.game.rnd.between(2, 13);

        // set tweens for horizontal and vertical movement
        var xTween = this.game.add.tween(this.body)
        xTween.to({ x: this.position.x + range }, duration, function (aProgress: number) {
            return wiggle(aProgress, xPeriod1, xPeriod2);
        }, true, 0, -1);

        var yTween = this.game.add.tween(this.body)
        yTween.to({ y: this.position.y + range }, duration, function (aProgress: number) {
            return wiggle(aProgress, yPeriod1, yPeriod2);
        }, true, 0, -1);

        // define animations
        this.animations.add("anim", ["dron1", "dron2"], this.game.rnd.between(2, 5), true);
        this.animations.add("explosion", Phaser.Animation.generateFrameNames("Explosion", 1, 6, "", 3));

        // play first animation as default
        this.play("anim");
    }

    // -------------------------------------------------------------------------
    public explode() {
        // remove movement tweens
        this.game.tweens.removeFrom(this.body);
        // disable collisions
        this.body.destroy();
        // explode dron and kill it on complete
        this.play("explosion", 8, false, false);
        // destroy the dron object instance
        this.animations.currentAnim.onComplete.add(function () {
            this.destroy();
        }, this);
    }
}

// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
function wiggle(aProgress: number, aPeriod1: number, aPeriod2: number): number {
    var current1: number = aProgress * Math.PI * 2 * aPeriod1;
    var current2: number = aProgress * Math.PI * 2 * aPeriod2;

    return Math.sin(current1) * Math.cos(current2);
}
