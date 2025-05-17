// @ts-check

import { abbreviateNumber } from "@cass-modules/ArielUtils";

export const meta = {
  name: "pet-fight",
  author: "Liane Cagara",
  version: "2.0.6",
  description: "Logic for pet fight.",
  supported: "^1.0.0",
  order: 1,
  type: "plugin",
  extra: [
    "PetPlayer",
    "GearsManage",
    "GearData",
    "WildPlayer",
    "Quest",
    "elementalMapping",
    "ElementalChild",
    "ElementalChilds",
    "elementalPets",
  ],
};
export const elementalMapping = {
  Fire: {
    strong: { Grass: 1.0, Ice: 0.85, Bug: 0.7, Steel: 0.6 },
    weak: { Water: 0.55, Rock: 0.5, Fire: 0.55 },
    classification: "PK",
  },
  Water: {
    strong: { Fire: 1.0, Ground: 0.9, Rock: 0.85 },
    weak: { Electric: 0.4, Grass: 0.5 },
    classification: "PK",
  },
  Grass: {
    strong: { Water: 1.0, Rock: 0.8, Ground: 0.75 },
    weak: { Fire: 0.55, Flying: 0.6, Bug: 0.5 },
    classification: "PK",
  },
  Electric: {
    strong: { Water: 0.9, Flying: 0.8 },
    weak: { Ground: 0.55, Electric: 0.6 },
    classification: "PSI",
  },
  Ice: {
    strong: { Grass: 1.0, Ground: 0.9, Flying: 0.8, Dragon: 0.85 },
    weak: { Fire: 0.55, Steel: 0.6, Ice: 0.6 },
    classification: "PSI",
  },
  Rock: {
    strong: { Fire: 0.85, Ice: 0.9, Flying: 0.75, Bug: 0.7 },
    weak: { Water: 0.6, Grass: 0.6, Fighting: 0.55, Steel: 0.6 },
    classification: "PK",
  },
  Ground: {
    strong: { Fire: 0.95, Electric: 1.0, Poison: 0.9, Rock: 0.85, Steel: 0.85 },
    weak: { Water: 0.55, Ice: 0.6, Grass: 0.55 },
    classification: "PK",
  },
  Fighting: {
    strong: { Normal: 0.95, Ice: 1.0, Rock: 0.85, Dark: 0.8, Steel: 0.75 },
    weak: { Flying: 0.5, Psychic: 0.55, Fairy: 0.6 },
    classification: "PK",
  },
  Flying: {
    strong: { Grass: 1.0, Fighting: 0.95, Bug: 0.8 },
    weak: { Electric: 0.55, Rock: 0.6, Steel: 0.6 },
    classification: "PK",
  },
  Psychic: {
    strong: { Fighting: 0.9, Poison: 0.85 },
    weak: { Bug: 0.6, Ghost: 0.65, Dark: 0.6 },
    classification: "PSI",
  },
  Bug: {
    strong: { Grass: 1.0, Psychic: 0.8, Dark: 0.75 },
    weak: { Fire: 0.55, Flying: 0.6, Rock: 0.65 },
    classification: "PK",
  },
  Poison: {
    strong: { Grass: 0.9, Fairy: 0.85 },
    weak: { Ground: 0.55, Psychic: 0.65 },
    classification: "PSI",
  },
  Fairy: {
    strong: { Fighting: 0.95, Dragon: 1.0, Dark: 0.85 },
    weak: { Poison: 0.6, Steel: 0.6 },
    classification: "PSI",
  },
  Dark: {
    strong: { Psychic: 0.95, Ghost: 0.9 },
    weak: { Fighting: 0.6, Bug: 0.6, Fairy: 0.65 },
    classification: "PSI",
  },
  Ghost: {
    strong: { Psychic: 0.95, Ghost: 0.9 },
    weak: { Ghost: 0.6, Dark: 0.65 },
    classification: "PSI",
  },
  Steel: {
    strong: { Ice: 0.95, Rock: 0.9, Fairy: 0.85 },
    weak: { Fire: 0.55, Fighting: 0.6, Ground: 0.6 },
    classification: "PK",
  },
};

export const elementalPets = {
  dog: ["Fighting"],
  cat: ["Grass", "Electric"],
  phoenix: ["Fire", "Electric", "Flying"],
  deer: ["Grass", "Ground"],
  tiger: ["Rock", "Fighting"],
  dragon: ["Fire", "Electric", "Ice", "Psychic", "Steel"],
  snake: ["Poison", "Ghost"],
  unicorn: ["Grass", "Fairy", "Psychic"],
  yeti: ["Ice", "Rock"],
  leviathan: ["Water"],
  cerberus: ["Fire", "Dark", "Steel"],
  sphinx: ["Fairy", "Ghost", "Psychic"],
  griffin: ["Flying", "Rock", "Steel"],
  pegasus: ["Flying", "Fairy"],
  kraken: ["Water", "Ground"],
  panda: ["Grass", "Fighting"],
};
export class ElementalChilds {
  constructor(...elements) {
    this.elements = elements.map((i) => new ElementalChild(i));
  }
  getModifierAgainst(childs) {
    if (childs instanceof ElementalChilds) {
      const accu = this.elements.reduce((acc, i) => {
        return (
          acc +
          childs.elements.reduce((acc, j) => acc + i.getModifierAgainst(j), 0) /
            childs.elements.length
        );
      }, 0);
      return accu / this.elements.length;
    }
    return null;
  }
  getAllStrongs() {
    return this.elements.reduce(
      (acc, i) => [...acc, ...Object.keys(i.strong)],
      []
    );
  }
  getAllWeaks() {
    return this.elements.reduce(
      (acc, i) => [...acc, ...Object.keys(i.weak)],
      []
    );
  }
  isStrongerThan(childs) {
    const accA = this.getModifierAgainst(childs);
    const accB = childs.getModifierAgainst(this);
    return accA > accB;
  }
  getGapPets() {
    let result = [];
    for (const key in elementalPets) {
      const value = elementalPets[key];
      const childs = new ElementalChilds(...value);
      const acc = Math.abs(
        childs.getModifierAgainst(this) - this.getModifierAgainst(childs)
      );
      if (acc === 0) {
        continue;
      }
      if (this.isStrongerThan(childs)) {
        result.push({
          type: key,
          status: "weaker",
          acc,
          childs,
        });
      } else {
        result.push({
          type: key,
          status: "stronger",
          acc,
          childs,
        });
      }
    }
    return result;
  }
}

