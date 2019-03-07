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
//  CLASS GraphicSkill
//
// -------------------------------------------------------

/** @class
*   The graphic displaying the player skills informations in skill menu.
*   @property {GraphicText} graphicName The skill name graphic.
*   @param {GameSkill} gameSkill The current selected skill.
*/
function GraphicSkill(gameSkill){
    this.skill = $datasGame.skills.list[gameSkill.id];

    // All the graphics
    this.graphicName = new GraphicTextIcon(this.skill.name, this.skill.pictureID);
    this.graphicCost = new GraphicText(this.skill.getCostString(), Align.Right);
    this.graphicInformations = new GraphicSkillItem(this.skill);
}

GraphicSkill.prototype = {

    /** Drawing the skill in choice box.
    *   @param {Canvas.Context} context The canvas context.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    draw: function(x, y, w, h) {
        this.graphicName.draw(x, y, w, h);
        this.graphicCost.draw(x, y, w, h);
    },

    /** Drawing the skill description.
    *   @param {Canvas.Context} context The canvas context.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    drawInformations: function(x, y, w, h) {
        this.graphicInformations.drawInformations(x, y, w, h);
        this.graphicCost.draw(x, y, w, 0);
    }
}
