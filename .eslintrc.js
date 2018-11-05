module.exports = {
  "extends": ["airbnb", "prettier"],
  "plugins": ["prettier", "mocha"],
  "rules": {
    "prettier/prettier": ["error"],
    "class-methods-use-this": "off",
    "arrow-body-style": "off",
    "dot-notation": "off",
    "no-underscore-dangle": "off",
    "camelcase": "off"
  },
  "env": {
    "node": true,
    "mocha": true,
    "es6": true
  }
};