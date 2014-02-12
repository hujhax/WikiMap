(function() {
  sayHi(function(name) {
    return "Hi" + name("!!");
  });

  saYo(function(name) {
    return "YO" + name("!");
  });

}).call(this);

//# sourceMappingURL=script.js.map
