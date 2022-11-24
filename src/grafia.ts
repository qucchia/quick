import Element from "./element";

export enum Diacrític {
  ACCENT_GREU,
  ACCENT_AGUT,
  DIÈRESI,
}

export enum Tipus {
  VOCAL,
  CONSONANT,
}

export type Vocal = Grafia<Tipus.VOCAL>;
export type Consonant = Grafia<Tipus.CONSONANT>;

export default class Grafia<T extends Tipus = Tipus> extends Element {
  nom: string;
  majúscula: boolean;
  tipus: T;
  feble: boolean;
  ei: boolean;
  diacrític?: Diacrític;

  constructor({
    majúscula,
    tipus,
    nom,
    diacrític,
  }: {
    majúscula: boolean;
    tipus: T;
    nom: string;
    diacrític?: Diacrític;
  }) {
    super();
    this.majúscula = majúscula;
    this.tipus = tipus;
    this.nom = nom.toLowerCase();
    this.diacrític = diacrític;
    this.feble = "iu".includes(this.nom);
    this.ei = "ei".includes(this.nom);
  }

  static ambRepresentació(representació: string) {
    const vocal = Grafia.ésVocal(representació);
    return new Grafia({
      majúscula: representació === representació.toUpperCase(),
      tipus: vocal ? Tipus.VOCAL : Tipus.CONSONANT,
      nom: vocal ? Grafia.treuDiacrítics(representació) : representació,
      diacrític: "éíóú".includes(representació)
        ? Diacrític.ACCENT_AGUT
        : "àèò".includes(representació)
        ? Diacrític.ACCENT_GREU
        : "ïü".includes(representació)
        ? Diacrític.DIÈRESI
        : undefined,
    });
  }

  static deParaula(paraula: string) {
    return paraula
      .split("")
      .map((lletra) => Grafia.ambRepresentació(lletra))
      .reverse()
      .reduce((previ, actual) => {
        if (previ) previ.assignaAnterior(actual);
        actual.assignaPosterior(previ);
        return actual;
      });
  }

  static ésVocal(lletra: string) {
    return "aeiou".includes(Grafia.treuDiacrítics(lletra.toLowerCase()));
  }

  static treuDiacrítics(string: string) {
    return string
      .replace(/à/gi, "a")
      .replace(/è/gi, "e")
      .replace(/é/gi, "e")
      .replace(/í/gi, "i")
      .replace(/ï/gi, "i")
      .replace(/ò/gi, "o")
      .replace(/ó/gi, "o")
      .replace(/ü/gi, "u")
      .replace(/ú/gi, "u");
  }

  get vocal() {
    return this.tipus === Tipus.VOCAL;
  }

  get consonant() {
    return this.tipus === Tipus.CONSONANT;
  }

  get representació() {
    let representació = this.nom;

    switch (this.diacrític) {
      case Diacrític.ACCENT_GREU:
        representació = representació
          .replace(/a/i, "à")
          .replace(/e/i, "è")
          .replace(/o/i, "ò");
        break;
      case Diacrític.ACCENT_AGUT:
        representació = representació
          .replace(/e/i, "é")
          .replace(/i/i, "í")
          .replace(/o/i, "ó")
          .replace(/u/i, "ú");
        break;
      case Diacrític.DIÈRESI:
        representació = representació.replace(/i/i, "ï").replace(/u/gi, "ü");
        break;
    }

    return this.majúscula ? representació.toUpperCase() : representació;
  }

  get unitatConsonàntic(): Consonant[] | undefined {
    const UNITATS_CONSONÀNTIQUES = [
      "bl",
      "br",
      "cl",
      "cr",
      "dr",
      "fl",
      "fr",
      "gl",
      "gr",
      "pl",
      "pr",
      "tr",
      "vl",
      "vr",
    ];
    return this.consonant
      ? UNITATS_CONSONÀNTIQUES.includes(
          this.representació + this.posterior()?.representació
        )
        ? [this as Consonant, this.posterior() as Consonant]
        : [this as Consonant]
      : undefined;
  }

  get començaNovaSíl·laba() {
    return (
      this.ésNucliSil·làbic ||
      this.ésDiftongCreixent ||
      (!!this.unitatConsonàntic &&
        this.unitatConsonàntic.at(-1)?.posterior()?.vocal)
    );
  }

  get ésNucliSil·làbic() {
    return (
      this.vocal &&
      !this.ésDiftongCreixent &&
      !this.anterior()?.ésDiftongDecreixent
    );
  }

  get ésDiftong() {
    return this.ésDiftongCreixent || this.ésDiftongDecreixent;
  }

  /**
   * És el primer de quatre possibles casos de diftongació. La primera vocal és
   * una *u* (pronunciada, s'entén, i no solament ortogràfica) precedida de *g*
   * o *q*) *[2a]*.
   */
  get ésDiftongGuOQu() {
    return (
      (this.anterior()?.nom === "g" || this.anterior()?.nom === "q") &&
      this.nom === "u" &&
      this.posterior()?.tipus === Tipus.VOCAL &&
      (this.diacrític === Diacrític.DIÈRESI || !this.posterior()?.ei)
    );
  }

  /**
   * Són el segon i tercer de quatre possibles casos de diftongació:
   *
   * - Una *i* o *u* àtones es troben entre dues vocals. Llavors la *i* o la
   *   *u* es comporten com una consonant i formen síl·laba amb la vocal
   *   següent.
   *
   * - El mateix cal dir de la *i* inicial (amb *h* o sense) i seguida de
   *   vocal.
   *
   * *[2b-2c]*
   */
  get ésDiftongCreixent() {
    return (
      this.ésDiftongGuOQu ||
      // *i* o *u* precedida de vocal
      (((this.feble && this.anterior()?.tipus === Tipus.VOCAL) ||
        // *i* inicial
        (this.nom === "i" &&
          (!this.anterior() ||
            (this.anterior()?.nom === "h" && !this.anterior(2))))) &&
        this.posterior()?.tipus === Tipus.VOCAL &&
        !this.diacrític)
    );
  }

  /**
   * És l'últim de quatre possibles casos de diftongació. L'última vocal és una
   * *i* o una *u* àtones. *[2d]*
   */
  get ésDiftongDecreixent() {
    return (
      this.vocal &&
      !this.ésDiftongCreixent &&
      this.posterior()?.feble &&
      !this.posterior()?.diacrític
    );
  }
}

const DÍGRAFS_INSEPARABLES = ["LL", "NY", "GU", "QU", "KH"];
const DÍGRAFS_SEPARABLES = [
  ["R", "R"],
  ["S", "S"],
  ["S", "C"],
  ["I", "X"],
  ["L", "·L"],
  ["T", "L"],
  ["T", "LL"],
  ["T", "J"],
  ["T", "M"],
  ["T", "N"],
  ["T", "X"],
];

const SUFIXOS_QUE_NO_AFECTEN_PARTICIÓ = ["ISTA", "ISME"];