export class ElementalChild {
  constructor(element, mapping = elementalMapping) {
    if (element instanceof ElementalChild) {
      element = element.element;
    }
    this.element = JSON.parse(
      JSON.stringify({
        ...(mapping[element] ?? { strong: {}, weak: {}, classification: "PK" }),
      })
    );
    this.element.name = element;
  }

  get strong() {
    return { ...this.element.strong };
  }

  get weak() {
    return { ...this.element.weak };
  }

  get class() {
    return this.element.classification;
  }

  get name() {
    return this.element.name;
  }

  isStrongerThan(element) {
    if (element instanceof ElementalChild) {
      const strength = this.strong[element.name] || 0;
      const weakness = element.weak[this.name] || 0;
      return strength > weakness;
    }
    return null;
  }

  isWeakerThan(element) {
    if (element instanceof ElementalChild) {
      const strength = element.strong[this.name] || 0;
      const weakness = this.weak[element.name] || 0;
      return strength > weakness;
    }
    return null;
  }
  getModifierAgainst(element) {
    if (element instanceof ElementalChild) {
      const oppStrength = element.strong[this.name] ?? 0;
      const oppWeak = element.weak[this.name] ?? 0;
      const myStrength = this.strong[element.name] ?? 0;
      const myWeak = this.weak[element.name] ?? 0;
      return (myStrength + oppWeak - oppStrength - myWeak) / 2;
    }
    return null;
  }

  static getStronger(a, b) {
    if (a instanceof ElementalChild && b instanceof ElementalChild) {
      if (a.isStrongerThan(b) && b.isStrongerThan(a)) {
        return null;
      }
      if (b.isStrongerThan(a)) {
        return b;
      }
      if (a.isStrongerThan(b)) {
        return a;
      }
    }
  }
}
export const petSpellMap = {
  dog: ["ferocious_bark", "loyal_guard"],
  cat: ["shadow_pounce", "nimble_dodge"],
  phoenix: ["rebirth", "flame_of_rejuvenation"],
  deer: ["ice_shock", "heal_prayer"],
  dragon: ["dragons_breath", "flame_of_rejuvenation"],
  tiger: ["shadow_pounce", "nimble_dodge"],
  snake: ["poison_bite", "heal_prayer"],
};
export const spells = {
  ferocious_bark: {
    name: "PK Ferocious Bark",
    tp: 28, // Reduced TP cost
    flavorText:
      "A bark that intimidates your opponent, reducing their attack power temporarily for 3 turns.",
    type: "opp_change",
    value(player, opponent) {
      const magic = player.MAGIC;
      const oppAtk = opponent.ATK;
      return Math.floor(oppAtk - (magic + 5) * 0.15); // Adjusted effect from 0.2 to 0.15
    },
    target: "atk",
    effectLast: 3,
  },
  loyal_guard: {
    name: "PSI Loyal Guard",
    tp: 48, // Increased TP cost
    flavorText:
      "Grants a protective buff to allies, increasing their defense against enemy attacks for 3 turns.",
    type: "ally_change_noself",
    value(caster, _opponent, target) {
      const magic = caster.MAGIC;
      const def = target.DEF;
      return Math.floor(def + (magic + 5) * 0.25); // Adjusted effect from 0.2 to 0.25
    },
    target: "def",
    effectLast: 3,
  },
  shadow_pounce: {
    name: "PK Shadow Pounce",
    tp: 45, // Slightly reduced TP cost
    flavorText:
      "Allows the pet to swiftly attack from the shadows, dealing surprise damage.",
    type: "opp_attack",
    value(caster, _opponent) {
      const atk = caster.ATK;
      const magic = caster.MAGIC;
      return Math.floor(atk + atk * ((magic + 1) * 0.15)); // Adjusted effect from 0.2 to 0.15
    },
    effectLast: 1,
  },
  nimble_dodge: {
    name: "PK Nimble Dodge",
    tp: 22, // Reduced TP cost
    flavorText:
      "Enables the pet to evade attacks more effectively for a short duration of 2 turns.",
    type: "ally_change_self",
    value(caster, _opponent) {
      const magic = caster.MAGIC;
      const def = caster.DEF;
      return Math.floor(def + (magic + 5) * 0.25); // Adjusted effect from 0.3 to 0.25
    },
    target: "def",
    effectLast: 2,
  },
  heal_prayer: {
    name: "PSI Heal Prayer",
    tp: 30, // Slightly reduced TP cost
    flavorText: "Restores HP of an ally pet.",
    type: "ally_heal",
    value(caster, _opponent) {
      const magic = caster.MAGIC;
      return Math.floor(30 * (1 + (magic + 3) * 0.15)); // Adjusted effect from 24 to 30
    },
    effectLast: 1,
  },
  antler_strike: {
    name: "PK Antler Strike",
    tp: 38, // Slightly reduced TP cost
    flavorText:
      "Charges forward with antlers, weakening enemies in its path for 2 turns.",
    type: "opp_change",
    value(player, opponent) {
      const magic = player.MAGIC;
      const oppAtk = opponent.ATK;
      return Math.floor(oppAtk - (magic + 8) * 0.2); // Adjusted effect from 0.25 to 0.2
    },
    target: "atk",
    effectLast: 2,
  },
  dragons_breath: {
    name: "PK Dragon's Breath",
    tp: 55, // Slightly increased TP cost
    flavorText: "Unleashes a blast of elemental breath, damaging all enemies.",
    type: "opp_attack",
    value(player, _opponent) {
      const magic = player.MAGIC;
      const atk = player.ATK;
      return Math.floor(atk + atk * ((magic + 2) * 0.12)); // Adjusted effect from 0.1 to 0.12
    },
  },
  rebirth: {
    name: "PSI Rebirth",
    tp: 95, // Slightly reduced TP cost
    flavorText: "Sacrifices itself to heal an ally and resurrect all.",
    type: "ally_heal_all",
    value(caster, _opponent, target) {
      const magic = caster.MAGIC;
      target.HP = target.maxHP;
      caster.HP = 0;
      if (target.isDown()) {
        return target.maxHP;
      }
      return Math.floor(target.maxHP * 0.6 + magic); // Adjusted effect for more impactful healing and resurrection
    },
    effectLast: 1,
  },
  flame_of_rejuvenation: {
    name: "PSI Flame of Rejuvenation",
    tp: 22, // Reduced TP cost
    flavorText:
      "Surrounds allies in healing flames, restoring health over time.",
    type: "ally_heal",
    value(caster, _opponent, _target) {
      const magic = caster.MAGIC;
      return Math.floor(8 * (1 + magic * 0.2)); // Adjusted effect from 7 to 8
    },
    effectLast: 5,
  },
};

