/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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
//  CLASS SceneMenuEquip : SceneGame
//
// -------------------------------------------------------

/** @class
*   A scene in the menu for describing players equipments.
*   @extends SceneGame
*   @property {WindowBox} windowTop Window on top with "Equip" text.
*   @property {WindowTabs} windowChoicesTabs Window for each tabs.
*   @property {WindowBox} windowInformations Window for equip stats
*   informations.
*   @property {WindowChoices} windowChoicesEquipment Window for each equipment
*   slot.
*   @property {WindowChoices} windowChoicesList Window for each weapon/armor.
*   @property {number} selectedEquipment Index of selected equipment.
*/
function SceneMenuEquip() {
    SceneGame.call(this);

    var nbHeroes, nbEquipments, nbEquipChoice, i;
    var listHeroes;

    // Tab heroes
    nbHeroes = $game.teamHeroes.length;
    listHeroes = new Array(nbHeroes);
    for (i = 0; i < nbHeroes; i++)
        listHeroes[i] = new GraphicPlayerDescription($game.teamHeroes[i]);

    // Equipment
    nbEquipments = $datasGame.battleSystem.equipments.length - 1;
    nbEquipChoice = SceneMenu.nbItemsToDisplay - nbEquipments - 1;

    // All the windows
    this.windowTop = new WindowBox(20, 20, 200, 30, new GraphicText("Equip"));
    this.windowChoicesTabs = new WindowTabs(OrientationWindow.Horizontal, 50,
        60, 110, RPM.SMALL_SLOT_HEIGHT, 4, listHeroes, null);
    this.windowChoicesEquipment = new WindowChoices(OrientationWindow.Vertical,
        20, 100, 290, RPM.SMALL_SLOT_HEIGHT, nbEquipments, new Array(
        nbEquipments), null, RPM.SMALL_SLOT_PADDING);
    this.windowChoicesList = new WindowChoices(OrientationWindow.Vertical, 20,
        100 + (nbEquipments + 1) * RPM.SMALL_SLOT_HEIGHT, 290, RPM
        .SMALL_SLOT_HEIGHT, nbEquipChoice, [], null, RPM.SMALL_SLOT_PADDING, 0,
        -1);
    this.windowInformations = new WindowBox(330, 100, 285, 350, null, RPM
        .HUGE_PADDING_BOX);

    // Updates
    this.updateForTab();
    this.updateEquipmentList();
    this.updateInformations();
}

