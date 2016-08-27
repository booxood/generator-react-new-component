var hyphenateRE = /([a-z\d])([A-Z])/g;

exports.hyphenate = function hyphenate(str) {
  return str
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase();
};

exports.isCamelized = function isCamelized(name) {
  var results = name && name.match(/^[A-X][a-z]+([A-Z][a-z]+)*/g);
  return results && results[0] === name;
};
