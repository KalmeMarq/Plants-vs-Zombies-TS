declare module 'hitarea-shapes' {
  export default class HitAreaShapes {
    constructor(shapes?: {});
    shapes: any;
    /**
     * Called by hitArea
     * @param {number} x
     * @param {number} y
     */
    contains(x?: number, y?: number): any;
  }
}