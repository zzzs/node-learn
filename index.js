function test() {
  console.log(1111)
  process.nextTick(() => test());
}

function test2() {
  console.log(222222)
  setTimeout(() => test2(), 0);
}

test2()
