import Element from "./element";
import Grafia, { Vocal } from "./grafia";

export default class Síl·laba extends Element {
  anteriors: Grafia[];
  nucli?: Vocal;
  posteriors: Grafia[];

  constructor(
    anteriors: Grafia[] = [],
    nucli?: Vocal,
    posteriors: Grafia[] = []
  ) {
    super();
    this.anteriors = anteriors;
    this.nucli = nucli;
    this.posteriors = posteriors;
  }

  get representació(): string {
    return (
      this.anteriors.map((g) => g.representació).join("") +
      (this.nucli?.representació || "") +
      this.posteriors.map((g) => g.representació).join("")
    );
  }

  afegeix(grafia: Grafia) {
    // console.log(
    //   grafia.representació,
    //   grafia.ésNucliSil·làbic,
    //   grafia.començaNovaSíl·laba
    // );
    if (this.nucli) {
      if (grafia.començaNovaSíl·laba) {
        const novaSíl·laba = grafia.ésNucliSil·làbic
          ? new Síl·laba([], grafia as Vocal, [])
          : new Síl·laba([grafia]);
        (this as Síl·laba).assignaPosterior(novaSíl·laba);
        novaSíl·laba.assignaAnterior(this);
        return novaSíl·laba;
      }
      this.posteriors.push(grafia);
    } else {
      if (grafia.ésNucliSil·làbic) {
        this.nucli = grafia as Vocal;
      } else {
        this.anteriors.push(grafia);
      }
    }

    return this;
  }

  static deParaula(paraula: string) {
    let síl·laba: Síl·laba = new Síl·laba();
    let grafia: Grafia | undefined = Grafia.deParaula(paraula);

    while (grafia) {
      síl·laba = síl·laba.afegeix(grafia);
      grafia = grafia.posterior();
    }
    return síl·laba;
  }
}
