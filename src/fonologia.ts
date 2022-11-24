interface Fonema {
  sonor: boolean;
}

enum Elevació {
  ALT,
  MITJÀ_ALT,
  MITJÀ,
  MITJÀ_BAIX,
  BAIX,
}

enum Avançament {
  ANTERIOR,
  CENTRAL,
  POSTERIOR,
}

class Vocal implements Fonema {
  sonor = true;
  elevació: Elevació;
  avançament: Avançament;
  arrodonida: boolean;

  constructor(elevació: Elevació, avançament: Avançament) {
    this.elevació = elevació;
    this.avançament = avançament;
    this.arrodonida = avançament === Avançament.POSTERIOR;
  }
}

enum Mode {
  OCLUSIU,
  FRICATIU,
  AFRICAT,
  LATERAL,
  VIBRANT,
  BATEGANT,
  APROXIMANT,
  SEMIVOCAL,
  NASAL,
}

type Ròtic = Mode.VIBRANT | Mode.BATEGANT;
type Líquid = Mode.LATERAL | Ròtic;
type Aproximant = Mode.APROXIMANT | Mode.SEMIVOCAL;

type Obstruent = Mode.OCLUSIU | Mode.FRICATIU | Mode.AFRICAT;
type Sonant = Aproximant | Líquid | Mode.NASAL;

enum Lloc {
  BILABIAL,
  LABIODENTAL,
  DENTAL,
  ALVEOLAR,
  PALATAL,
  VELAR,
}

class Consonant implements Fonema {
  mode: Mode;
  lloc: Lloc;
  sonor: boolean;
  sonant: boolean;

  constructor(mode: Obstruent, lloc: Lloc, sonor: boolean);
  constructor(mode: Sonant, lloc: Lloc);
  constructor(mode: Mode, lloc: Lloc, sonor?: boolean) {
    this.mode = mode;
    this.lloc = lloc;
    this.sonant = sonor !== undefined;
    if (sonor === undefined) sonor = true;
    this.sonor = sonor;
  }
}

const FONEMES = {
  /// Vocals
  i: new Vocal(Elevació.ALT, Avançament.ANTERIOR),
  e: new Vocal(Elevació.MITJÀ_ALT, Avançament.ANTERIOR),
  ɛ: new Vocal(Elevació.MITJÀ_BAIX, Avançament.ANTERIOR),
  ə: new Vocal(Elevació.MITJÀ, Avançament.CENTRAL),
  a: new Vocal(Elevació.BAIX, Avançament.CENTRAL),
  o: new Vocal(Elevació.MITJÀ_ALT, Avançament.POSTERIOR),
  ɔ: new Vocal(Elevació.MITJÀ_BAIX, Avançament.POSTERIOR),
  u: new Vocal(Elevació.ALT, Avançament.POSTERIOR),

  /// Consonants
  // Oclusives
  p: new Consonant(Mode.OCLUSIU, Lloc.BILABIAL, false),
  b: new Consonant(Mode.OCLUSIU, Lloc.BILABIAL, true),
  t: new Consonant(Mode.OCLUSIU, Lloc.DENTAL, false),
  d: new Consonant(Mode.OCLUSIU, Lloc.DENTAL, true),
  g: new Consonant(Mode.OCLUSIU, Lloc.VELAR, false),
  k: new Consonant(Mode.OCLUSIU, Lloc.VELAR, true),
  // Fricatives
  f: new Consonant(Mode.FRICATIU, Lloc.LABIODENTAL, false),
  v: new Consonant(Mode.FRICATIU, Lloc.LABIODENTAL, true),
  s: new Consonant(Mode.FRICATIU, Lloc.ALVEOLAR, false),
  z: new Consonant(Mode.FRICATIU, Lloc.ALVEOLAR, true),
  ʃ: new Consonant(Mode.FRICATIU, Lloc.PALATAL, false),
  ʒ: new Consonant(Mode.FRICATIU, Lloc.PALATAL, true),
  // Africades
  ts: new Consonant(Mode.AFRICAT, Lloc.ALVEOLAR, false),
  dz: new Consonant(Mode.AFRICAT, Lloc.ALVEOLAR, true),
  tʃ: new Consonant(Mode.AFRICAT, Lloc.PALATAL, false),
  dʒ: new Consonant(Mode.AFRICAT, Lloc.PALATAL, true),
  // Laterals
  l: new Consonant(Mode.LATERAL, Lloc.ALVEOLAR),
  ʎ: new Consonant(Mode.LATERAL, Lloc.PALATAL),
  // Ròtiques
  r: new Consonant(Mode.VIBRANT, Lloc.ALVEOLAR),
  ɾ: new Consonant(Mode.BATEGANT, Lloc.ALVEOLAR),
  // Nasals
  m: new Consonant(Mode.NASAL, Lloc.BILABIAL),
  ɱ: new Consonant(Mode.NASAL, Lloc.LABIODENTAL),
  n: new Consonant(Mode.NASAL, Lloc.ALVEOLAR),
  ɲ: new Consonant(Mode.NASAL, Lloc.PALATAL),
  ŋ: new Consonant(Mode.NASAL, Lloc.VELAR),
  // Aproximants
  β: new Consonant(Mode.APROXIMANT, Lloc.BILABIAL),
  ð: new Consonant(Mode.APROXIMANT, Lloc.DENTAL),
  ɣ: new Consonant(Mode.APROXIMANT, Lloc.VELAR),
  // Semivocals
  j: new Consonant(Mode.SEMIVOCAL, Lloc.PALATAL),
  w: new Consonant(Mode.SEMIVOCAL, Lloc.VELAR),
};