SceneMenuEquip.prototype = {

    /** Update tab.
    */
    updateForTab: function(){
        var equipLength, i, l;
        var list;

        // update equipment
        equipLength = GamePlayer.getEquipmentLength();
        l = $datasGame.battleSystem.equipmentsOrder.length;
        list = new Array(l);
        for (i = 0; i < l; i++){
            list[i] =
                    new GraphicEquip(
                        $game.teamHeroes
                        [this.windowChoicesTabs.currentSelectedIndex],
                        $datasGame.battleSystem.equipmentsOrder[i],
                        equipLength);
        }
        this.windowChoicesEquipment.setContents(list);
        this.selectedEquipment = -1;
        this.windowChoicesList.unselect();
        this.updateEquipmentList();
        this.updateInformations();
    },

    // -------------------------------------------------------

    /** Update the equipment list.
    */
    updateEquipmentList: function(){
        var idEquipment, nb, i, l, c, ll, k, lll, nbItem;
        var list, type, systemItem, item, character;

        idEquipment = $datasGame.battleSystem.equipmentsOrder
                [this.windowChoicesEquipment.currentSelectedIndex];
        nb = this.windowChoicesList.listWindows.length;
        list = [new GraphicText("[Remove]", Align.Left)];
        for (i = 0, l = $game.items.length; i < l; i++){
            item = $game.items[i];
            if (item.k !== ItemKind.Item) {
                systemItem = item.getItemInformations();
                type = systemItem.getType();
                if (type.equipments[idEquipment]) {

                    // Correct the number according to equiped items
                    nbItem = item.nb;
                    ll = $game.teamHeroes.length;
                    for (c = 0; c < ll; c++){
                        character = $game.teamHeroes[c];
                        lll = character.equip.length;
                        for (k = 0; k < lll; k++) {
                            if (item === character.equip[k]) nbItem--;
                        }
                    }

                    if (nbItem > 0){
                        list.push(new GraphicItem(item, nbItem));
                    }
                }
            }
        }

        // Set contents
        this.windowChoicesList.setContentsCallbacks(list, null, -1);
    },

    // -------------------------------------------------------

    /** Update the informations to display for equipment stats.
    */
    updateInformations: function(){
        var statistics, statistic, caracteristics, caracteristic, result,
            gamePlayer, statisticsProgression, statisticProgression, base,
            equipIndex, item, idEquipment, previewPlayer;
        var i, j, k, l, ll;

        gamePlayer = $game.teamHeroes[this.windowChoicesTabs
            .currentSelectedIndex];
        if (this.selectedEquipment === -1)
            this.list = [];
        else{
            item = this.windowChoicesList.getCurrentContent();

            if (item === null) {
                this.list = [];
            } else {
                gamePlayer.getEquipmentStatsAndBonus(item.item, $datasGame
                    .battleSystem.equipmentsOrder[this.windowChoicesEquipment
                    .currentSelectedIndex]);


                equipIndex = this.windowChoicesEquipment.currentSelectedIndex;
                statistics = $datasGame.battleSystem.statistics;
                this.list = new Array(l);
                this.bonus = new Array(l);
                for (i = 1, l = statistics.length; i < l; i++) {
                    this.list[i] = null;
                    this.bonus[i] = null;
                }
                for (k = 1, ll = gamePlayer.equip.length; k < ll; k++) {
                    idEquipment = $datasGame.battleSystem.equipmentsOrder
                            [this.windowChoicesEquipment.currentSelectedIndex];
                    if (k === idEquipment) {
                        if (!item.item) {
                            continue;
                        }
                        caracteristics = item.item.caracteristics;
                    } else {
                        if (gamePlayer.equip[k] === null) {
                            continue;
                        }
                        caracteristics = gamePlayer.equip[k]
                            .getItemInformations().caracteristics;
                    }
                    if (caracteristics) {
                        for (i = 1, l = caracteristics.length; i < l; i++) {
                            caracteristic = caracteristics[i];
                            result = caracteristic.getNewStatValue(gamePlayer);
                            if (result !== null) {
                                if (this.list[result[0]] === null) {
                                    statistic = statistics[result[0]];
                                    base = gamePlayer[statistic
                                        .getAbbreviationNext()] - gamePlayer[
                                        statistic.getBonusAbbreviation()];
                                    this.list[result[0]] = caracteristic
                                        .operation ? 0 : base;
                                    this.bonus[result[0]] = caracteristic
                                        .operation ? -base : 0;
                                }
                                this.list[result[0]] += result[1];
                                this.bonus[result[0]] += result[1];
                            }
                        }
                    }
                }

                // Same values for not changed stats
                for (i = 1, l = statistics.length; i < l; i++) {
                    if (this.list[i] === null) {
                        this.list[i] = gamePlayer[statistics[i]
                            .getAbbreviationNext()];
                    }
                }

                // Update formulas statistics
                statisticsProgression = gamePlayer.character
                    .getStatisticsProgression();
                previewPlayer = GamePlayer.getTemporaryPlayer(this.list);
                for (i = 0, l = statisticsProgression.length; i < l; i++) {
                    for (j = 0; j < l; j++) {
                        statisticProgression = statisticsProgression[j];
                        this.list[statisticProgression.id] =
                            statisticProgression.getValueAtLevel(previewPlayer
                            .getCurrentLevel(), previewPlayer, gamePlayer
                            .character.getProperty("finalLevel")) + this.bonus[
                            statisticProgression.id];
                        previewPlayer.initStatValue(statistics[
                            statisticProgression.id], this.list[
                            statisticProgression.id])
                    }
                }
            }
        }

        this.windowInformations.content = new GraphicEquipStats(gamePlayer, this
            .list);
    },

    /** Remove the equipment of the character.
    */
    remove: function(){
        var character =
                $game.teamHeroes[this.windowChoicesTabs.currentSelectedIndex];
        var id = $datasGame.battleSystem.equipmentsOrder
                [this.windowChoicesEquipment.currentSelectedIndex];
        character.equip[id] = null;
        this.updateStats();
    },

    // -------------------------------------------------------

    /** Equip the selected equipment.
    */
    equip: function(){
        var index = this.windowChoicesTabs.currentSelectedIndex;
        var character = $game.teamHeroes[index];
        var item = this.windowChoicesList.getCurrentContent().gameItem;
        var id = $datasGame.battleSystem.equipmentsOrder
                [this.windowChoicesEquipment.currentSelectedIndex];
        character.equip[id] = item;
        this.updateStats();
    },

    // -------------------------------------------------------

    updateStats: function() {
        $game.teamHeroes[this.windowChoicesTabs.currentSelectedIndex]
            .updateEquipmentStats(this.list, this.bonus);
    },

    // -------------------------------------------------------

    update: function(){

    },

    // -------------------------------------------------------

    onKeyPressed: function(key){
        if (this.selectedEquipment === -1){
            if (DatasKeyBoard.isKeyEqual(key,
                                         $datasGame.keyBoard.menuControls
                                         .Cancel) ||
                DatasKeyBoard.isKeyEqual(key,
                                         $datasGame.keyBoard.MainMenu))
            {
                $gameStack.pop();
            }
            else if (DatasKeyBoard.isKeyEqual(key,
                                              $datasGame.keyBoard.menuControls
                                              .Action))
            {
                this.selectedEquipment =
                     this.windowChoicesEquipment.currentSelectedIndex;
                this.windowChoicesList.currentSelectedIndex = 0;
                this.updateInformations();
                this.windowChoicesList.selectCurrent();
            }
        }
        else{
            if (DatasKeyBoard.isKeyEqual(key,
                                         $datasGame.keyBoard.menuControls
                                         .Cancel) ||
                DatasKeyBoard.isKeyEqual(key,
                                         $datasGame.keyBoard.MainMenu))
            {
                this.selectedEquipment = -1;
                this.windowChoicesList.unselect();
                this.updateInformations();
            }
            else if (DatasKeyBoard.isKeyEqual(key,
                                              $datasGame.keyBoard.menuControls
                                              .Action))
            {
                if (this.windowChoicesList.getCurrentContent() !== null){
                    if (this.windowChoicesList.currentSelectedIndex === 0)
                        this.remove();
                    else
                        this.equip();
                    this.selectedEquipment = -1;
                    this.windowChoicesList.unselect();
                    this.updateForTab();
                }
            }
        }
    },

    // -------------------------------------------------------

    onKeyReleased: function(key){

    },

    // -------------------------------------------------------

    onKeyPressedRepeat: function(key){

    },

    // -------------------------------------------------------

    onKeyPressedAndRepeat: function(key){

        // Tab
        var indexTab = this.windowChoicesTabs.currentSelectedIndex;
        this.windowChoicesTabs.onKeyPressedAndRepeat(key);
        if (indexTab !== this.windowChoicesTabs.currentSelectedIndex)
            this.updateForTab();

        // Equipment
        if (this.selectedEquipment === -1){
            var indexEquipment =
                    this.windowChoicesEquipment.currentSelectedIndex;
            this.windowChoicesEquipment.onKeyPressedAndRepeat(key);
            if (indexEquipment !==
                    this.windowChoicesEquipment.currentSelectedIndex)
                this.updateEquipmentList();
        }
        else{
            var indexList = this.windowChoicesList.currentSelectedIndex;
            this.windowChoicesList.onKeyPressedAndRepeat(key);
            if (indexList !== this.windowChoicesList.currentSelectedIndex)
                this.updateInformations();
        }
    },

    // -------------------------------------------------------

    draw3D: function(canvas){
        $currentMap.draw3D(canvas);
    },

    // -------------------------------------------------------

    drawHUD: function(context){

        // Draw the local map behind
        $currentMap.drawHUD(context);

        // Draw the menu
        this.windowTop.draw(context);
        this.windowChoicesTabs.draw(context);
        this.windowChoicesEquipment.draw(context);
        this.windowChoicesList.draw(context);
        this.windowInformations.draw(context);
    }
}