/**
 * @template T
 * @param {T[]} array
 * @returns {T}
 */
export function randArr(array) {
  array = Array.from(array);
  return array[Math.floor(Math.random() * array.length)];
}
/**
 * @template {number | string | symbol} K
 * @template V
 * @param {Record<K, V>} obj
 * @returns {[string, V]}
 */
export function randObj(obj) {
  return randArr(Object.entries(obj));
}
export class PetGame {
  /**
   *
   * @param {PetPlayer[]} petPlayers
   * @param {WildPlayer[]} petOpponents
   */
  constructor(petPlayers, petOpponents) {
    this.pets = petPlayers;
    this.opponents = petOpponents;
  }
  static useSpell(spellKey, _caster, _target) {
    const spell = spells[spellKey];
    let [destination, action, ..._modifiers] = spell.type.split("_");
    switch (destination) {
      case "ally":
        {
          switch (action) {
            case "heal":
              {
              }
              break;
            case "change": {
            }
          }
        }
        break;
      case "opp": {
        switch (action) {
          case "attack":
            {
            }
            break;
          case "change":
            {
            }
            break;
        }
      }
    }
  }
}

/**
 * @typedef {import("@cass-modules/Encounter").WildEntity} WildEntity
 */

/**
 * @implements {WildEntity}
 */
export class WildPlayer {
  /**
   *
   * @param {WildEntity} wildData
   * @param {PetPlayer[]} battlePets
   */
  constructor(wildData, battlePets = []) {
    wildData = JSON.parse(JSON.stringify(wildData));
    this.battlePets = battlePets;
    wildData.flavor ??= {};
    wildData.dialogues ??= {};
    this.wildName = wildData.wildName;
    this.wildIcon = wildData.wildIcon;
    this.wildType = wildData.wildType;
    this.HP = wildData.HP;
    this.ATK = wildData.ATK;
    this.DF = wildData.DF;
    this.flavor = wildData.flavor;
    this.dialogues = wildData.dialogues;
    this.attacks = wildData.attacks;
    this.goldFled = wildData.goldFled;
    this.goldSpared = wildData.goldSpared;
    this.expEarn = wildData.expEarn;
    this.fakeHP = wildData.fakeHP;
    this.acts = wildData.acts;
    this.fakeDEF = wildData.fakeDEF;
    this.winDias = wildData.winDias;
    this.fakeATK = wildData.fakeATK;
    this.level = wildData.level;
    this.flavor = wildData.flavor;
    this.dialogues = wildData.dialogues;
    this.DF = wildData.DF ?? 0;
    this.ATK = wildData.ATK ?? 0;
    this.HP = wildData.HP ?? 1;
    this.maxHP = wildData.HP ?? 1;
    this.goldFled = wildData.goldFled ?? 0;
    this.goldSpared = wildData.goldSpared ?? 0;
    /**
     * @type {WildEntity["attacks"]}
     */
    this.attacks = wildData.attacks ?? {};
    this.expEarn = wildData.expEarn ?? 30;
    /**
     * @type {WildEntity["acts"]}
     */
    this.acts = wildData.acts ?? {};
    this.#mercy = 0;
  }
  isSparable() {
    return this.MERCY >= 100 || this.isAlmostFled();
  }
  spareText() {
    return `Your party **WON**!\nEarned 0 **EXP** and **${this.goldSpared}** **Gold**`;
  }
  fledText() {
    return `Your party **WON**!\nEarned **${this.expEarn}** **EXP** and **${this.goldFled}** **Gold**`;
  }

