(function() {
  sayHi(function(name) {
    return "Hi" + name("!!");
  });

  saYo(function(name) {
    return "Yo, yo" + name("!");
  });

}).call(this);

//# sourceMappingURL=script.js.map
