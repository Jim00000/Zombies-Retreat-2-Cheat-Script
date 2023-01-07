{
    /*
    Copyright (C) 2021-2023 Jim00000

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
// ▶ Target process : Zombie's Retreat 2 - Beta 0.11.1
// ▶ Update         : 01.07.2023
// ▶ License        : GNU GENERAL PUBLIC LICENSE Version 3
// --------------------------------------------------------------------------------

(() => {
    let last_frame_count = 0;
    let speed_multiplier = 1.0;
    let fadeEffectHandlerId = -1;
    let is_cheat_panel_open = false;
    let is_zombie_freezed = false;
    let is_dark_scene_disabled = false;
    let is_full_hp_enabled = false;
    let is_full_item_enabled = false;
    let enemy_count = 0;
    let original_color_tone = [];
    const supported_game_version = 'beta 0.10.3'
    const toggle_cheat_panel_virtualkey = 118  // F7
    const remove_all_enemies_virtualkey = 119  // F8
    const remove_all_enemies_keyname = 'remove_all_enemies';
    const toggle_cheat_panel_keyname = 'toggle_cheat_panel';
    const original_zr2_title = document.title;

    nw.Window.get().on('close', (win) => {
        // close cheat pane window process if open
        if (is_cheat_panel_open) {
            process.emit('CloseCheatPane');
        }
        process.exit(0);  // terminate this process
    });

    process.emit('ResetCheat');

    process.addListener('OnCheatPaneProcessReadyTriggered', () => {
        // synchronize cheat status with cheat panel
        process.emit('SynchronizeCheatStatus', {
            is_full_hp_enabled: is_full_hp_enabled,
            is_full_item_enabled: is_full_item_enabled,
            is_zombie_freezed: is_zombie_freezed,
            is_dark_scene_disabled: is_dark_scene_disabled,
            speed_multiplier: speed_multiplier,
            enemy_count: enemy_count,
        });
    });

    process.addListener('OnFullHPTriggered', (toggle) => {
        is_full_hp_enabled = toggle;
    });

    process.addListener('OnFullItemsTriggered', (toggle) => {
        is_full_item_enabled = toggle;
    });

    process.addListener('OnFreezeZombieTriggered', (toggle) => {
        is_zombie_freezed = toggle;
        __updateZombieMovementFreezedChangedInfo__();
    });

    process.addListener('OnDisableDarkSceneEffectTriggered', (toggle) => {
        is_dark_scene_disabled = toggle;
        __onToggleDarkSceneTriggered__();
    });

    process.addListener('KillAllZombies', () => {
        __onRemoveAllEnemiesTriggered__();
    });

    process.addListener('ChangeGameSpeedMultiplier', (multiplier) => {
        __onSpeedMultiplierChange__(multiplier);
    });

    function __onSpeedMultiplierChange__(multiplier) {
        if (1.0 <= multiplier && multiplier <= 3.5) {
            speed_multiplier = multiplier;
            __updateSpeedChangeInfo__(speed_multiplier);
        }
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
                event.setThrough(true);  // pass through the zombie
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

    function __onToggleCheatPanelTriggered__() {
        if (nw !== undefined && is_cheat_panel_open === false) {
            nw.Window.open(
                'www/js/plugins/zr2cheat/cheat_panel/index.html', {}, (win) => {
                    // onClosed event
                    win.on('closed', function() {
                        win = null;
                        is_cheat_panel_open = false;
                    });
                });
            is_cheat_panel_open = true;
        }
    };

    function __calculateEnemyCount__() {
        let enemy_count = 0;
        $gameMap.events().forEach(event => {
            if (event != null && event instanceof Game_Event &&
                __isEnemyCharacterEvent__(event)) {
                enemy_count += 1;
            }
        });
        return enemy_count;
    };

    function __updateEnemyCountOnCheatPanel__() {
        const current_enemy_count = __calculateEnemyCount__();
        if (current_enemy_count !== enemy_count) {
            enemy_count = current_enemy_count;
            process.emit('UpdateEnemyCountBadge', enemy_count);
        }
    };

    function __isEnemyCharacterEvent__(event) {
        const name = event.characterName();
        const enemy_name_list = [
            'HC_Zombies2A',           //
            'HC_Zombies2B',           //
            'HC_Zombies2C',           //
            'HC_Zombies2D',           //
            'HC_Zombies3C',           //
            'Male_Zombies',           //
            'Male_Zombies_Gore',      //
            'PHC_Em-Serv-ZomA2',      //
            'PHC_Em-Serv-ZomB2',      //
            'PHC_Em-Serv-ZomGoreA2',  //
            'PHC_Em-Serv-ZomGoreB2',  //
            'Zombies_Med1',           //
            'Zombies_Med2'            //
        ];
        let isEnemy = false;
        enemy_name_list.forEach(candicate => {
            isEnemy |= (name === candicate);
        });
        return isEnemy;
    };

    function __monitorCustomInputSetup__() {
        Input.keyMapper[remove_all_enemies_virtualkey] =
            remove_all_enemies_keyname;
        Input.keyMapper[toggle_cheat_panel_virtualkey] =
            toggle_cheat_panel_keyname;
    };

    function __monitorCustomInput__() {
        if (!SceneManager.isSceneChanging()) {
            if (Input.isTriggered(remove_all_enemies_keyname)) {
                __onRemoveAllEnemiesTriggered__();
                return true;
            }
            if (Input.isTriggered(toggle_cheat_panel_keyname)) {
                __onToggleCheatPanelTriggered__();
                return true;
            }
        }
        return false;
    };

    function __handleCheat__() {
        // update every 30 frame (~0.5 seconds)
        if (Graphics.frameCount - last_frame_count > 30) {
            if (is_full_hp_enabled) {
                __setFullHP__();
            }
            if (is_full_item_enabled) {
                __setFullItems__();
            }
            if (is_dark_scene_disabled) {
                __disableDarkScene__();
            }
            if (is_zombie_freezed) {
                __onZombieMovementFreezedTriggered__();
            }
            if (is_cheat_panel_open) {
                __updateEnemyCountOnCheatPanel__();
            }
            // Tell the player hint if possible
            __handlePuzzleHint__();
            // Update frame count
            last_frame_count = Graphics.frameCount;
        }
    };

    function __setFullHP__() {
        // Max HP (id = 19)
        const maxHP = $gameVariables.value(19);
        // Current HP (id = 18) - set to 99999
        $gameVariables.setValue(18, maxHP + 1);
        // Lucy HP (id = 55) - set to 4
        $gameVariables.setValue(55, 4);
        // Horde Survivor HP (id = 60) - set to 4
        $gameVariables.setValue(60, 4);
    };

    function __setFullItems__() {
        $gameParty._items[1] = 99;   // Scrap Metal
        $gameParty._items[2] = 99;   // Scrap Wood
        $gameParty._items[3] = 99;   // Scrap Brick
        $gameParty._items[4] = 99;   // Electric Fuse
        $gameParty._items[5] = 99;   // Medicinal Herb
        $gameParty._items[6] = 99;   // Water
        $gameParty._items[7] = 99;   // Food (Grain)
        $gameParty._items[8] = 99;   // Food (Fish)
        $gameParty._items[9] = 99;   // Food (Junk)
        $gameParty._items[10] = 99;  // Red Wine
        $gameParty._items[11] = 99;  // Premium Vodka
        $gameParty._items[12] = 99;  // Med kit
        $gameParty._items[13] = 99;  // Food (Fresh)
        $gameParty._items[14] = 99;  // Golden Key
        // $gameParty._items[15] =;  // Crafting Manual (Beginner)
        // $gameParty._items[16] =;  // Crafting Manual (Intermediate)
        // $gameParty._items[17] =;  // Crafting Manual (Advanced)
        // $gameParty._items[18] =;  // Bartender's Basics
        // $gameParty._items[19] =;  // Pistol
        $gameParty._items[20] = 99;  // Ammunition(Revolver)
        $gameParty._items[21] = 99;  // Ammunition x4 (Rev.)
        // $gameParty._items[22] =;  // Shotgun
        $gameParty._items[23] = 99;  // Ammunition (Shotgun)
        $gameParty._items[24] = 99;  // Ammunition X6 (Shot.)
        // $gameParty._items[25] =;  // 3rd Weapon Placeholder
        // $gameParty._items[28] =;  // Lead Pipe
        $gameParty._items[29] = 99;  // String
        $gameParty._items[30] = 99;  // Fishing rod
        $gameParty._items[31] = 99;  // Wood Cutting Axe
        $gameParty._items[32] = 99;  // Metal-Cutting Saw
        $gameParty._items[33] = 99;  // Heavy Hammer
        $gameParty._items[34] = 99;  // Z-Cola
        // $gameParty._items[35] =;  // Erotic Soap
        // $gameParty._items[36] =;  // Misty's Endorsement
        $gameParty._items[37] = 99;  // Nuclear Fish
        $gameParty._items[38] = 99;  // Golden Fish
        $gameParty._items[39] = 99;  // Magma Fish
        $gameParty._items[40] = 99;  // Rusty Can
        // $gameParty._items[42] =;  // Police Station Key
        // $gameParty._items[43] =;  // Nostalgic Flower
        // $gameParty._items[44] =;  // Hydro Plant Key
        // $gameParty._items[45] =;  // Storage Crane Card A
        // $gameParty._items[50] =;  // Fiona's Shop Schematic
        // $gameParty._items[51] =;  // Garden Schematic
        // $gameParty._items[52] =;  // Communications Kit
        // $gameParty._items[53] =;  // Subway Blue Card
        // $gameParty._items[55] =;  // Helios Module B
        // $gameParty._items[58] =;  // Bathroom Seat Instructions
        // $gameParty._items[59] =;  // Water Filter Schematic
        // $gameParty._items[60] =;  // Stacy's Diner Schematic
        $gameParty._items[66] = 99;  // Strawberry Milkshake
        $gameParty._items[67] = 99;  // Chocolate Milkshake
        $gameParty._items[68] = 99;  // Blueberry Milkshake
        $gameParty._items[69] = 99;  // Rootbeer Float
        $gameParty._items[70] = 99;  // Strawberries [Stacy]
        $gameParty._items[71] = 99;  // Blueberries [Stacy]
        $gameParty._items[72] = 99;  // Chocolate [Stacy]
        $gameParty._items[73] = 99;  // Milk [Stacy]
        // $gameParty._items[75] =;  // Flare Gun [Lucy]
        // $gameParty._items[79] =;  // Digital Camera
        // $gameParty._items[80] =;  // Silk Bra
        $gameParty._items[82] = 99;  // Scrap Wood (x3)
        $gameParty._items[83] = 99;  // Scrap Metal (x3)
        $gameParty._items[84] = 99;  // Scrap Brick (x3)
        $gameParty._items[85] = 99;  // Water (x3)
        $gameParty._items[86] = 99;  // Food (Grain) (x3)
        $gameParty._items[87] = 99;  // Electric Fuse (x3)
        // $gameParty._items[95] =;  // Halloween Candy
        // $gameParty._items[96] =;  // Vending Machine Token
        // $gameParty._items[97] =;  // Tasty Juice
        // $gameParty._items[98] =;  // Brittle Shovel
        // $gameParty._items[99] =;  // Strange Orb
        // $gameParty._items[100] =; // Cursed Orb
        // $gameParty._items[101] =; // Purified Orb
        // $gameParty._items[102] =; // Pumpkin
        // $gameParty._items[103] =; // Jack-O-Lantern
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

    function __handlePuzzleHint__() {
        let is_hint_enabled = false;
        // Quest: Medicinal Mayhem (Synthesize herbs mission)
        is_hint_enabled |=
            __checkAndHandleMedicinalMayhemQuestSynthesizeHerbsHint__();
        is_hint_enabled |=
            __checkAndHandleShowStoppersQuestPickArcadeMachineHint__();
        if (is_hint_enabled === false) {
            __disableQuestHintInfo__();
        }
    };

    function __checkAndHandleMedicinalMayhemQuestSynthesizeHerbsHint__() {
        const medicine_quest_start = $gameSwitches.value(104);
        const medicine_quest_complete = $gameSwitches.value(118);
        const map_id = $gameMap.mapId();
        if (medicine_quest_start === true &&
            medicine_quest_complete === false && map_id === 53) {
            __enableQuestHintInfo__();
            __updateQuestHintMessage__(
                'Hint: 1. Yellow 2. Blue 3. Yellow 4. Red 5. Blue 6. Red');
            return true;
        }
        return false;
    };

    function __checkAndHandleShowStoppersQuestPickArcadeMachineHint__() {
        const arcade_quest_start = $gameSwitches.value(129);
        const stacy_arcade_quest_complete = $gameSwitches.value(132);
        const map_id = $gameMap.mapId();
        if (arcade_quest_start === true &&
            stacy_arcade_quest_complete === false && map_id === 26) {
            __enableQuestHintInfo__();
            __updateQuestHintMessage__(
                'Hint: Purple → Pink → Teal → Pink → Purple → Red → Teal → Red');
            return true;
        }
        return false;
    };

    function __cheatInjection__() {
        // Use this to open debug mode, and F9 to open debug panel.
        // $gameTemp._isPlaytest = true;

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
        text.x = 400;
        text.y = Graphics.boxHeight - 15 - text.style.fontSize;
        text.alpha = 1.0;
        text.updateText();
        return text;
    };

    function __buildQuestHintInfo__() {
        let text = new PIXI.Text('', __createDefaultTextStyle__());
        text._text = '';
        text.alpha = 0.0;
        text.x = 10;
        text.y = Graphics.boxHeight - 15 - text.style.fontSize;
        text.updateText();
        return text;
    };

    function __enableQuestHintInfo__() {
        const text = SceneManager._scene.questHintInfo;
        text.alpha = 1.0;
        text.updateText();
    };

    function __disableQuestHintInfo__() {
        const text = SceneManager._scene.questHintInfo;
        text._text = '';
        text.alpha = 0.0;
        text.updateText();
    };

    function __updateQuestHintMessage__(msg) {
        const text = SceneManager._scene.questHintInfo;
        text.text = msg;
        text.alpha = 1.0;
        text.updateText();
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
        this.questHintInfo = __buildQuestHintInfo__();
        this.addChild(this.questHintInfo);
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
        // Update the title
        document.title =
            original_zr2_title + ' (Hint: Use F7 to open cheat panel)';
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

const zr2cheat = {
    // print all data items to the console.
    // It is good for adding new items
    print_all_items: function() {
        const dataCount = $dataItems.length;
        let id = 1;
        for (id = 1; id < dataCount; id++) {
            if ($dataItems[id].name !== '')
                console.log(id + ':' + $dataItems[id].name);
        }
    },
    // print all zombies's character name to the console.
    // It is good for checking new characters or zombies in new version
    print_all_zombies_name: function() {
        $gameMap.events().forEach(event => {
            if (event != null && event instanceof Game_Event) {
                if (event._characterName !== '') {
                    const id =
                        $gameMap.events().findIndex((obj) => obj === event);
                    console.log(`${id} : ${event._characterName}`)
                }
            }
        });
    },
    // check the environment is desktop.
    // This cheat doesn't support mobile device.
    is_desktop_application: function() {
        const IsSupported = Utils.isNwjs() &
            (Utils.isMobileDevice() === false) & nw !== undefined;
        const result = (IsSupported === 1) ? true : false;
        zr2cheat.is_desktop_application = () => {
            return result
        };
        return zr2cheat.is_desktop_application();
    },
};