  get MERCY() {
    return this.isAlmostFled() ? 100 : this.parseMercy(this.#mercy);
  }
  set MERCY(value) {
    this.#mercy = value * 25;
  }
  parseMercy(value) {
    return Math.max(Math.min(Math.round(value / 25), 100), 0);
  }
  addMercyInternal(value) {
    this.#mercy += value;
  }
  setMercyInternal(value) {
    this.#mercy = value;
  }
  getMercyInternal() {
    return this.#mercy;
  }
  #mercy;

  getPlayerUI({
    turn = false,
    pop = null,
    icon = null,
    upperPop = null,
    selectionOptions = undefined,
    damageTemp = 0,
  } = {}) {
    let fled = this.isAlmostFled();
    let txt = `${icon ?? this.wildIcon} **${this.wildName} LV${
      this.level ?? 1
    }** ${!upperPop ? `` : `(***${upperPop}***)`}\n`;
    const newHP = this.HP - damageTemp;
    txt += `**HP**: ${fled ? "**" : ""}${newHP}/${this.maxHP}${
      fled ? "** ⚠️" : ""
    } ${
      pop ? `(${pop})` : `(${Math.floor((newHP / this.maxHP) * 100)}%)`
    }\n**MERCY**: ${this.MERCY}%`;
    if (turn) {
      txt += `\n\n${this.getSelectionUI(selectionOptions)}`;
    }
    return txt;
  }
  getSelectionUI(_selectionOptions) {}
  isDown() {
    return this.HP <= 0;
  }
  getNeutralFlavor() {
    if (this.isLowHP() && this.flavor.lowHP) {
      return randArr(this.flavor.lowHP ?? ["..."]);
    }
    return randArr(this.flavor.neutral ?? ["..."]);
  }
  getNeutralDialogue() {
    if (this.isLowHP() && this.dialogues.lowHP) {
      return randArr(this.dialogues.lowHP ?? ["..."]);
    }
    return randArr(this.dialogues.neutral ?? ["..."]);
  }
  /**
   *
   * @param {string} pet
   * @returns
   */
  getActTarget(pet) {
    let targetPet = this.battlePets.find((i) => i?.petType === pet);
    if (pet === "[slot:1]") {
      targetPet = this.battlePets[1];
    }
    if (pet === "[slot:2]") {
      targetPet = this.battlePets[2];
    }
    if (pet === "[leader]") {
      targetPet = this.battlePets[0];
    }
    return targetPet;
  }
  isActAvailable(act) {
    const data = this.acts[act];
    if (!data) {
      return false;
    }
    for (const pet of data.pet ?? []) {
      const targetPet = this.getActTarget(pet);
      if (!targetPet) {
        return false;
      }
      if (targetPet.isDown()) {
        return false;
      }
    }
    return true;
  }
  getPercentHP() {
    return (this.HP / this.maxHP) * 100;
  }
  getActList() {
    let result = "";
    for (const act in this.acts ?? { Check: {} }) {
      const data = this.acts[act];
      const selector = data.pet ?? [];
      let faces = "* ";
      for (const pet of selector) {
        let targetPet = this.getActTarget(pet);
        if (targetPet) {
          faces += targetPet.petIcon;
        }
      }
      if (this.isActAvailable(act)) {
        result += `${faces.trim()} **${act}**\n`;
      } else {
        result += `* 🚫 **${act}** (Unavailable)\n`;
      }
    }
    return result.trim();
  }
  getAttackMenu() {
    let result = "";
    const [answer = "...", attackName = "Triple dots attack."] = randObj(
      this.attacks ?? {}
    );
    result += `* ${this.wildIcon} **${this.wildName}** is charging **${attackName}**!\n\n`;
    for (const attackAnswer in this.attacks) {
      result += `* ${attackAnswer}\n`;
    }
    return {
      text: result,
      answer,
      attackName,
    };
  }
  /**
   *
   * @param {string} act
   * @returns
   */
  getAct(act) {
    act = String(act);
    let targetAct = this.acts[act] ?? this.acts[act.toLowerCase()];
    if (!targetAct) {
      return null;
    }
    if (!this.isActAvailable(act)) {
      return null;
    }
    let {
      pet: selector,
      flavor = `You performed ${act}!`,
      response: responseArr = [this.getNeutralDialogue()],
      petLine: petLineArr = [`Hi I performed ${act}!`],
      mercyPts = 1,
    } = targetAct;
    mercyPts = Math.min(1, mercyPts);
    let petLine = randArr(petLineArr);
    let response = randArr(responseArr);
    const targetPet = this.getActTarget(selector) ?? this.battlePets[0];
    flavor = helper(flavor);
    response = helper(response);
    petLine = helper(petLine);
    function helper(text) {
      return text.replaceAll(
        "{name}",
        `${targetPet.petIcon} **${targetPet.petName}**`
      );
    }
    return {
      flavor,
      selector,
      response,
      petLine,
      mercyPts,
      targetPet,
    };
  }
  isLowHP() {
    return this.HP <= this.maxHP * 0.2;
  }
  isAlmostFled() {
    let result = false;
    for (const pet of this.battlePets) {
      const damage = pet.calculateAttack(this.DF);
      if (damage > this.HP) {
        result = true;
        break;
      }
    }
    return result;
  }
}

export class PetPlayer {
  #damageTaken = 0;
  getDamageTaken() {
    return this.#damageTaken;
  }
  constructor(petData = {}, gearData = {}) {
    petData = JSON.parse(JSON.stringify(petData));
    gearData = JSON.parse(JSON.stringify(gearData));
    this.exp = petData.lastExp ?? 0;
    const { weapon = [], armors = [], items = [] } = gearData;
    /**
     * @type {import("@cass-modules/cassidyUser").WeaponInventoryItem[]}
     */
    this.weapon = PetPlayer.sanitizeWeapon(weapon);
    /**
     * @type {import("@cass-modules/cassidyUser").ArmorInventoryItem[]}
     */
    this.armors = PetPlayer.sanitizeArmors(armors);
    this.items = items;
    this.OgpetData = petData;
    this.OggearData = gearData;
    this.petName = petData.name ?? "Catchara";
    this.petType = petData.petType ?? "unknown";
    this.petIcon = petData.icon ?? "🐈";
    this.sellPrice = petData.sellPrice;
    this.maxHPModifier = 0;
    this.extras = {};
    this.mode = "default";
    this.hpModifier = -this.getHungryModifier();
  }
  isDuel() {
    return this.mode === "duel";
  }
  getElementals() {
    const mapping = elementalPets[this.petType];
    const childs = new ElementalChilds(...mapping);
    return childs;
  }

