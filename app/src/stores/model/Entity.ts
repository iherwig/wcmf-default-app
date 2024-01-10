export class Entity extends Map {
  public static fromObject(obj: object) {
    return new Map(Object.entries(obj));
  }
}