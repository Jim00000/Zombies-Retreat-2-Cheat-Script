{
    /*
    Copyright (C) 2021-2022 Jim00000

    This file is part of Zombies-Retreat-2-Cheat-Script.

    Zombies-Retreat-2-Cheat-Script is free software: you can redistribute it
    and/or modify it under the terms of the GNU General Public License as
    published by the Free Software Foundation, either version 3 of the License,
    or (at your option) any later version.

    Zombies-Retreat-2-Cheat-Script is distributed in the hope that it will be
    useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General
    Public License for more details.

    You should have received a copy of the GNU General Public License along with
    Zombies-Retreat-2-Cheat-Script.  If not, see
    <https://www.gnu.org/licenses/>.
  */
}

// --------------------------------------------------------------------------------
// Jim00000's cheat script for Zombie's Retreat 2
// --------------------------------------------------------------------------------
// ▶ Author         : Jim00000
// ▶ Target process : Zombie's Retreat 2 - Beta 0.8.1
// ▶ Update         : 07.09.2022
// ▶ License        : GNU GENERAL PUBLIC LICENSE Version 3
// --------------------------------------------------------------------------------

(() => {
    let last_frame_count = 0;
    let speed_multiplier = 1.0;
    let fadeEffectHandlerId = -1;
    let is_zombie_freezed = false;
    let is_dark_scene_disabled = false;
    let original_color_tone = [];
    const supported_game_version = 'beta 0.8.1'
    const speed_multiplier_virtualkey = 117        // F6
    const freeze_zombie_movement_virtualkey = 118  // F7
    const remove_all_enemies_virtualkey = 119      // F8
    const toggle_dark_scene_virtualkey = 121       // F10
    const speed_multiplier_keyname = 'change_speed_multiplier';
    const freeze_zombie_movement_keyname = 'freeze_zomble_movement';
    const remove_all_enemies_keyname = 'remove_all_enemies';
    const toggle_dark_scene_keyname = 'toggle_dark_scene';

    // register F6 key to change speed multiplier
    Input.keyMapper[speed_multiplier_virtualkey] = speed_multiplier_keyname;
    // register F7 key to freeze zombie's movement
    Input.keyMapper[freeze_zombie_movement_virtualkey] =
        freeze_zombie_movement_keyname;
    Input.keyMapper[remove_all_enemies_virtualkey] = remove_all_enemies_keyname;
    // register F10 key to toggle dark scene
    Input.keyMapper[toggle_dark_scene_virtualkey] = toggle_dark_scene_keyname;

    function __onSpeedMultiplierChange__() {
        let final_speed_multiplier = speed_multiplier + 0.25;
        if (final_speed_multiplier > 3.5) {
            final_speed_multiplier = 1.0;
        }
        speed_multiplier = final_speed_multiplier;
        __updateSpeedChangeInfo__(speed_multiplier);
    };

    function __onZombieMovementFreezedTriggered__() {
        $gameMap.events().forEach(event => {
            if (event != null && event instanceof Game_Event &&
                __isEnemyCharacterEvent__(event)) {
                event._moveType = 0;
                event._moveSpeed = 0;
                event._chaseRange = 0;
                event._chaseSpeed = 0;
                event._trigger = 0;
                event._chasePlayer = false;
                event._seePlayer = false;
                event.setThrough(true); // pass through the zombie
                event.canSeePlayer = () => {
                    return false
                };
            }
        });
    };

    function __onRemoveAllEnemiesTriggered__() {
        let enemy_removed_count = 0;
        $gameMap.events().forEach(event => {
            if (event != null && event instanceof Game_Event &&
                __isEnemyCharacterEvent__(event)) {
                // Update event's self switch A,B,D to true to mark enemy in
                // killed state to avoid respawning
                $gameSelfSwitches.setValue(
                    [$gameMap.mapId(), event.eventId(), 'A'], true);
                $gameSelfSwitches.setValue(
                    [$gameMap.mapId(), event.eventId(), 'B'], true);
                $gameSelfSwitches.setValue(
                    [$gameMap.mapId(), event.eventId(), 'D'], true);
                event.erase();
                enemy_removed_count += 1;
            }
        });
        __updateRemoveAllEnemiesInfo__(enemy_removed_count);
    };

    function __onToggleDarkSceneTriggered__() {
        is_dark_scene_disabled = !is_dark_scene_disabled;
        if (is_dark_scene_disabled === false) {
            // set current color tone only if original color tone exists
            if (original_color_tone.length > 0) {
                $gameScreen._tone = original_color_tone.clone();
            }
            // Ditch current saved color tone
            original_color_tone = [];
            __enableTerraxLightingEffect__();
        }
        __updateDisableDarkSceneInfo__();
    };

    function __isEnemyCharacterEvent__(event) {
        const name = event.characterName();
        const enemy_name_list = [
            'Male_Zombies', 'Male_Zombies_Gore', 'PHC_Em-Serv-ZomA2',
            'PHC_Em-Serv-ZomGoreB2', 'PHC_Em-Serv-ZomB2',
            'PHC_Em-Serv-ZomGoreA2', 'Zombies_Med1', 'Zombies_Med2'
        ];
        let isEnemy = false;
        enemy_name_list.forEach(candicate => {
            isEnemy |= (name === candicate);
        });
        return isEnemy;
    };

    function __monitorCustomInputSetup__() {
        Input.keyMapper[speed_multiplier_virtualkey] = speed_multiplier_keyname;
        Input.keyMapper[freeze_zombie_movement_virtualkey] =
            freeze_zombie_movement_keyname;
        Input.keyMapper[remove_all_enemies_virtualkey] =
            remove_all_enemies_keyname;
        Input.keyMapper[toggle_dark_scene_virtualkey] =
            toggle_dark_scene_keyname;
    };

    function __monitorCustomInput__() {
        if (!SceneManager.isSceneChanging()) {
            if (Input.isTriggered(speed_multiplier_keyname)) {
                __onSpeedMultiplierChange__();
                return true;
            }
            if (Input.isTriggered(freeze_zombie_movement_keyname)) {
                is_zombie_freezed = !is_zombie_freezed;
                __updateZombieMovementFreezedChangedInfo__();
                return true;
            }
            if (Input.isTriggered(remove_all_enemies_keyname)) {
                __onRemoveAllEnemiesTriggered__();
                return true;
            }
            if (Input.isTriggered(toggle_dark_scene_keyname)) {
                __onToggleDarkSceneTriggered__();
                return true;
            }
        }
        return false;
    };

    function __handleCheat__() {
        // update every 30 frame (~0.5 seconds)
        if (Graphics.frameCount - last_frame_count > 30) {
            __setMaxMoney__();
            __setFullHP__();
            __setFullItems__();
            if (is_dark_scene_disabled) {
                __disableDarkScene__();
            }
            if (is_zombie_freezed) {
                __onZombieMovementFreezedTriggered__();
            }
            // Update frame count
            last_frame_count = Graphics.frameCount;
        }
    };

    function __setMaxMoney__() {
        // Set money 99999999999
        $gameParty._gold = 99999999999;
    };

    function __setFullHP__() {
        // Max HP (id = 19)
        const maxHP = $gameVariables.value(19);
        // Current HP (id = 18) - set to 99999
        $gameVariables.setValue(18, maxHP + 1);
    };

    function __setFullItems__() {
        // Scrap Metal x99
        $gameParty._items[1] = 99;
        // Scrap Wood x99
        $gameParty._items[2] = 99;
        // Scrap Brick x99
        $gameParty._items[3] = 99;
        // Electric Fuse x99
        $gameParty._items[4] = 99;
        // Medicinal Herb x99
        $gameParty._items[5] = 99;
        // Water x99
        $gameParty._items[6] = 99;
        // Food (Grain) x99
        $gameParty._items[7] = 99;
        // Food (Fish) x99
        $gameParty._items[8] = 99;
        // Food (Junk) x99
        $gameParty._items[9] = 99;
        // Red Wine x99
        $gameParty._items[10] = 99;
        // Premium Vodka x99
        $gameParty._items[11] = 99;
        // Med kit x99
        $gameParty._items[12] = 99;
        // Food (Fresh) x99
        $gameParty._items[13] = 99;
        // Golden Key x99
        $gameParty._items[14] = 99;
        // Crafting Manual (Beginner) x99
        // $gameParty._items[15] = 99;
        // Crafting Manual (Intermediate) x99
        // $gameParty._items[16] = 99;
        // Crafting Manual (Advanced) x99
        // $gameParty._items[17] = 99;
        // Bartender's Basics x99
        // $gameParty._items[18] = 99;
        // Pistol x99
        // $gameParty._items[19] = 99;
        // Ammunition(Revolver) x99
        $gameParty._items[20] = 99;
        // Ammunition x4 (Rev.) x99
        $gameParty._items[21] = 99;
        // Shotgun x99
        // $gameParty._items[22] = 99;
        // Ammunition (Shotgun) x99
        $gameParty._items[23] = 99;
        // Ammunition X6 (Shot.) x99
        $gameParty._items[24] = 99;
        // 3rd Weapon Placeholder x99
        // $gameParty._items[25] = 99;
        // String x99
        $gameParty._items[29] = 99;
        // Fishing rod x99
        $gameParty._items[30] = 99;
        // Wood Cutting Axe x99
        $gameParty._items[31] = 99;
        // Metal-Cutting Saw x99
        $gameParty._items[32] = 99;
        // Hookshot x99
        // $gameParty._items[33] = 99;
        // Z-Cola x99
        $gameParty._items[34] = 99;
        // Erotic Soap x99
        // $gameParty._items[35] = 99;
        // Police Station Key x99
        // $gameParty._items[42] = 99;
        // Nostalgic Flower x99
        // $gameParty._items[43] = 99;
        // Hydro Plant Key x99
        // $gameParty._items[44] = 99;
        // Storage Crane Card A x99
        // $gameParty._items[45] = 99;
        // Fiona's Shop Schematic x99
        // $gameParty._items[50] = 99;
        // Garden Schematic x99
        // $gameParty._items[51] = 99;
        // Communications Kit x99
        // $gameParty._items[52] = 99;
        // Subway Blue Card x99
        // $gameParty._items[53] = 99;
        // Helios Module B
        // $gameParty._items[55] = 99;
        // Bathroom Seat Instructions
        // $gameParty._items[58] = 99;
        // Water Filter Schematic
        // $gameParty._items[59] = 99;
        // Stacy's Diner Schematic
        // $gameParty._items[60] = 99;
        // Strawberry Milkshake
        $gameParty._items[66] = 99;
        // Chocolate Milkshake
        $gameParty._items[67] = 99;
        // Blueberry Milkshake
        $gameParty._items[68] = 99;
        // Rootbeer Float
        $gameParty._items[69] = 99;
        // Strawberries [Stacy]
        $gameParty._items[70] = 99;
        // Blueberries [Stacy]
        $gameParty._items[71] = 99;
        // Chocolate [Stacy]
        $gameParty._items[72] = 99;
        // Milk [Stacy]
        $gameParty._items[73] = 99;
        // Digital Camera
        // $gameParty._items[79] = 99;
        // Silk Bra
        // $gameParty._items[80] = 99;
        // Scrap Wood (x3)
        $gameParty._items[82] = 99;
        // Scrap Metal (x3)
        $gameParty._items[83] = 99;
        // Scrap Brick (x3)
        $gameParty._items[84] = 99;
        // Water (x3)
        $gameParty._items[85] = 99;
        // Food (Grain) (x3)
        $gameParty._items[86] = 99;
    };

    function __disableDarkScene__() {
        // Keep original color tone
        if ($gameScreen.tone().toString() !== '0,0,0,0') {
            original_color_tone = $gameScreen.tone().clone();
        }
        // Set color tone to 0 to prevent dim scene
        $gameScreen.tone().fill(0);
        // Disable Terrax lighting script if exists
        __disableTerraxLightingEffect__();
    };

    function __disableTerraxLightingEffect__() {
        if ($gameVariables.SetStopScript !== undefined) {
            $gameVariables.SetStopScript(true);
            __disableTerraxLightingEffect__ = function() {
                $gameVariables.SetStopScript(true);
            };
        } else {
            __disableTerraxLightingEffect__ = function() {};
        }
    };

    function __enableTerraxLightingEffect__() {
        if ($gameVariables.SetStopScript !== undefined) {
            $gameVariables.SetStopScript(false);
            __enableTerraxLightingEffect__ = function() {
                $gameVariables.SetStopScript(false);
            };
        } else {
            __enableTerraxLightingEffect__ = function() {};
        }
    };

    function __cheatInjection__() {
        // Use this to open debug mode, and F9 to open debug panel.
        //$gameTemp._isPlaytest = true;

        // Cheating
        __handleCheat__();
    };  // end of __cheatInjection__

    function __createDefaultTextStyle__() {
        // Modify yourslef if you need a customized text style
        // There is a good reference: https://pixijs.io/pixi-text-style/#
        return new PIXI.TextStyle({
            dropShadow: true,
            dropShadowAlpha: 0.3,
            dropShadowColor: '#9e9e9e',
            fontFamily: 'Comic Sans MS',
            fontSize: 18,
            fontWeight: 600,
            lineJoin: 'bevel',
            stroke: 'white',
            strokeThickness: 3
        });
    };

    function __createSpeedMultiplierMessageBoilerplate__(speedMultiplier) {
        return `Speed Multiplier : ${speedMultiplier}x`;
    };

    function __buildSpeedChangeInfo__() {
        let text = new PIXI.Text('', __createDefaultTextStyle__());
        text._text =
            __createSpeedMultiplierMessageBoilerplate__(speed_multiplier);
        text.x = 5;
        text.alpha = 0;
        text.updateText();
        return text;
    };

    function __buildCheatScriptInfo__() {
        let text = new PIXI.Text('', __createDefaultTextStyle__());
        text._text = `Cheat is activated. Support Game Version: ${
            supported_game_version}`;
        text.style.fill = 0x000000;  // white color
        text.x = 420;
        text.y = Graphics.boxHeight - 15 - text.style.fontSize;
        text.alpha = 1.0;
        text.updateText();
        return text;
    };

    function __updateSpeedChangeInfo__(speedMultiplier) {
        const text =
            __createSpeedMultiplierMessageBoilerplate__(speedMultiplier);
        __updateNotificationMessage__(text);
        __registerNotificationFadeEffect__();
    };

    function __updateZombieMovementFreezedChangedInfo__() {
        const text = is_zombie_freezed ? `Freeze all zombie's movement` :
                                         `All zombie can move right now`;
        __updateNotificationMessage__(text);
        __registerNotificationFadeEffect__();
    };

    function __updateRemoveAllEnemiesInfo__(removed_count) {
        const text = `Remove ${removed_count} enemies`
        __updateNotificationMessage__(text);
        __registerNotificationFadeEffect__();
    };

    function __updateDisableDarkSceneInfo__() {
        const text =
            `${is_dark_scene_disabled ? 'Disable' : 'Enable'} dark scene effect`
        __updateNotificationMessage__(text);
        __registerNotificationFadeEffect__();
    };

    function __updateNotificationMessage__(text) {
        SceneManager._scene.speedChangeInfo._text = text;
        SceneManager._scene.speedChangeInfo.alpha = 3.0;
        SceneManager._scene.speedChangeInfo.updateText();
    };

    function __registerNotificationFadeEffect__() {
        if (fadeEffectHandlerId != -1) {
            clearInterval(fadeEffectHandlerId);
            fadeEffectHandlerId = -1;
        }

        fadeEffectHandlerId = setInterval(() => {
            if (SceneManager._scene.speedChangeInfo !== undefined) {
                if (SceneManager._scene.speedChangeInfo.alpha > 0) {
                    SceneManager._scene.speedChangeInfo.alpha -= 0.20
                }
            } else {
                clearInterval(fadeEffectHandlerId);
                fadeEffectHandlerId = -1;
            }
        }, 100);
    };

    // Hook Scene_Map::update method
    const Hook__Scene_Map__update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        Hook__Scene_Map__update.call(this, arguments);
        __cheatInjection__();
    };

    // Hook Scene_Map::createDisplayObjects method
    const Hook__Scene_Map__createDisplayObjects =
        Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        Hook__Scene_Map__createDisplayObjects.call(this, arguments);
        this.speedChangeInfo = __buildSpeedChangeInfo__();
        this.addChild(this.speedChangeInfo);
        // Ditch old map's color tone
        original_color_tone = [];
        last_frame_count = Graphics.frameCount;
    };

    // Hook Scene_Title::create method
    const Hook__Scene_Title__create = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
        Hook__Scene_Title__create.call(this, arguments);
        this.cheatScriptInfo = __buildCheatScriptInfo__();
        this.addChild(this.cheatScriptInfo);
    };

    // Hook Window_Message::updateInput method
    const Hook__Window_Message__updateInput =
        Window_Message.prototype.updateInput;
    Window_Message.prototype.updateInput = function() {
        let isUpdated = Hook__Window_Message__updateInput.call(this, arguments);
        __monitorCustomInputSetup__();
        isUpdated |= __monitorCustomInput__();
        return isUpdated;
    };

    // Hook SceneManager.updateMain method
    const Hook__SceneManager__updateMain = SceneManager.updateMain;
    SceneManager.updateMain = function() {
        if (Utils.isMobileSafari()) {
            this.changeScene();
            this.updateScene();
        } else {
            var newTime = this._getTimeInMsWithoutMobileSafari();
            var fTime = (newTime - this._currentTime) / 1000;
            if (fTime > 0.25) fTime = 0.25;
            this._currentTime = newTime;
            this._accumulator += fTime * speed_multiplier;
            while (this._accumulator >= this._deltaTime) {
                this.updateInputData();
                this.changeScene();
                this.updateScene();
                this._accumulator -= this._deltaTime;
            }
        }
        this.renderScene();
        this.requestUpdate();
    };
})();

// print all data items to the console.
// It is good for adding new items
function zr2cheat_print_all_items() {
    const dataCount = $dataItems.length;
    let id = 1;
    for (id = 1; id < dataCount; id++) {
        if ($dataItems[id].name !== '')
            console.log(id + ':' + $dataItems[id].name);
    }
}

// print all zombies's character name to the console.
// It is good for checking new characters or zombies in new version
function zr2cheat_print_all_zombies_name() {
    $gameMap.events().forEach(event => {
        if (event != null && event instanceof Game_Event) {
            if (event._characterName !== '') {
                const id = $gameMap.events().findIndex((obj) => obj === event);
                console.log(`${id} : ${event._characterName}`)
            }
        }
    });
}