  getPlayerUI({
    turn = false,
    pop = null,
    icon = null,
    upperPop = null,
    showStats = false,
    selectionOptions = undefined,
    hideHP = false,
  } = {}) {
    let txt = `${icon ?? this.petIcon} **${this.petName} LV${this.level}** ${
      !upperPop ? (this.isDown() ? `(***DOWN***)` : ``) : `(***${upperPop}***)`
    }\n`;
    txt += `**HP**: ${hideHP ? "??" : this.HP}/${hideHP ? "??" : this.maxHP} ${
      pop
        ? `(${pop})`
        : `(${hideHP ? "??" : Math.floor((this.HP / this.maxHP) * 100)}%)`
    }`;
    if (showStats) {
      const stat = this.calculateDamageReduction();
      txt += `\n ⚔️ **${abbreviateNumber(this.ATK)}** | 🔰 **${abbreviateNumber(
        this.DF
      )}** (${abbreviateNumber(stat.defReduction)}/${abbreviateNumber(
        stat.per
      )}) | 🔥 **${abbreviateNumber(this.MAGIC)}**`;
    }
    if (turn) {
      txt += `\n\n${this.getSelectionUI(selectionOptions)}`;
    }

    return txt;
  }
  get realTimePlayerUI() {
    return this.getPlayerUI({ turn: true });
  }
  getHungryModifier() {
    const { lastFeed = Date.now(), lastSaturation = 0 } = this.OgpetData;
    const currentTime = Date.now();

    const timeSinceLastFeed = currentTime - lastFeed;
    const remainingSaturation = lastSaturation - timeSinceLastFeed;

    if (remainingSaturation > 0) {
      return 0;
    }

    const hungerTime = -remainingSaturation;
    const hungerModifier = Math.pow(hungerTime / (60 * 60 * 1000), 1.2);

    return Math.floor(hungerModifier);
  }
  getSelectionUI(options) {
    options = Object.assign(
      {},
      {
        fight: true,
        magic: true,
        item: true,
        mercy: true,
        defend: true,
      },
      options ?? {}
    );
    let result = ``;
    if (options.fight) {
      result += `⚔️ **Fight**\n`;
    }
    if (options.magic) {
      result += `🔥 **Magic**\n`;
    }
    if (options.item) {
      result += `🎒 **Item**\n`;
    }
    if (options.mercy) {
      result += `❌ **Mercy**\n`;
    }
    if (options.defend) {
      result += `🛡️ **Defend**\n`;
    }
    const { extra } = options;
    if (extra) {
      for (const [key, value] of Object.entries(extra)) {
        result += `${value} **${key}**\n`;
      }
    }
    return result.trim();
  }
  debug() {
    return (
      global.utils.representObject(this) +
      `\n30 => ${this.calculateTakenDamage(30)}\n\n${this.getPlayerUI({
        turn: true,
      })}\n\nHP: ${this.HP}\nDF: ${this.DF}\nMax HP: ${
        this.maxHP
      }\nDown HP: ${this.getDownHP()}\nDown Heal: ${this.getDownHeal()}\nExtta Taken: ${PetPlayer.calculateExtraTakenDamage(
        this.HP
      )}\n\n${Array(20)
        .fill("")
        .map((_, index) => `LV${index + 1}: ${PetPlayer.getHPOf(index + 1)} HP`)
        .join("\n")}`
    );
  }
  static debugForEXP(exp) {
    return new PetPlayer({ lastExp: exp }).debug();
  }
  isDown() {
    return this.HP <= 0;
  }
  get realTimeTakenDamagePer30() {
    return this.calculateTakenDamage(30);
  }
  calculateTakenDamageOld(damage) {
    let result = damage;
    const df = this.DF * (1 / 5);
    result = Math.floor(result - df);
    result = Math.max(result, 1);
    return result;
  }
  static calculateExtraTakenDamage(maxHP) {
    const baseHP = 20;
    const scalingFactor = Math.sqrt(maxHP / baseHP);
    return scalingFactor;
  }

