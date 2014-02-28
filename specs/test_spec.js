describe("Test suite", function() {
  it("True should be equal to true.", function() {
    expect(true).toBe(true);
  });
  it("True and true should be equal to true.", function() {
    expect(true && true).toBe(true);
  });
});