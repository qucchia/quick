import transcriu from "./index.js";

function test(text: string) {
  console.log(`${text}: ${transcriu(text)}`);
}

test("casa");
test("kebab");
