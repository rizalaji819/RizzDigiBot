const { ELEMENT_ADVANTAGE } = require('../pet/skills');

const SKILL_EFFECTS = {
  block_50: { type: 'defense', blockPercent: 50 },
  block_30_heal_10: { type: 'defense', blockPercent: 30, healPercent: 10 },
  heal_25: { type: 'support', healPercent: 25 },
  atk_boost_20_3: { type: 'buff', stat: 'attack', boost: 20, duration: 3 },
  dodge_40: { type: 'evasion', dodgeChance: 40 },
  poison_10_3: { type: 'dot', damagePercent: 10, duration: 3 },
  burn_8_3: { type: 'dot', damagePercent: 8, duration: 3 },
  stun_30: { type: 'stun', chance: 30 },
  instant_kill_15: { type: 'special', killChance: 15 },
  coin_toss: { type: 'special', coinToss: true },
};

function calculateElementMultiplier(attackerElement, defenderElement) {
  if (!attackerElement || !defenderElement || attackerElement === 'neutral' || defenderElement === 'neutral') return 1.0;
  if (ELEMENT_ADVANTAGE[attackerElement] === defenderElement) return 1.3;
  if (ELEMENT_ADVANTAGE[defenderElement] === attackerElement) return 0.7;
  return 1.0;
}

function calculateDamage(attacker, defender, skill) {
  const baseDamage = skill.power > 0 ? (attacker.attack * skill.power) / 100 : attacker.attack;
  const elementMultiplier = calculateElementMultiplier(skill.element, defender.element || 'neutral');
  const criticalChance = 0.1 + (attacker.speed || 0) / 1000;
  const isCritical = Math.random() < criticalChance;
  const criticalMultiplier = isCritical ? 1.5 : 1.0;
  const defenseReduction = defender.defense * 0.3;
  let finalDamage = Math.floor(baseDamage * elementMultiplier * criticalMultiplier - defenseReduction);
  finalDamage = Math.max(1, finalDamage);
  return { damage: finalDamage, isCritical, elementMultiplier };
}

function applySkillEffect(effect, target, attacker) {
  const result = { message: '', heal: 0, damage: 0, stun: false, dead: false };

  if (!effect) return result;

  const effectData = SKILL_EFFECTS[effect];
  if (!effectData) return result;

  switch (effectData.type) {
    case 'defense':
      result.blockPercent = effectData.blockPercent;
      if (effectData.healPercent) {
        result.heal = Math.floor(target.maxHp * effectData.healPercent / 100);
        result.message = `🛡️ Blocked ${effectData.blockPercent}% damage and healed ${result.heal} HP!`;
      } else {
        result.message = `🛡️ Blocked ${effectData.blockPercent}% damage!`;
      }
      break;

    case 'support':
      if (effectData.healPercent) {
        result.heal = Math.floor(target.maxHp * effectData.healPercent / 100);
        result.message = `💚 Healed ${result.heal} HP!`;
      }
      if (effectData.stat) {
        result.buff = { stat: effectData.stat, boost: effectData.boost, duration: effectData.duration };
        result.message += ` ${effectData.stat.toUpperCase()} +${effectData.boost}% for ${effectData.duration} turns!`;
      }
      break;

    case 'evasion':
      if (Math.random() * 100 < effectData.dodgeChance) {
        result.dodged = true;
        result.message = `💨 Dodged the attack!`;
      }
      break;

    case 'dot':
      result.dot = { damagePercent: effectData.damagePercent, duration: effectData.duration };
      result.message = `☠️ Applied ${effect === 'poison_10_3' ? 'Poison' : 'Burn'} for ${effectData.duration} turns!`;
      break;

    case 'stun':
      if (Math.random() * 100 < effectData.chance) {
        result.stun = true;
        result.message = `⚡ Stunned the enemy for 1 turn!`;
      }
      break;

    case 'special':
      if (effectData.killChance) {
        if (Math.random() * 100 < effectData.killChance) {
          result.damage = target.hp;
          result.dead = true;
          result.message = `🌟 Instant Kill!`;
        } else {
          result.message = `🌟 Divine Judgment missed!`;
        }
      }
      if (effectData.coinToss) {
        if (Math.random() < 0.5) {
          result.coinTossMultiplier = 2.5;
          result.message = `🪙 Heads! 2.5x damage!`;
        } else {
          result.coinTossMultiplier = 0;
          result.message = `🪙 Tails! 0 damage!`;
        }
      }
      break;
  }

  return result;
}

function processDotEffects(target) {
  let totalDamage = 0;
  const messages = [];

  if (target.buffs) {
    target.buffs = target.buffs.filter(b => {
      b.duration--;
      return b.duration > 0;
    });
  }

  if (target.dots) {
    target.dots = target.dots.filter(dot => {
      const damage = Math.floor(target.maxHp * dot.damagePercent / 100);
      target.hp -= damage;
      totalDamage += damage;
      messages.push(`☠️ ${dot.type} dealt ${damage} damage!`);
      dot.duration--;
      return dot.duration > 0;
    });
  }

  if (target.stunned) {
    target.stunned = false;
    messages.push(`⚡ Pet is stunned and cannot act!`);
  }

  return { totalDamage, messages };
}

function monsterAttack(monster, pet) {
  const baseDamage = monster.attack;
  const defenseReduction = pet.defense * 0.3;
  let damage = Math.floor(baseDamage - defenseReduction);
  damage = Math.max(1, damage);

  const isCritical = Math.random() < 0.1;
  if (isCritical) damage = Math.floor(damage * 1.5);

  return { damage, isCritical };
}

function calculateBattleRewards(monster, pet) {
  const levelBonus = 1 + (pet.level - monster.minLevel) * 0.05;
  const expReward = Math.floor(monster.exp * levelBonus);
  const coinReward = Math.floor(monster.coins * levelBonus);

  const drops = [];

  const foodChance = Math.random();
  if (foodChance < 0.10) {
    const foods = ['Basic Food', 'Premium Food', 'Ultra Food'];
    const food = foods[Math.floor(Math.random() * foods.length)];
    drops.push({ type: 'food', name: food, quantity: 1 });
  }

  const scrollChance = Math.random();
  if (scrollChance < 0.05) {
    drops.push({ type: 'scroll', name: 'Random Skill Scroll', quantity: 1 });
  }

  const eggChance = Math.random();
  if (eggChance < 0.05) {
    const rarities = ['common', 'rare', 'epic', 'legendary'];
    const weights = [50, 30, 15, 5];
    let roll = Math.random() * 100;
    let eggRarity = 'common';
    for (let i = 0; i < rarities.length; i++) {
      roll -= weights[i];
      if (roll <= 0) {
        eggRarity = rarities[i];
        break;
      }
    }
    drops.push({ type: 'egg', name: `${eggRarity} Egg`, quantity: 1, rarity: eggRarity });
  }

  return { expReward, coinReward, drops };
}

module.exports = {
  SKILL_EFFECTS,
  calculateElementMultiplier,
  calculateDamage,
  applySkillEffect,
  processDotEffects,
  monsterAttack,
  calculateBattleRewards,
};
