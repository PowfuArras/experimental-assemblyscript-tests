// The entry file of your WebAssembly module.

export class point {
  x: i32;
  y: i32;
  constructor(x: i32, y: i32) {
    this.x = x;
    this.y = y;
  }
}

class QuadTree {
  
}

export function add(a: i32, b: i32): i32 {
  return a + b;
}
