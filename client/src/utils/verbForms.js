// Small English verb morphology helpers for the auto-modification feature.
// Handles common irregulars + regular spelling rules. Not exhaustive, but
// covers the high-frequency vocabulary used in pedagogical examples.

const IRREG_PAST_PARTICIPLE = {
  be: 'been', go: 'gone', do: 'done', have: 'had', see: 'seen', give: 'given',
  take: 'taken', come: 'come', run: 'run', eat: 'eaten', drink: 'drunk',
  know: 'known', think: 'thought', bring: 'brought', buy: 'bought',
  catch: 'caught', teach: 'taught', send: 'sent', sleep: 'slept', keep: 'kept',
  leave: 'left', feel: 'felt', meet: 'met', sit: 'sat', stand: 'stood',
  win: 'won', begin: 'begun', sing: 'sung', swim: 'swum', break: 'broken',
  speak: 'spoken', steal: 'stolen', write: 'written', drive: 'driven',
  ride: 'ridden', rise: 'risen', fall: 'fallen', fly: 'flown', grow: 'grown',
  throw: 'thrown', blow: 'blown', draw: 'drawn', show: 'shown', wear: 'worn',
  tear: 'torn', forget: 'forgotten', get: 'gotten', hide: 'hidden',
  make: 'made', say: 'said', pay: 'paid', read: 'read', put: 'put', hit: 'hit',
  let: 'let', cut: 'cut', cost: 'cost', shut: 'shut', hurt: 'hurt',
  build: 'built', find: 'found', hold: 'held', tell: 'told', sell: 'sold',
  lose: 'lost', lead: 'led', spend: 'spent', stick: 'stuck',
  fight: 'fought', hear: 'heard', learn: 'learned', understand: 'understood',
  become: 'become',
};

const IRREG_ING = {
  die: 'dying', lie: 'lying', tie: 'tying',
};

function preserveCase(original, transformed) {
  if (!original) return transformed;
  if (original[0] === original[0].toUpperCase() && original[0] !== original[0].toLowerCase()) {
    return transformed[0].toUpperCase() + transformed.slice(1);
  }
  return transformed;
}

function isCVC(word) {
  // ends in consonant-vowel-consonant (not w/x/y)
  return /[^aeiou][aeiou][^aeiouwxy]$/.test(word);
}

export function toPastParticiple(word) {
  if (!word) return word;
  const lower = word.toLowerCase();
  if (IRREG_PAST_PARTICIPLE[lower]) return preserveCase(word, IRREG_PAST_PARTICIPLE[lower]);
  if (lower.endsWith('e')) return preserveCase(word, lower + 'd');
  if (/[^aeiou]y$/.test(lower)) return preserveCase(word, lower.slice(0, -1) + 'ied');
  if (isCVC(lower) && lower.length <= 5) {
    return preserveCase(word, lower + lower.slice(-1) + 'ed');
  }
  return preserveCase(word, lower + 'ed');
}

export function toIngForm(word) {
  if (!word) return word;
  const lower = word.toLowerCase();
  if (IRREG_ING[lower]) return preserveCase(word, IRREG_ING[lower]);
  if (lower.endsWith('ie')) return preserveCase(word, lower.slice(0, -2) + 'ying');
  if (lower.endsWith('e') && lower !== 'be') return preserveCase(word, lower.slice(0, -1) + 'ing');
  if (isCVC(lower) && lower.length <= 5) {
    return preserveCase(word, lower + lower.slice(-1) + 'ing');
  }
  return preserveCase(word, lower + 'ing');
}