  calculateTakenDamage(damage) {
    let result = damage;
    // const df = this.DF * (1 / 5);
    //result = Math.floor(result - df);
    /*result = Math.floor(result - result / df);*/
    //result = Math.floor(damage - this.DF / 5);
    const DAMAGE_VARIABILITY = 0.1;

    result = Math.floor(
      damage -
        (((this.DF * 2) / 5) *
          (1 + (Math.random() * DAMAGE_VARIABILITY - DAMAGE_VARIABILITY / 2))) /
          1.2
    );
    const scalingFactor = PetPlayer.calculateExtraTakenDamage(this.HP);

    result = Math.floor(result * scalingFactor);
    result = Math.max(result, 1);

    return result;
  }

  getPercentHP() {
    return (this.HP / this.maxHP) * 100;
  }

  maxHPModifier = 0;

  get maxHP() {
    return PetPlayer.getHPOf(this.level, this.sellPrice) + this.maxHPModifier;
  }

  /**
   * @param {number} hp
   */
  set maxHP(hp) {
    const baseHP = PetPlayer.getHPOf(this.level, this.sellPrice);
    this.maxHPModifier = hp - baseHP;
  }
  get level() {
    return PetPlayer.getLevelOf(this.exp);
  }
  getDownHP() {
    return -Math.floor(this.maxHP / 2);
  }
  getDownHeal() {
    return Math.abs(Math.ceil(this.maxHP / 8));
  }
  get hp() {
    return this.HP;
  }
  hpModifier = 0;
  defModifier = 0;
  get HP() {
    return this.maxHP - this.#damageTaken + this.hpModifier;
  }
  set HP(newHP) {
    this.#damageTaken = this.maxHP - newHP + this.hpModifier;
  }
  get DF() {
    const extra = PetPlayer.getExtraDFOf(this.level);
    const armorDfs = this.armors.reduce((acc, weapon) => {
      return acc + (weapon.key === "temArmor" ? 65 : weapon.def);
    }, 0);
    const weaponDf = this.weapon[0].def;
    return armorDfs + weaponDf + extra + this.defModifier;
  }
  get extraDF() {
    return PetPlayer.getExtraDFOf(this.level);
  }
  get gearDF() {
    return this.DF - this.extraDF;
  }
  atkModifier = 0;
  get ATK() {
    const extra = PetPlayer.getExtraATKOf(this.level);
    const weaponAtks = this.weapon.reduce((acc, weapon) => acc + weapon.atk, 0);
    const armorAtks = this.armors.reduce((acc, armor) => acc + armor.atk, 0);
    return Math.round(
      armorAtks / 4 + weaponAtks / 2 + extra + this.atkModifier
    );
  }
  get extraATK() {
    return PetPlayer.getExtraATKOf(this.level);
  }
  get gearATK() {
    return this.ATK - this.extraATK;
  }

  calculateAttackOld(enemyDef) {
    const atk = this.ATK;
    const df = enemyDef;
    return Math.max(
      1,
      Math.floor(
        (atk - df / 5 + Math.floor(Math.random() * 8)) * (1 - df / 100) * 2.2
      )
    );
  }

  /**
   *
   * @param {number} enemyDef
   * @param {number} atk
   * @returns
   */
  calculateAttack(enemyDef, atk = this.ATK) {
    atk ??= this.ATK;
    const df = enemyDef;
    return Math.max(
      1,
      this.calculateReducedDamage(
        Math.floor((atk + Math.floor(Math.random() * 15)) * 2.2),
        df
      )
    );
  }
  /**
   *
   * @param {number} enemyDef
   * @param {number} atk
   * @returns
   */
  calculateAttackLinear(enemyDef, atk = this.ATK) {
    atk ??= this.ATK;
    const df = enemyDef;
    return Math.max(
      1,
      this.calculateReducedDamageLinear(
        Math.floor((atk + Math.floor(Math.random() * 15)) * 2.2),
        df
      )
    );
  }

  /**
   * Calculate reduced damage with diminishing returns on defense,
   * where the soft cap scales with the incoming damage.
   *
   * @param {number} damage - The incoming base damage
   * @param {number} [def=this.DF] - The defense value, defaults to pet's DF
   * @returns {number} - The reduced damage
   */
  calculateReducedDamage(damage, def = this.DF, factor_ = 0) {
    const k = 5;
    const factor = factor_ || 0.3;

    const C = damage / factor;

    const defReduction = def / (1 + def / C) / k;

    let reducedDamage = damage - defReduction;

    return Math.max(Math.floor(reducedDamage), 1);
  }

  calculateDamageReduction(def = this.DF) {
    const k = 5;
    const factor = 0.3;

    const C = (factor * 30) / 3;

    const defReduction = def / (1 + def / C) / k;

    return {
      defReduction: Math.floor(defReduction),
      per: Math.round(C),
    };
  }

  /**
   * @param {number} damage - The incoming base damage
   * @param {number} [def=this.DF] - The defense value, defaults to pet's DF
   * @returns {number} - The reduced damage
   */
  calculateReducedDamageLinear(damage, def = this.DF) {
    const def5 = def / 5;
    let reducedDamage = damage - def5;
    return Math.max(Math.floor(reducedDamage), 1);
  }

  getCounterableEnemyDef(atk = this.ATK) {
    const base = Math.floor(atk * 2.2);
    return Math.floor(5 * (base - 1));
  }

  getFairEnemyDef(atk) {
    atk ??= this.ATK;
    const base = Math.floor(atk * 2.2);
    return Math.floor(3.75 * base);
  }

