{
  /*
  Copyright (C) 2021 Jim00000

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
// ▶ Target process : Zombie's Retreat 2 - Beta 0.1.2.exe
// ▶ Update         : 04.25.2021
// ▶ License        : GNU GENERAL PUBLIC LICENSE Version 3
// --------------------------------------------------------------------------------

(() => {
  let speed_multiplier = 1.0;
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
    updateSpeedChangeInfo(speed_multiplier);
  };

  const __monitorCustomInputSetup__ = function() {
    Input.keyMapper[speed_multiplier_virtualkey] = speed_multiplier_keyname;
  };

  const __monitorCustomInput__ = function() {
    if (!SceneManager.isSceneChanging()) {
      if (Input.isTriggered(speed_multiplier_keyname)) {
        __onSpeedMultiplierChange__();
      }
    }
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
    // Current HP (id = 18) - set to 99999
    $gameVariables.setValue(18, 99999);
    // Max HP (id = 19) - set to 6
    $gameVariables.setValue(19, 6);
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
    // Wine x99
    $gameParty._items[10] = 99;
    // Vodka x99
    $gameParty._items[11] = 99;
    // Med kit x99
    $gameParty._items[12] = 99;
    // Food (Fresh) x99
    $gameParty._items[13] = 99;
    // Golden Key x99
    $gameParty._items[14] = 99;
    // Ammunition(Revolver) x99
    $gameParty._items[20] = 99;
    // Ammunition x4 (Rev.) x99
    $gameParty._items[21] = 99;
  };

  const __cheatInjection__ = function() {
    // Use this to open debug mode, and F9 to open debug panel.
    //$gameTemp._isPlaytest = true;

    // Cheating
    __handleCheat__();
  };  // end of __cheatInjection__

  function createDefaultTextStyle() {
    return new PIXI.TextStyle(
        {fill: 'white', fontFamily: 'Times New Roman', fontSize: 16});
  };

  function createSpeedMultiplierMessageBoilerplate(speedMultiplier) {
    return `Speed Multiplier : ${speedMultiplier}x`;
  }

  function buildSpeedChangeInfo() {
    let text = new PIXI.Text('', createDefaultTextStyle());
    text._text = createSpeedMultiplierMessageBoilerplate(speed_multiplier);
    text.x = 5;
    text.updateText();
    return text;
  };

  function updateSpeedChangeInfo(speedMultiplier) {
    const text = createSpeedMultiplierMessageBoilerplate(speedMultiplier);
    updateSpeedChangeInfoMessage(text);
  };

  function updateSpeedChangeInfoMessage(text) {
    SceneManager._scene.speedChangeInfo._text = text;
    SceneManager._scene.speedChangeInfo.updateText();
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
    this.speedChangeInfo = buildSpeedChangeInfo();
    this.addChild(this.speedChangeInfo);
  };

  // Hook Scene_Map::updateScene method
  const Hook__Scene_Map__updateScene = Scene_Map.prototype.updateScene;
  Scene_Map.prototype.updateScene = function() {
    Hook__Scene_Map__updateScene.call(this, arguments);
    __monitorCustomInputSetup__();
    __monitorCustomInput__();
  };

  // Hook  SceneManager.updateMain method
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