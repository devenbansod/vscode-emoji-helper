// Adapted from https://www.npmjs.com/package/emojer.js

/**
 * The list of the emojis following their char codes
 */
export const emojiCodes: {[key: string]: number} = {
  ':)': 0x1f603,
  ':-)': 0x1f603,
  ':]': 0x1f603,
  '=)': 0x1f603,
  '=]': 0x1f603,
  '(:': 0x1f603,
  '[:': 0x1f603,
  '(=': 0x1f603,
  '[=': 0x1f603,
  ':3': 0x1f60a,
  ':$': 0x1f60a,
  ':D': 0x1f601,
  '=D': 0x1f601,
  ';)': 0x1f609,
  ';-)': 0x1f609,
  ';]': 0x1f609,
  '(H)': 0x1f60e,
  ':*': 0x1f618,
  ':-*': 0x1f618,
  ';*': 0x1f618,
  ':|': 0x1f611,
  ':O': 0x1f62e,
  '=-O': 0x1f62e,
  ':P': 0x1f60b,
  ':-P': 0x1f60b,
  ';P': 0x1f61c,
  ":'(": 0x1f62d,
  ":'[": 0x1f62d,
  ")':": 0x1f62d,
  "]':": 0x1f62d,
  ':#': 0x1f910,
  '(A)': 0x1f607,
  ':(': 0x1f614,
  ':/': 0x1f614,
  ':-(': 0x1f614,
  ':[': 0x1f614,
  ':@': 0x1f621,
  '(6)': 0x1f608,
  '+(': 0x1f922,
  '+[': 0x1f922,
  '<3': 0x2764,
  S2: 0x2764,
  '(L)': 0x2764,
  '(8)': 0x1f3b5,
  '(Y)': 0x1f44d,
  '(OK)': 0x1f44c,
  ':rock:': 0x1f918,
  '*_*': 0x1f60d,
  '+_+': 0x1f60d,
  '>_<': 0x1f623,
  'O_O': 0x1f631,
  ':x': 0x1f636,
};

/**
 * Escapes some characters to be a valid RegExp expression
 *
 * @param {String} str The string to be replaced
 */
const escapeRegExp = function (str: string) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
};

/**
 * Main function. Find into the text the characters to be replaced by the emojis according to the emojiCodes.
 *
 * @param {String} text The text to be replaced by the emojis
 */
const replace = function (text: string) {
  const keys = Object.keys(emojiCodes);
  let i = keys.length;

  while (i--) {
    let key = keys[i];
    let code = emojiCodes[key];

    const value = String.fromCodePoint(code);

    text = text.replace(new RegExp(escapeRegExp(key), 'g'), value);
  }

  return text;
};

/**
 * Add a new emoji to the list
 *
 * @param {String} character The character to be replaced by emoji
 * @param {Number} charCode The char code
 */
export const addEmoji = function (character: string, charCode: number) {
  if (typeof charCode !== 'number') {
    throw new Error('emojer: charCode must be a number.');
  }

  emojiCodes[character] = charCode;
};

/**
 * Disable emojis to the list
 *
 * @param {String} character The list of characters to be ignored
 */
export const disableEmojis = function (characters: Array<string>) {
  if (typeof characters !== 'object' || !characters.length) {
    throw new Error('emojer: characters to be disabled must be an array.');
  }

  characters.forEach((character) => {
    delete emojiCodes[character];
  });
};

/**
 * Parse the string/source and returns the string with the new emojis
 *
 * @param {String} source The source that will be replaced
 */
export const parse = function (source: string) {
  try {
    if (typeof source !== 'string') {
      throw new Error('The value needs to be a string.');
    }

    return replace(source);
  } catch (e) {
    console.error(`emojer: ${e.message}`);
  }
};

export const getEmojiMappings = function () {
  return Object.entries(emojiCodes).map((emojiCode) => {
    return [
      emojiCode[0], String.fromCodePoint(emojiCode[1])
    ];
  });
}
