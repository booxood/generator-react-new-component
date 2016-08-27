var hyphenateRE = /([a-z\d])([A-Z])/g;
function hyphenate(str) {
  return str
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase();
}

exports.hyphenate = hyphenate;
