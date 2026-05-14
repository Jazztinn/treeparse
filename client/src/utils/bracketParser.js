// Parses labelled bracket notation like:
//   [S [NP [PRP I]] [VP [V kick] [NP [Det the] [N ball]]]]
// Also handles compressed leaves:  [NP The big dog]

let counter = 1;
function nextId() { return `b${counter++}`; }

export function isBracketNotation(input) {
  const trimmed = input.trim();
  return trimmed.startsWith('[') && trimmed.endsWith(']');
}

export function parseBrackets(input) {
  counter = 1;
  const str = input.trim();
  const state = { i: 0, str };
  skipWS(state);
  const root = parseNode(state);
  skipWS(state);
  if (state.i < str.length) {
    throw new Error(`Unexpected content after root at position ${state.i}`);
  }
  return root;
}

function skipWS(s) {
  while (s.i < s.str.length && /\s/.test(s.str[s.i])) s.i++;
}

function parseNode(s) {
  if (s.str[s.i] !== '[') throw new Error(`Expected '[' at ${s.i}`);
  s.i++;
  skipWS(s);

  let type = '';
  while (s.i < s.str.length && !/[\s\[\]]/.test(s.str[s.i])) {
    type += s.str[s.i++];
  }
  if (!type) throw new Error(`Expected node label at ${s.i}`);

  const children = [];
  const words = [];
  skipWS(s);

  while (s.i < s.str.length && s.str[s.i] !== ']') {
    if (s.str[s.i] === '[') {
      children.push(parseNode(s));
    } else {
      let w = '';
      while (s.i < s.str.length && s.str[s.i] !== '[' && s.str[s.i] !== ']') {
        w += s.str[s.i++];
      }
      w = w.trim();
      if (w) words.push(w);
    }
    skipWS(s);
  }

  if (s.str[s.i] !== ']') throw new Error(`Expected ']' at ${s.i}`);
  s.i++;

  // If there are children, terminal words become their own leaf children
  // unless there are no children at all (then this node is itself a leaf).
  let word = null;
  let finalChildren = children;

  if (children.length === 0 && words.length > 0) {
    word = words.join(' ');
  } else if (children.length > 0 && words.length > 0) {
    // Mixed: convert each loose word into a leaf with same type as parent's last guess.
    finalChildren = [
      ...children,
      ...words.map(w => ({
        id: nextId(),
        type: 'Word',
        label: 'Word',
        word: w,
        children: [],
      })),
    ];
  }

  return {
    id: nextId(),
    type,
    label: type,
    word,
    children: finalChildren,
  };
}
