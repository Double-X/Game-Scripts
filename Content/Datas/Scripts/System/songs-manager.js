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
//  CLASS SongsManager
//
// -------------------------------------------------------

/** @class
*   The manager for songs.
*/
function SongsManager(musicPlayer, backgroundPlayer, soundsPlayers) {
    this.musics = musicPlayer;
    this.backgroundSounds = backgroundPlayer;
    this.sounds = soundsPlayers;
    this.soundIndex = 0;
}

SongsManager.prototype = {

    /** Get the player according to the song kind.
    *   @param {SongKind} kind The kind of song.
    *   @returns {Audio}
    */
    getPlayer: function(kind) {
        switch (kind) {
        case SongKind.Music:
            return this.musics;
        case SongKind.BackgroundSound:
            return this.backgroundSounds;
        default:
            return null;
        }
    },

    // -------------------------------------------------------

    /** Add songs on the playlist
    *   @param {SongKind} kind The kind of song to add.
    *   @param {SystemSong[]} songs The list of songs to add.
    */
    addSongs: function(kind, songs) {
        var player = this.getPlayer(kind);
        if (!player)
            return;

        var song, i, l = songs.length;
        var paths = new Array(l + 1);
        for (i = 0; i < l; i++) {
            song = songs[i];
            paths[song.id === -1 ? 0 : song.id] = song.getPath(kind);
        }
        player.playlist.addItems(paths);
    },

    // -------------------------------------------------------

    /** Play a sound.
    *   @param {number} id The id of the song.
    */
    playSound: function(id) {
        var player = this.sounds[this.soundIndex++];
        player.source = $datasGame.songs.list[SongKind.Sound][id]
            .getPath(SongKind.Sound);
        player.play();
        if (this.soundIndex === 5)
            this.soundIndex = 0;
    }
}