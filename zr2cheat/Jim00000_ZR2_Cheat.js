/*  Copyright (C) 2021-2023 Jim00000

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
    <https://www.gnu.org/licenses/>. */

// --------------------------------------------------------------------------------
// Jim00000's cheat script for Zombie's Retreat 2
// --------------------------------------------------------------------------------
// ▶ Author         : Jim00000
// ▶ Target process : Zombie's Retreat 2 - Beta 0.12.3
// ▶ Update         : 04.09.2023
// ▶ License        : GNU GENERAL PUBLIC LICENSE Version 3
// --------------------------------------------------------------------------------

class ZR2CheatManager {
    static last_frame_count = 0;
    static speed_multiplier = 1.0;
    static fadeEffectHandlerId = -1;
    static is_zombie_freezed = false;
    static enemy_count = 0;
    static supported_game_version = 'beta 0.12.3';
    static original_zr2_title = document.title;

    static buildCheatScriptInfo() {
        let text = new PIXI.Text('', ZR2CheatManager.createDefaultTextStyle());
        text._text = `Cheat is activated. Support Game Version: ${
            ZR2CheatManager.supported_game_version}`;
        text.style.fill = 0x000000;  // white color
        text.x = 400;
        text.y = Graphics.boxHeight - 15 - text.style.fontSize;
        text.alpha = 1.0;
        text.updateText();
        return text;
    }

    static createDefaultTextStyle() {
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
    }

    static updateRemoveAllEnemiesInfo(removed_count) {
        const text = `Remove ${removed_count} enemies`
        ZR2CheatManager.updateNotificationMessage(text);
        ZR2CheatManager.registerNotificationFadeEffect();
    }

    static updateSpeedChangeInfo(speedMultiplier) {
        const text = ZR2CheatManager.createSpeedMultiplierMessageBoilerplate(
            speedMultiplier);
        ZR2CheatManager.updateNotificationMessage(text);
        ZR2CheatManager.registerNotificationFadeEffect();
    }

    static buildSpeedChangeInfo() {
        let text = new PIXI.Text('', ZR2CheatManager.createDefaultTextStyle());
        text._text = ZR2CheatManager.createSpeedMultiplierMessageBoilerplate(
            ZR2CheatManager.speed_multiplier);
        text.x = 5;
        text.alpha = 0;
        text.updateText();
        return text;
    }

    static createSpeedMultiplierMessageBoilerplate(speedMultiplier) {
        return `Speed Multiplier : ${speedMultiplier}x`;
    }

    static buildQuestHintInfo() {
        let text = new PIXI.Text('', ZR2CheatManager.createDefaultTextStyle());
        text._text = '';
        text.alpha = 0.0;
        text.x = 10;
        text.y = Graphics.boxHeight - 15 - text.style.fontSize;
        text.updateText();
        return text;
    }

    static calculateEnemyCount() {
        let enemy_count = 0;
        $gameMap.events().forEach(event => {
            if (event != null && event instanceof Game_Event &&
                ZR2CheatEventHandler.isEnemyCharacterEvent(event)) {
                enemy_count += 1;
            }
        });
        return enemy_count;
    }

    static updateZombieMovementFreezedChangedInfo() {
        const text = ZR2CheatManager.is_zombie_freezed ?
            `Freeze all zombie's movement` :
            `All zombie can move right now`;
        ZR2CheatManager.updateNotificationMessage(text);
        ZR2CheatManager.registerNotificationFadeEffect();
    }

    static updateNotificationMessage(text) {
        SceneManager._scene.speedChangeInfo._text = text;
        SceneManager._scene.speedChangeInfo.alpha = 3.0;
        SceneManager._scene.speedChangeInfo.updateText();
    }

    static registerNotificationFadeEffect() {
        if (ZR2CheatManager.fadeEffectHandlerId != -1) {
            clearInterval(ZR2CheatManager.fadeEffectHandlerId);
            ZR2CheatManager.fadeEffectHandlerId = -1;
        }

        ZR2CheatManager.fadeEffectHandlerId = setInterval(() => {
            if (SceneManager._scene.speedChangeInfo !== undefined) {
                if (SceneManager._scene.speedChangeInfo.alpha > 0) {
                    SceneManager._scene.speedChangeInfo.alpha -= 0.20
                }
            } else {
                clearInterval(ZR2CheatManager.fadeEffectHandlerId);
                ZR2CheatManager.fadeEffectHandlerId = -1;
            }
        }, 100);
    }
}