  magicModifier = 0;
  get MAGIC() {
    const gearMagic =
      this.weapon[0].magic +
      this.armors.reduce((acc, weapon) => {
        return acc + weapon.magic;
      }, 0);

    const cappedGearMagic = Math.min(gearMagic, 50 + this.level * 5);

    const extra = PetPlayer.getExtraMagicOf(cappedGearMagic / 100, this.exp);

    const rawMagic = cappedGearMagic + extra + this.magicModifier;

    const statCap = Math.max(this.maxHP * 2, this.ATK * 3, this.level * 10);

    return Math.round(Math.min(rawMagic, statCap));
  }
  clone() {
    return new PetPlayer(this.OgpetData, this.OggearData);
  }

  /**
   *
   * @param {import("@cass-modules/cassidyUser").WeaponInventoryItem[]} weapon
   * @returns {import("@cass-modules/cassidyUser").WeaponInventoryItem[]}
   */
  static sanitizeWeapon(weapon) {
    let { atk = 0, def = 0, magic = 0 } = weapon[0] ?? {};
    weapon[0] ??= {
      atk: 0,
      flavorText: "",
      icon: "",
      key: "",
      name: "",
      type: "weapon",
    };
    atk = Math.floor(atk);
    def = Math.floor(def);
    magic = Math.floor(magic);
    if (isNaN(atk)) {
      atk = 0;
    }
    if (isNaN(def)) {
      def = 0;
    }
    if (isNaN(magic)) {
      magic = 0;
    }
    return [{ ...weapon[0], atk, def, magic }];
  }
  /**
   *
   * @param {import("@cass-modules/cassidyUser").ArmorInventoryItem[]} armors
   * @returns {import("@cass-modules/cassidyUser").ArmorInventoryItem[]}
   */
  static sanitizeArmors(armors) {
    let result = armors.map((armor) => {
      let { def = 0, magic = 0, atk = 0 } = armor ?? {};
      def = Math.floor(def);
      if (isNaN(def)) {
        def = 0;
      }
      atk = Math.floor(atk);
      if (isNaN(atk)) {
        atk = 0;
      }
      magic = Math.floor(magic);
      if (isNaN(magic)) {
        magic = 0;
      }
      return { ...armor, atk, def, magic };
    });
    return result;
  }

  static getExtraMagicOf(magic, lastExp) {
    const expFactor = Math.min(lastExp / 300, 5);
    return Math.floor((magic + 1) * (1 + expFactor)) + (-magic + 1);
  }
  static getLevelOf(lastExp) {
    return lastExp < 10 ? 1 : Math.floor(Math.log2(lastExp / 10)) + 1;
  }
  static getExpOf(level) {
    if (level === 1) {
      return 0;
    } else {
      return 10 * Math.pow(2, level - 1);
    }
  }
  changeLevel(level) {
    const newExp = PetPlayer.getExpOf(level);
    this.exp = newExp;
    return this;
  }
  static getLevelLimit([...levelA] = [1], [...levelB] = [1]) {
    const sumA = levelA.reduce((acc, level) => acc + level, 0);
    const sumB = levelB.reduce((acc, level) => acc + level, 0);
    const target = sumA <= sumB ? levelA : levelB;

    return Math.max(...target);
  }

  static getWeaker(levelA, levelB) {
    const sumA = levelA.reduce((acc, level) => acc + level, 0);
    const sumB = levelB.reduce((acc, level) => acc + level, 0);

    return sumA < sumB ? levelA : levelB;
  }

  static capLevels([...levelA] = [1], [...levelB] = [1]) {
    const levelLimit = this.getLevelLimit(levelA, levelB);
    const sumA = levelA.reduce((acc, level) => acc + level, 0);
    const sumB = levelB.reduce((acc, level) => acc + level, 0);

    if (sumA > sumB) {
      levelA = levelA.map((level) => Math.min(level, levelLimit));
    } else {
      levelB = levelB.map((level) => Math.min(level, levelLimit));
    }

    return { levelA, levelB };
  }

  static getHPOfOld(level, sellPrice) {
    const extra = Math.round((sellPrice ?? 0) / 500) * 10;
    return Math.floor(20 + 4 * (level - 1)) + extra;
  }
  static getHPOf(level, sellPrice) {
    const extra = Math.round((sellPrice ?? 0) / 700) * 10;
    return Math.floor(20 + 4 * (level - 1)) + extra;
  }
  static getExtraDFOf(level) {
    return Math.floor((level - 1) / 2);
  }
  static getExtraATKOf(level) {
    return 5 * level - 5;
  }
  static get spells() {
    return spells;
  }
  static get petSpellMap() {
    return petSpellMap;
  }
}

export class GearData {
  constructor(gearData = {}) {
    gearData = JSON.parse(JSON.stringify(gearData));
    this.key = gearData.key;
    this.weaponArray = gearData.weapon ?? [];
    this.armorsArray = gearData.armors ?? [];
    this.items = gearData.items ?? [];
  }

  equipArmor(index, armor) {
    if (index !== 0 && index !== 1) {
      throw new Error("Invalid armor index");
    }
    const backup = this.armorsArray[index];
    this.armorsArray[index] = armor;
    if (!armor) {
      this.armorsArray = this.armorsArray.filter((_, i) => i !== index);
    }
    return backup;
  }

  equipWeapon(weapon) {
    if (this.weaponArray.length > 1) {
      throw new Error("No weapon slot available");
    }
    const backup = this.weaponArray[0];
    this.weaponArray[0] = weapon;
    if (!weapon) {
      this.weaponArray = this.weaponArray.filter((_, index) => index !== 0);
    }
    return backup;
  }

  get weapon() {
    return PetPlayer.sanitizeWeapon(
      (this.weaponArray ?? []).filter(Boolean)
    ).filter(Boolean);
  }

