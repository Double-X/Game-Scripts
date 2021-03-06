/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
 *   A land in the map
 *   @property {boolean} up Indicate if the layer is up or down
 *   @property {number[]} texture Texture rect of the land
 */
import {MapElement} from ".";
import * as THREE from "../Vendor/three.js";

export class Land extends MapElement {
    up: boolean;
    texture: number[];

    constructor() {
        super();
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the land
     *   @param {Object} json Json object describing the land
     */
    read(json) {
        super.read(json);

        this.up = RPM.defaultValue(json.up, true);
        this.texture = json.t;
        if (this.texture.length === 2) {
            this.texture.push(1);
            this.texture.push(1);
        }
    }

    // -------------------------------------------------------
    /** Return the rect index
     *   @returns {number}
     */
    getIndex(width) {
        return this.texture[0] + (this.texture[1] * width);
    }

    // -------------------------------------------------------
    /** Update the geometry associated to this land and return the collision
     *   result
     *   @param {THREE.Geometry} geometry The geometry asoociated to the
     *   autotiles
     *   @param {CollisionSquare} collision The collision square
     *   @param {number[]} position The json position
     *   @param {number} width The texture total width
     *   @param {number} height The texture total height
     *   @param {number} x The x texture position
     *   @param {number} y The y texture position
     *   @param {number} w The w texture size
     *   @param {number} h The h texture size
     *   @param {number} count The faces count
     *   @returns {Object}
     */
    updateGeometry(geometry, collision, position, width, height, x, y, w, h,
                   count) {
        let localPosition = RPM.positionToBorderVector3(position);
        let a = localPosition.x;
        let yLayerOffset = RPM.positionLayer(position) * 0.05;
        if (!this.up) {
            yLayerOffset *= -1;
        }
        let b = localPosition.y + yLayerOffset;
        let c = localPosition.z;
        let objCollision = null;

        // Vertices
        geometry.vertices.push(new THREE.Vector3(a, b, c));
        geometry.vertices.push(new THREE.Vector3(a + RPM.SQUARE_SIZE, b, c));
        geometry.vertices.push(new THREE.Vector3(a + RPM.SQUARE_SIZE, b, c + RPM
            .SQUARE_SIZE));
        geometry.vertices.push(new THREE.Vector3(a, b, c + RPM.SQUARE_SIZE));
        let j = count * 4;
        geometry.faces.push(new THREE.Face3(j, j + 1, j + 2));
        geometry.faces.push(new THREE.Face3(j, j + 2, j + 3));

        // Texture
        let coefX = RPM.COEF_TEX / width;
        let coefY = RPM.COEF_TEX / height;
        x += coefX;
        y += coefY;
        w -= (coefX * 2);
        h -= (coefY * 2);
        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(x, y),
            new THREE.Vector2(x + w, y),
            new THREE.Vector2(x + w, y + h)
        ]);
        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(x, y),
            new THREE.Vector2(x + w, y + h),
            new THREE.Vector2(x, y + h)
        ]);

        // Collision
        if (collision !== null) {
            let rect = collision.rect;
            if (!collision.hasAllDirections()) {
                if (rect === null) {
                    rect = [
                        a + RPM.SQUARE_SIZE / 2,
                        b + 0.5,
                        c + RPM.SQUARE_SIZE / 2,
                        RPM.SQUARE_SIZE,
                        RPM.SQUARE_SIZE,
                        1,
                        0
                    ]
                }
                objCollision = {
                    p: position,
                    l: localPosition,
                    b: rect,
                    c: collision
                }
            } else if (rect !== null) {
                objCollision = {
                    p: position,
                    l: localPosition,
                    b: [
                        a + rect[0] + RPM.SQUARE_SIZE / 2,
                        b + 0.5,
                        c + rect[1] + RPM.SQUARE_SIZE / 2,
                        rect[2],
                        rect[3],
                        1,
                        0
                    ],
                    c: null
                }
            }
        }
        return objCollision;
    }
}