class ZR2CheatEventHandler {
    static enemy_name_list = [
        'HC_Zombies2A', 'HC_Zombies2B', 'HC_Zombies2C', 'HC_Zombies2D',
        'HC_Zombies3C', 'Male_Zombies', 'Male_Zombies_Gore',
        'PHC_Em-Serv-ZomA2', 'PHC_Em-Serv-ZomB2', 'PHC_Em-Serv-ZomGoreA2',
        'PHC_Em-Serv-ZomGoreB2', 'Zombies_Med1', 'Zombies_Med2'
    ];

    static handleCheat() {
        // Use this to open debug mode, and F9 to open debug panel.
        // $gameTemp._isPlaytest = true;

        // update every 30 frame (~0.5 seconds)
        if (Graphics.frameCount - ZR2CheatManager.last_frame_count > 30) {
            if (ZR2CheatFullHP.is_full_hp_enabled) {
                ZR2CheatFullHP.setFullHP();
            }
            if (ZR2CheatFullItem.is_full_item_enabled) {
                ZR2CheatFullItem.setFullItems();
            }
            if (ZR2CheatLightingController.is_dark_scene_disabled) {
                ZR2CheatLightingController.disableDarkScene();
            }
            if (ZR2CheatManager.is_zombie_freezed) {
                ZR2CheatEventHandler.onZombieMovementFreezedTriggered();
            }
            if (ZR2ChearPanelManager.is_cheat_panel_open) {
                ZR2ChearPanelManager.updateEnemyCountOnCheatPanel();
            }
            // Tell the player hint if possible
            ZR2CheatEventHandler.handlePuzzleHint();
            // Update frame count
            ZR2CheatManager.last_frame_count = Graphics.frameCount;
        }
    }

    static handlePuzzleHint() {
        let is_hint_enabled = false;
        // Quest: Medicinal Mayhem (Synthesize herbs mission)
        is_hint_enabled |=
            ZR2CheatPuzzleHint
                .checkAndHandleMedicinalMayhemQuestSynthesizeHerbsHint();
        is_hint_enabled |=
            ZR2CheatPuzzleHint
                .checkAndHandleShowStoppersQuestPickArcadeMachineHint();
        // Quest: Sex Ed (the mission which needs code to unlock Issac's locker)
        is_hint_enabled |= ZR2CheatPuzzleHint.checkAndShowHintOfLocker();
        if (is_hint_enabled === false) {
            ZR2CheatPuzzleHint.disableQuestHintInfo();
        }
    }

    static isEnemyCharacterEvent(event) {
        const name = event.characterName();
        let isEnemy = false;
        ZR2CheatEventHandler.enemy_name_list.forEach(candicate => {
            isEnemy |= (name === candicate);
        });
        return isEnemy;
    }

