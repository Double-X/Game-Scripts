/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
/**
 * The superclass that define all the System classes structure
 * @abstract
 * @param {Record<string, any>} [json=undefined]
 * @param {any} args
 */
class Base {
    constructor(json = undefined, ...args) {
        this.setup(args);
        if (json) {
            this.read(json);
        }
    }
}
export { Base };
