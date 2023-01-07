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


function fullHP(event) {
    process.emit('OnFullHPTriggered', event.checked);
}

function fullItems(event) {
    process.emit('OnFullItemsTriggered', event.checked);
}

function freezeZombies(event) {
    process.emit('OnFreezeZombieTriggered', event.checked);
}

function disableDarkScene(event) {
    process.emit('OnDisableDarkSceneEffectTriggered', event.checked);
}

function killAllZombies() {
    process.emit('KillAllZombies');
}

function updateSpeedupMultiplier(multiplier) {
    document.getElementById('range_speedup_text').textContent =
        `Speedup Multiplier x${multiplier}`;
}

function commitSpeedupMultiplier(multiplier) {
    updateSpeedupMultiplier(multiplier);
    process.emit('ChangeGameSpeedMultiplier', multiplier);
}

process.addListener('SynchronizeCheatStatus', (cheatlist) => {
    document.getElementById('switch_fullhp').checked =
        cheatlist.is_full_hp_enabled;
    document.getElementById('switch_fullitems').checked =
        cheatlist.is_full_item_enabled;
    document.getElementById('switch_freeze_zombie').checked =
        cheatlist.is_zombie_freezed;
    document.getElementById('switch_disable_dark_scene').checked =
        cheatlist.is_dark_scene_disabled;
    document.getElementById('range_speedup').value = cheatlist.speed_multiplier;
    document.getElementById('badge_enemy_count').textContent =
        cheatlist.enemy_count;
    updateSpeedupMultiplier(cheatlist.speed_multiplier);
});

process.addListener('UpdateEnemyCountBadge', (enemy_count) => {
    document.getElementById('badge_enemy_count').textContent = enemy_count;
});

process.addListener('CloseCheatPane', () => {
    nw.Window.get().close();
});

process.addListener('ResetCheat', () => {
    document.getElementById('switch_fullhp').checked = false;
    document.getElementById('switch_fullitems').checked = false;
    document.getElementById('switch_freeze_zombie').checked = false;
    document.getElementById('switch_disable_dark_scene').checked = false;
    document.getElementById('range_speedup').value = 1.0;
    document.getElementById('badge_enemy_count').textContent = 0;
    updateSpeedupMultiplier(1.0);
});

process.emit('OnCheatPaneProcessReadyTriggered');

window.resizeTo(500, 470);