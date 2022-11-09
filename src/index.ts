/*

  Transcriptor - transcriptor fonètic català.

  ɱ ɲ ŋ ʃ ʒ β ð ɣ ɾ ʎ
*/

const PARELLS_SONORITAT = [
  // sonor / sord
  ["b", "p"],
  ["d", "t"],
  ["g", "k"],
  ["ʒ", "ʃ"],
  ["z", "s"],
];

function ensordeix(so: string) {
  const item = PARELLS_SONORITAT.find((item) => item[0] === so);
  return item ? item[1] : so;
}

function sonoritza(so: string) {
  const item = PARELLS_SONORITAT.find((item) => item[1] === so);
  return item ? item[0] : so;
}

const APROXIMANTS_NO_GRADUALS = {
  b: "β",
  d: "ð",
  g: "ɣ",
};

function aproxima(so: string) {
  if (so in APROXIMANTS_NO_GRADUALS) {
    return APROXIMANTS_NO_GRADUALS[so];
  }
  return so;
}

function ésVocal(lletra?: string) {
  return !!lletra && "aeiou".includes(lletra);
}

type Propietats = {
  entreVocals: boolean;
};

function transcriuLletra(
  lletra: string,
  propietats: Propietats,
  anterior?: string,
  posterior?: string
): string {
  switch (lletra) {
    case "b":
    case "v":
      return "a";
    case "c":
      return posterior && "ei".includes(posterior) ? "s" : "c";
    case "ç":
      return "s";
    case "k":
      return "k";
    case "s":
      if (anterior === "s") return "";
      if (posterior === "s") return "s";
      return propietats.entreVocals ? "z" : "s";
    default:
      return "?";
  }
}

export default function transcriu(text: string) {
  const lletres = text.split("");
  return (
    "[" +
    lletres
      .map((lletra, i) => {
        const anterior = lletres[i - 1];
        const posterior = lletres[i + 1];
        return transcriuLletra(
          lletra,
          { entreVocals: ésVocal(anterior) && ésVocal(posterior) },
          anterior,
          posterior
        );
      })
      .join("") +
    "]"
  );
}
