class Vector2 {
  constructor(x, y) {
    this.x = Number(x);
    this.y = Number(y);
  }

  static distance(Vector2A, Vector2B) {
    return Math.sqrt(Math.pow(Vector2A.x - Vector2B.x, 2) + Math.pow(Vector2A.y - Vector2B.y, 2));
  }
}

export default Vector2;
