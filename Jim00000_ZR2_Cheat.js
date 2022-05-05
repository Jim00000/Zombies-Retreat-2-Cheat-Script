{
  /*
  Copyright (C) 2021-2022 Jim00000

  This file is part of Zombies-Retreat-2-Cheat-Script.

  Zombies-Retreat-2-Cheat-Script is free software: you can redistribute it
  and/or modify it under the terms of the GNU General Public License as
  published by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  Zombies-Retreat-2-Cheat-Script is distributed in the hope that it will be
  useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General
  Public License for more details.

  You should have received a copy of the GNU General Public License along with
  Zombies-Retreat-2-Cheat-Script.  If not, see <https://www.gnu.org/licenses/>.
*/
}

// --------------------------------------------------------------------------------
// Jim00000's cheat script for Zombie's Retreat 2
// --------------------------------------------------------------------------------
// ▶ Author         : Jim00000
// ▶ Target process : Zombie's Retreat 2 - Beta 0.7.2
// ▶ Update         : 05.06.2022
// ▶ License        : GNU GENERAL PUBLIC LICENSE Version 3
// --------------------------------------------------------------------------------

(() => {
  let speed_multiplier = 1.0;
  let fadeEffectHandlerId = -1;
  const supported_game_version = "beta 0.7.2"
  const speed_multiplier_virtualkey = 117  // F6
  const speed_multiplier_keyname = 'change_speed_multiplier';

  // register F6 key to change speed multiplier
  Input.keyMapper[speed_multiplier_virtualkey] = speed_multiplier_keyname;

  const __onSpeedMultiplierChange__ = function() {
    let final_speed_multiplier = speed_multiplier + 0.5;
    if (final_speed_multiplier > 3.5) {
      final_speed_multiplier = 1.0;
    }
    speed_multiplier = final_speed_multiplier;
    __updateSpeedChangeInfo__(speed_multiplier);
  };

  const __monitorCustomInputSetup__ = function() {
    Input.keyMapper[speed_multiplier_virtualkey] = speed_multiplier_keyname;
  };

  const __monitorCustomInput__ = function() {
    if (!SceneManager.isSceneChanging()) {
      if (Input.isTriggered(speed_multiplier_keyname)) {
        __onSpeedMultiplierChange__();
        return true;
      }
    }
    return false;
  };

  const __handleCheat__ = function() {
    __setMaxMoney__();
    __setFullHP__();
    __setFullItems__();
  };

  const __setMaxMoney__ = function() {
    // Set money 99999999999
    $gameParty._gold = 99999999999;
  };

  const __setFullHP__ = function() {
    // Max HP (id = 19)
    const maxHP = $gameVariables.value(19);
    // Current HP (id = 18) - set to 99999
    $gameVariables.setValue(18, maxHP + 1);
  };

  const __setFullItems__ = function() {
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

  const __cheatInjection__ = function() {
    // Use this to open debug mode, and F9 to open debug panel.
    //$gameTemp._isPlaytest = true;

    // Cheating
    __handleCheat__();
  };  // end of __cheatInjection__

  function __createDefaultTextStyle__() {
    return new PIXI.TextStyle(
        {fill: 'white', fontFamily: 'Times New Roman', fontSize: 16});
  };

  function __createSpeedMultiplierMessageBoilerplate__(speedMultiplier) {
    return `Speed Multiplier : ${speedMultiplier}x`;
  }

  function __buildSpeedChangeInfo__() {
    let text = new PIXI.Text('', __createDefaultTextStyle__());
    text._text = __createSpeedMultiplierMessageBoilerplate__(speed_multiplier);
    text.x = 5;
    text.alpha = 0;
    text.updateText();
    return text;
  };

  function __buildCheatScriptInfo__() {
    let text = new PIXI.Text('', __createDefaultTextStyle__());
    text._text = `Cheat is activated. Support Game Version: ${supported_game_version}`;
    text.x = 5;
    text.alpha = 1.0;
    text.updateText();
    return text;
  };

  function __updateSpeedChangeInfo__(speedMultiplier) {
    const text = __createSpeedMultiplierMessageBoilerplate__(speedMultiplier);
    __updateSpeedChangeInfoMessage__(text);
    __registerSpeedChangeInfoFadeEffect__();
  };

  function __updateSpeedChangeInfoMessage__(text) {
    SceneManager._scene.speedChangeInfo._text = text;
    SceneManager._scene.speedChangeInfo.alpha = 3.0;
    SceneManager._scene.speedChangeInfo.updateText();
  };

  function __registerSpeedChangeInfoFadeEffect__() {
    if(fadeEffectHandlerId != -1) {
      clearInterval(fadeEffectHandlerId);  
      fadeEffectHandlerId = -1;
    }

    fadeEffectHandlerId = setInterval(() => {
      if(SceneManager._scene.speedChangeInfo !== undefined) {
        if(SceneManager._scene.speedChangeInfo.alpha > 0) {
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
  };

  // Hook Scene_Title::create method
  const Hook__Scene_Title__create = Scene_Title.prototype.create;
  Scene_Title.prototype.create = function() {
    Hook__Scene_Title__create.call(this, arguments);
    this.cheatScriptInfo = __buildCheatScriptInfo__();
    this.addChild(this.cheatScriptInfo);
  };

  // Hook Window_Message::updateInput method
  const Hook__Window_Message__updateInput = Window_Message.prototype.updateInput;
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