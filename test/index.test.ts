import { untruncateJson } from "../src";

describe("untruncateJson", () => {
  it("returns unmodified valid string", () => {
    expectUnchanged('"Hello"');
  });

  it("returns unmodified valid string with bracket characters", () => {
    expectUnchanged('"}{]["');
  });

  it("returns unmodified valid string with escaped quotes", () => {
    expectUnchanged('"\\"Dr.\\" Leo Spaceman"');
  });

  it("returns unmodified valid string with unicode escapes", () => {
    expectUnchanged("ab\\u0065cd");
  });

  it("returns unmodified valid number", () => {
    expectUnchanged("20");
  });

  it("returns unmodified valid boolean", () => {
    expectUnchanged("true");
    expectUnchanged("false");
  });

  it("returns unmodified valid null", () => {
    expectUnchanged("null");
  });

  it("returns unmodified valid array", () => {
    expectUnchanged("[]");
    expectUnchanged('["a", "b", "c"]');
    expectUnchanged("[ 1, 2, 3 ]");
  });

  it("returns unmodified valid object", () => {
    expectUnchanged("{}");
    expectUnchanged('{"foo": "bar"}');
    expectUnchanged('{ "foo": 2 }');
  });

  it("returns unmodified compound object", () => {
    expectUnchanged(
      JSON.stringify({
        s: "Hello",
        num: 10,
        b: true,
        nul: "null",
        o: { s: "Hello2", num: 11 },
        a: ["Hello", 10, { s: "Hello3" }],
      }),
    );
  });

  it("adds a missing close quote", () => {
    expect(untruncateJson('"Hello')).toBe('"Hello"');
  });

  it('handles a string cut off after a "\\"', () => {
    expect(untruncateJson('"Hello\\')).toBe('"Hello"');
  });

  it("handles a string cut off in the middle of a unicode escape", () => {
    expect(untruncateJson('"ab\\u006')).toBe('"ab"');
  });

  it('replaces a number cut off at "-" with 0', () => {
    expect(untruncateJson("-")).toBe("0");
  });

  it("adds a missing ]", () => {
    expect(untruncateJson("[")).toBe("[]");
    expect(untruncateJson("[1, 2, 3 ")).toBe("[1, 2, 3 ]");
  });

  it("removes a trailing comma to end a list", () => {
    expect(untruncateJson("[1, 2,")).toBe("[1, 2]");
  });

  function expectUnchanged(json: string) {
    expect(untruncateJson(json)).toBe(json);
  }
});