  get armors() {
    return PetPlayer.sanitizeArmors(
      (this.armorsArray ?? []).filter(Boolean)
    ).filter(Boolean);
  }

  getWeaponUI() {
    if (
      !this.weaponArray[0] ||
      Object.keys(this.weaponArray[0] ?? {}).length < 1
    ) {
      return `[ No Weapon Equipped ]\nATK 0 DEF 0 MAGIC 0`;
    }
    return this.weapon
      .map(
        (weapon) =>
          `${weapon.icon} **${weapon.name}**\nATK ${weapon.atk} DEF ${weapon.def} MAGIC ${weapon.magic}`
      )
      .join("\n\n");
  }
  hasGear() {
    const armor = this.armorsArray.filter((i) => i?.name);
    const weapon = this.weaponArray.filter((i) => i?.name);
    return armor.length + weapon.length !== 0;
  }

  getArmorUI(index) {
    const armor = this.armors[index];
    if (!armor || !armor.name) {
      return `[ No Armor Equipped ]\nATK 0 DEF 0 MAGIC 0`;
    }
    return `${armor.icon} **${armor.name}**\nATK ${armor.atk} DEF ${armor.def} MAGIC ${armor.magic}`;
  }

  toJSON() {
    return {
      key: this.key,
      weapon: this.weaponArray,
      armors: this.armorsArray,
      items: this.items,
    };
  }

  *[Symbol.iterator]() {
    yield* Object.entries(this.toJSON());
  }
  clone() {
    return new GearData(this.toJSON());
  }
}

export class GearsManage {
  constructor(gearsData = []) {
    this.gearsData = JSON.parse(JSON.stringify(gearsData)).map(
      (gearData) => new GearData(gearData)
    );
  }

  getGearData(key) {
    return this.gearsData.find((i) => i.key === key) ?? new GearData({ key });
  }

  setGearData(key, gearData) {
    const index = this.gearsData.findIndex((i) => i.key === key);
    if (index !== -1) {
      this.gearsData[index] = gearData;
    } else {
      this.gearsData.push(gearData);
    }
    return gearData;
  }

  toJSON() {
    return this.gearsData.map((gearData) => gearData.toJSON());
  }

  raw() {
    return this.toJSON();
  }
  toCleanArray() {
    return [...this.toJSON()];
  }

  *[Symbol.iterator]() {
    yield* this.toJSON();
  }
  static fromJSONString(jsonString) {
    return new GearsManage(JSON.parse(jsonString));
  }
  clone() {
    return new GearsManage(this.toJSON());
  }
}

export class Quest {
  constructor(questData) {
    this.data = JSON.parse(JSON.stringify(questData || []));
    this.sanitize();
  }
  sanitize() {
    this.data = this.data
      .map((quest) => {
        let { meta, progress = 0 } = quest ?? {};
        if (!meta) {
          return;
        }
        if (!meta.key) {
          return;
        }
        let {
          icon = "❓",
          flavorText = "A quest we don't know about",
          name = "Unknown Quest",
          rewardCoins = 0,
          rewardItems = [],
          rewardCollectibles = {},
          key,
          max = 1,
        } = meta;
        return {
          ...quest,
          meta: {
            ...meta,
            icon,
            key,

            flavorText,
            name,
            rewardCollectibles,
            rewardCoins,
            max,
            rewardItems,
          },
          progress,
        };
      })
      .filter(Boolean);
  }
  *[Symbol.iterator]() {
    yield* this.data;
  }
  get(key) {
    return this.data.filter((i) => i?.key === key);
  }
  register(meta, initial) {
    this.data.push({
      meta,
      progress: initial ?? 0,
    });
    this.sanitize();
  }
  sortCompleted(_key) {
    return this.data.map((i) => {
      i.completed = i.progress >= i.meta.max;
      return i;
    });
  }
  deleteAllCompleted() {
    const data = this.sortCompleted();
    this.data = data
      .filter((i) => !i.completed)
      .map((i) => {
        delete i.completed;
        return i;
      });
  }
  deleteRef(data) {
    const index = this.data.findIndex((i) => i === data);
    if (index !== -1) {
      this.data = this.data.filter((_, ind) => ind !== index);
    }
  }

  getOne(key) {
    return this.get(key)[0];
  }
  getProgress(key) {
    return this.get(key).map((i) => i.progress);
  }
  getOneProgress(key) {
    return this.getProgress(key)[0];
  }
  setAllProgress(key, progress) {
    if (isNaN(progress)) {
      return;
    }
    const quests = this.get(key);
    for (const quest of quests) {
      quest.progress = Math.min(progress, quest.max);
    }
    return this.get(key);
  }
  progress(key, progress = 1) {
    if (isNaN(progress)) {
      return;
    }
    const quests = this.get(key);
    for (const quest of quests) {
      const a = quests.progress;
      quest.progress = Math.min(a + progress, quest.max);
    }
  }
  has(key) {
    return this.get(key).length > 0;
  }
  toJSON() {
    return Array.from(this);
  }
  raw() {
    return Array.from(this);
  }
  clone() {
    return new Quest(Array.from(this));
  }
}

export async function use(obj) {
  obj.PetPlayer = PetPlayer;
  obj.GearsManage = GearsManage;
  obj.GearData = GearData;
  obj.WildPlayer = WildPlayer;
  obj.Quest = Quest;
  obj.elementalMapping = elementalMapping;
  obj.ElementalChild = ElementalChild;
  obj.ElementalChilds = ElementalChilds;
  obj.elementalPets = elementalPets;
  obj.next();
}
