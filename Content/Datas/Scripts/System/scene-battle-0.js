/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

// -------------------------------------------------------
//
//  CLASS SceneBattle
//
//  Step 0 : Initialization of the battle, camera movment (transition),
//  allies/ennemies comming.
//
// -------------------------------------------------------

SceneBattle.prototype.initializeStep0 = function(){
    var i, l, battler, position;
    this.winning = false;
    this.distanceCenterAlly = 75;
    this.kindSelection = CharacterKind.Hero;
    var centerX = $SCREEN_X / 2;
    var centerY = $SCREEN_Y / 2 - 125;
    this.selectedUserIndex = 0;
    this.selectedTargetIndex = 0;
    this.battlers = new Array(2);

    // Heroes
    l = $game.teamHeroes.length;
    this.battlers[CharacterKind.Hero] = new Array(l);
    for (i = 0; i < l; i++) {
        position = new THREE.Vector3($game.heroBattle.position.x + (2 *
            $SQUARE_SIZE) + (i * $SQUARE_SIZE / 2), $game.heroBattle.position.y,
            $game.heroBattle.position.z + (i * $SQUARE_SIZE));
        battler = new Battler($game.teamHeroes[i], position, centerX +
            this.distanceCenterAlly + (i*30), centerY + (i*50),32,32);
        battler.addToScene();
        this.battlers[CharacterKind.Hero][i] = battler;
    }

    // Ennemies
    var troop = $datasGame.troops.list[this.troopID];
    l = troop.list.length;
    this.battlers[CharacterKind.Monster] = new Array(l);
    for (i = 0; i < l; i++){
        var enemy = troop.list[i];
        position = new THREE.Vector3($game.heroBattle.position.x - (2 *
            $SQUARE_SIZE) + (i * $SQUARE_SIZE / 2), $game.heroBattle.position.y,
            $game.heroBattle.position.z + (i * $SQUARE_SIZE));
        var instancied = new GamePlayer(CharacterKind.Monster, enemy.id,
                                        $game.charactersInstances++, []);
        instancied.instanciate(enemy.level);
        battler = new Battler(instancied, position, centerX - this.distanceCenterAlly - 32,
                             centerY, 32, 32);
        battler.addToScene();
        this.battlers[CharacterKind.Monster][i] = battler;
    }

    this.windowTopInformations = new WindowBox(0,20,$SCREEN_X, 30);
    var w = 200, h = 100;
    this.windowCharacterInformations = new WindowBox($SCREEN_X - w,
                                                     $SCREEN_Y - h, w, h, null,
                                                     [10,10,10,10]);
    this.arrowSelection = new WindowBox(0,0,0,0);
    l = $datasGame.battleSystem.battleCommandsOrder.length;
    var list = new Array(l)
    for (i = 0; i < l; i++){
        var idSkill = $datasGame.battleSystem.battleCommandsOrder[i];
        list[i] = new GraphicText($datasGame.skills.list[idSkill].name);
    }
    this.windowChoicesBattleCommands =
         new WindowChoices(OrientationWindow.Vertical, 20,
                           $SCREEN_Y - 20 - (l*30),
                           150, 30, 4, list, null);
};

// -------------------------------------------------------

SceneBattle.prototype.updateStep0 = function() {

    // Transition fade
    if (this.transitionStart === 1) {
        if (this.transitionColor) {
            this.transitionColorAlpha += SceneBattle.TRANSITION_COLOR_VALUE;
            if (this.transitionColorAlpha >= 1) {
                this.transitionColorAlpha = 1;
                this.transitionColor = false;
                this.timeTransition = new Date().getTime();
            }
            return;
        }
        if (new Date().getTime() - this.timeTransition < SceneBattle
            .TRANSITION_COLOR_END_WAIT)
        {
            return;
        }
        if (this.transitionColorAlpha > 0) {
            this.transitionColorAlpha -= SceneBattle.TRANSITION_COLOR_VALUE;
            if (this.transitionColorAlpha <= 0) {
                this.transitionColorAlpha = 0;
            }
            return;
        }
    }

    // Transition zoom
    if (this.transitionStart === 2) {
        if (this.transitionZoom) {
            this.sceneMap.camera.distance -= 5;
            if (this.sceneMap.camera.distance <= 10) {
                this.sceneMap.camera.distance = 10;
                this.transitionZoom = false;
            }
            this.sceneMap.camera.update();
            return;
        }
        if (this.camera.distance < 180) {
            this.camera.distance += 5;
            if (this.camera.distance >= 180) {
                this.camera.distance = 180;
                this.cameraON = true;
            } else {
                return;
            }
        }
    }

    this.changeStep(1);
};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedStep0 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyReleasedStep0 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedRepeatStep0 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedAndRepeatStep0 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.drawHUDStep0 = function(context) {
    if (this.transitionStart === 1) {
        context.fillStyle = "rgba(" + this.transitionStartColor.red + "," +
            this.transitionStartColor.green + "," + this.transitionStartColor
            .blue + "," + this.transitionColorAlpha + ")";
        context.fillRect(0, 0, $canvasWidth, $canvasHeight);
    }
};