    static onRemoveAllEnemiesTriggered() {
        let enemy_removed_count = 0;
        $gameMap.events().forEach(event => {
            if (event != null && event instanceof Game_Event &&
                ZR2CheatEventHandler.isEnemyCharacterEvent(event)) {
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
        ZR2CheatManager.updateRemoveAllEnemiesInfo(enemy_removed_count);
    }

    static onToggleCheatPanelTriggered() {
        if (nw !== undefined &&
            ZR2ChearPanelManager.is_cheat_panel_open === false) {
            nw.Window.open(
                'www/js/plugins/zr2cheat/cheat_panel/index.html', {}, (win) => {
                    // onClosed event
                    win.on('closed', function() {
                        win = null;
                        ZR2ChearPanelManager.is_cheat_panel_open = false;
                    });
                });
            ZR2ChearPanelManager.is_cheat_panel_open = true;
        }
    }

    static onSpeedMultiplierChange(multiplier) {
        if (1.0 <= multiplier && multiplier <= 3.5) {
            ZR2CheatManager.speed_multiplier = multiplier;
            ZR2CheatManager.updateSpeedChangeInfo(multiplier);
        }
    }

    static onZombieMovementFreezedTriggered() {
        $gameMap.events().forEach(event => {
            if (event != null && event instanceof Game_Event &&
                ZR2CheatEventHandler.isEnemyCharacterEvent(event)) {
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
    }
}

class ZR2CheatInputManager {
    static toggle_cheat_panel_virtualkey = 118;  // F7
    static remove_all_enemies_virtualkey = 119;  // F8
    static remove_all_enemies_keyname = 'remove_all_enemies';
    static toggle_cheat_panel_keyname = 'toggle_cheat_panel';

    static monitorCustomInputSetup() {
        Input.keyMapper[ZR2CheatInputManager.remove_all_enemies_virtualkey] =
            ZR2CheatInputManager.remove_all_enemies_keyname;
        Input.keyMapper[ZR2CheatInputManager.toggle_cheat_panel_virtualkey] =
            ZR2CheatInputManager.toggle_cheat_panel_keyname;
    }

    static monitorCustomInput() {
        if (!SceneManager.isSceneChanging()) {
            if (Input.isTriggered(
                    ZR2CheatInputManager.remove_all_enemies_keyname)) {
                ZR2CheatEventHandler.onRemoveAllEnemiesTriggered();
                return true;
            }
            if (Input.isTriggered(
                    ZR2CheatInputManager.toggle_cheat_panel_keyname)) {
                ZR2CheatEventHandler.onToggleCheatPanelTriggered();
                return true;
            }
        }
        return false;
    }
}

class ZR2CheatFullHP {
    static is_full_hp_enabled = false;
    static setFullHP() {
        // Max HP (id = 19)
        const maxHP = $gameVariables.value(19);
        // Current HP (id = 18) - set to 99999
        $gameVariables.setValue(18, maxHP + 1);
        // Lucy HP (id = 55) - set to 4
        $gameVariables.setValue(55, 4);
        // Horde Survivor HP (id = 60) - set to 4
        $gameVariables.setValue(60, 4);
    }
}

class ZR2CheatFullItem {
    static is_full_item_enabled = false;
    static setFullItems() {
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
    }
}

class ZR2CheatLightingController {
    static original_color_tone = [];
    static is_dark_scene_disabled = false;

    static disableDarkScene() {
        // Keep original color tone
        if ($gameScreen.tone().toString() !== '0,0,0,0') {
            ZR2CheatLightingController.original_color_tone =
                $gameScreen.tone().clone();
        }
        // Set color tone to 0 to prevent dim scene
        $gameScreen.tone().fill(0);
        // Disable Terrax lighting script if exists
        ZR2CheatLightingController.disableTerraxLightingEffect();
    }

    static onToggleDarkSceneTriggered() {
        if (ZR2CheatLightingController.is_dark_scene_disabled === false) {
            // set current color tone only if original color tone exists
            if (ZR2CheatLightingController.original_color_tone.length > 0) {
                $gameScreen._tone =
                    ZR2CheatLightingController.original_color_tone.clone();
            }
            // Ditch current saved color tone
            ZR2CheatLightingController.original_color_tone = [];
            ZR2CheatLightingController.enableTerraxLightingEffect();
        }
        ZR2CheatLightingController.updateDisableDarkSceneInfo();
    }

    static updateDisableDarkSceneInfo() {
        const text = `${
            ZR2CheatLightingController.is_dark_scene_disabled ?
                'Disable' :
                'Enable'} dark scene effect`
        ZR2CheatManager.updateNotificationMessage(text);
        ZR2CheatManager.registerNotificationFadeEffect();
    }

    static disableTerraxLightingEffect() {
        if ($gameVariables.SetStopScript !== undefined) {
            $gameVariables.SetStopScript(true);
            ZR2CheatLightingController.disableTerraxLightingEffect =
                function() {
                $gameVariables.SetStopScript(true);
            };
        } else {
            ZR2CheatLightingController.disableTerraxLightingEffect =
                function() {};
        }
    }

    static enableTerraxLightingEffect() {
        if ($gameVariables.SetStopScript !== undefined) {
            $gameVariables.SetStopScript(false);
            ZR2CheatLightingController.enableTerraxLightingEffect = function() {
                $gameVariables.SetStopScript(false);
            };
        } else {
            ZR2CheatLightingController.enableTerraxLightingEffect =
                function() {};
        }
    }
}

class ZR2CheatPuzzleHint {
    static checkAndHandleMedicinalMayhemQuestSynthesizeHerbsHint() {
        const medicine_quest_start = $gameSwitches.value(104);
        const medicine_quest_complete = $gameSwitches.value(118);
        const map_id = $gameMap.mapId();
        if (medicine_quest_start === true &&
            medicine_quest_complete === false && map_id === 53) {
            ZR2CheatPuzzleHint.enableQuestHintInfo();
            ZR2CheatPuzzleHint.updateQuestHintMessage(
                'Hint: 1. Yellow 2. Blue 3. Yellow 4. Red 5. Blue 6. Red');
            return true;
        }
        return false;
    }

    static checkAndHandleShowStoppersQuestPickArcadeMachineHint() {
        const arcade_quest_start = $gameSwitches.value(129);
        const stacy_arcade_quest_complete = $gameSwitches.value(132);
        const map_id = $gameMap.mapId();
        if (arcade_quest_start === true &&
            stacy_arcade_quest_complete === false && map_id === 26) {
            ZR2CheatPuzzleHint.enableQuestHintInfo();
            ZR2CheatPuzzleHint.updateQuestHintMessage(
                'Hint: Purple → Pink → Teal → Pink → Purple → Red → Teal → Red');
            return true;
        }
        return false;
    }

    static checkSexEdQuestActive() {
        const nadia_sex_cutscene = $gameSwitches.value(186);
        // the quest is active if nadia_sex_cutscene switch is off
        const trigger = !nadia_sex_cutscene;
        const map_id = $gameMap.mapId();
        return trigger === true && map_id === 101;
    }

    static checkAndShowHintOfLocker() {
        const enabled = ZR2CheatPuzzleHint.checkSexEdQuestActive();
        if (enabled) {
            ZR2CheatPuzzleHint.enableQuestHintInfo();
            ZR2CheatPuzzleHint.updateQuestHintMessage(
                'Isaac locker code: 5704811269');
        }
        return enabled;
    }

    static enableQuestHintInfo() {
        const text = SceneManager._scene.questHintInfo;
        text.alpha = 1.0;
        text.updateText();
    }

    static disableQuestHintInfo() {
        const text = SceneManager._scene.questHintInfo;
        text._text = '';
        text.alpha = 0.0;
        text.updateText();
    }

    static updateQuestHintMessage(msg) {
        const text = SceneManager._scene.questHintInfo;
        text.text = msg;
        text.alpha = 1.0;
        text.updateText();
    }
}

class ZR2ChearPanelManager {
    static is_cheat_panel_open = false;
    static updateEnemyCountOnCheatPanel() {
        const current_enemy_count = ZR2CheatManager.calculateEnemyCount();
        if (current_enemy_count !== ZR2CheatManager.enemy_count) {
            ZR2CheatManager.enemy_count = current_enemy_count;
            process.emit('UpdateEnemyCountBadge', current_enemy_count);
        }
    }

    static initialize() {
        process.emit('ResetCheat');
        ZR2ChearPanelManager.addEventListener();
    }

    static addEventListener() {
        process.addListener('OnCheatPaneProcessReadyTriggered', () => {
            // synchronize cheat status with cheat panel
            process.emit('SynchronizeCheatStatus', {
                is_full_hp_enabled: ZR2CheatFullHP.is_full_hp_enabled,
                is_full_item_enabled: ZR2CheatFullItem.is_full_item_enabled,
                is_zombie_freezed: ZR2CheatManager.is_zombie_freezed,
                is_dark_scene_disabled:
                    ZR2CheatLightingController.is_dark_scene_disabled,
                speed_multiplier: ZR2CheatManager.speed_multiplier,
                enemy_count: ZR2CheatManager.enemy_count,
            });
        });

        process.addListener('OnFullHPTriggered', (toggle) => {
            ZR2CheatFullHP.is_full_hp_enabled = toggle;
        });

        process.addListener('OnFullItemsTriggered', (toggle) => {
            ZR2CheatFullItem.is_full_item_enabled = toggle;
        });

        process.addListener('OnFreezeZombieTriggered', (toggle) => {
            ZR2CheatManager.is_zombie_freezed = toggle;
            ZR2CheatManager.updateZombieMovementFreezedChangedInfo();
        });

        process.addListener('OnDisableDarkSceneEffectTriggered', (toggle) => {
            ZR2CheatLightingController.is_dark_scene_disabled = toggle;
            ZR2CheatLightingController.onToggleDarkSceneTriggered();
        });

        process.addListener('KillAllZombies', () => {
            ZR2CheatEventHandler.onRemoveAllEnemiesTriggered();
        });

        process.addListener('ChangeGameSpeedMultiplier', (multiplier) => {
            ZR2CheatEventHandler.onSpeedMultiplierChange(multiplier);
        });
    }
}

class ZR2CheatHook {
    static original = {
        SceneManager: {updateMain: SceneManager.updateMain},
        Window_NameInput: {initialize: Window_NameInput.prototype.initialize},
        Window_Message: {updateInput: Window_Message.prototype.updateInput},
        Scene_Title: {create: Scene_Title.prototype.create},
        Scene_Map: {
            createDisplayObjects: Scene_Map.prototype.createDisplayObjects,
            update: Scene_Map.prototype.update
        }
    }
    // Begin to hook functions
    static hook() {
        Scene_Map.prototype.update = function() {
            ZR2CheatHook.original.Scene_Map.update.call(this, arguments);
            ZR2CheatEventHandler.handleCheat();
        };
        Scene_Map.prototype.createDisplayObjects = function() {
            ZR2CheatHook.original.Scene_Map.createDisplayObjects.call(
                this, arguments);
            this.speedChangeInfo = ZR2CheatManager.buildSpeedChangeInfo();
            this.addChild(this.speedChangeInfo);
            this.questHintInfo = ZR2CheatManager.buildQuestHintInfo();
            this.addChild(this.questHintInfo);
            // Ditch old map's color tone
            ZR2CheatManager.original_color_tone = [];
            ZR2CheatManager.last_frame_count = Graphics.frameCount;
        };
        Scene_Title.prototype.create = function() {
            ZR2CheatHook.original.Scene_Title.create.call(this, arguments);
            this.cheatScriptInfo = ZR2CheatManager.buildCheatScriptInfo();
            this.addChild(this.cheatScriptInfo);
            document.title = ZR2CheatManager.original_zr2_title +
                ' (Hint: Use F7 to open cheat panel)';
        };
        Window_Message.prototype.updateInput = function() {
            let isUpdated =
                ZR2CheatHook.original.Window_Message.updateInput.call(
                    this, arguments);
            ZR2CheatInputManager.monitorCustomInputSetup();
            isUpdated |= ZR2CheatInputManager.monitorCustomInput();
            return isUpdated;
        };
        Window_NameInput.prototype.initialize = function(editWindow) {
            // fill the right answer if Sex Ed quest is active
            if (ZR2CheatPuzzleHint.checkSexEdQuestActive()) {
                editWindow._name = '5704811269';
            }
            ZR2CheatHook.original.Window_NameInput.initialize.call(
                this, editWindow);
        };
        SceneManager.updateMain = function() {
            if (Utils.isMobileSafari()) {
                this.changeScene();
                this.updateScene();
            } else {
                var newTime = this._getTimeInMsWithoutMobileSafari();
                var fTime = (newTime - this._currentTime) / 1000;
                if (fTime > 0.25) fTime = 0.25;
                this._currentTime = newTime;
                this._accumulator += fTime * ZR2CheatManager.speed_multiplier;
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
    }
}

// This class contains all of the helper functions which are useful for
// debugging, or digging the inner data or information in game
class ZR2CheatHelper {
    // print all data items to the console.
    // It is good for adding new items
    static print_all_items() {
        const dataCount = $dataItems.length;
        let id = 1;
        for (id = 1; id < dataCount; id++) {
            if ($dataItems[id].name !== '')
                console.log(id + ':' + $dataItems[id].name);
        }
    }
    // print all zombies's character name to the console.
    // It is good for checking new characters or zombies in new version
    static print_all_zombies_name() {
        $gameMap.events().forEach(event => {
            if (event != null && event instanceof Game_Event) {
                if (event._characterName !== '') {
                    const id =
                        $gameMap.events().findIndex((obj) => obj === event);
                    console.log(`${id} : ${event._characterName}`)
                }
            }
        });
    }
    // print all game's switche names
    static print_all_switch_name() {
        $dataSystem['switches'].forEach((str, idx) => {
            if (idx < $gameSwitches._data.length && str !== '' &&
                $gameSwitches.value(idx) === true) {
                console.log(`${idx} : ${str}`)
            }
        })
    }
    // check the environment is desktop.
    // This cheat doesn't support mobile device.
    static is_desktop_application() {
        const IsSupported = Utils.isNwjs() &
            (Utils.isMobileDevice() === false) & nw !== undefined;
        const result = (IsSupported === 1) ? true : false;
        zr2cheat.is_desktop_application = () => {
            return result
        };
        return zr2cheat.is_desktop_application();
    }
}

// Cheat initialization process
(() => {
    nw.Window.get().on('close', (win) => {
        // close cheat pane window process if open
        if (ZR2ChearPanelManager.is_cheat_panel_open) {
            process.emit('CloseCheatPane');
        }
        process.exit(0);  // terminate this process
    });
    ZR2ChearPanelManager.initialize();
    ZR2CheatHook.hook();
})();  // end of function