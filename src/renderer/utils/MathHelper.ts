export default class MathHelper {
  public static lerp(i: number, d: number, n: number) {
    return (1 - n) * i + n * d
  }
}