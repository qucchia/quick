import Element from "./element";
import Síl·laba from "./síl·laba";

export default class Paraula extends Element {
  síl·labes: Síl·laba[];

  constructor(síl·labes: Síl·laba[]) {
    super();
    this.síl·labes = síl·labes;
  }

  static deParaula(paraula: string) {
    const síl·laba = Síl·laba.deParaula(paraula);

    function llistaSíl·labes(síl·laba?: Síl·laba): Síl·laba[] {
      return síl·laba
        ? llistaSíl·labes(síl·laba.anterior()).concat([síl·laba])
        : [];
    }

    return new Paraula(llistaSíl·labes(síl·laba));
  }

  get representació() {
    return this.síl·labes.map((s) => s.representació).join("-");
  }
}
