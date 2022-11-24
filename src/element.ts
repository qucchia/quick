export default class Element {
  private _posterior?: typeof this;
  private _anterior?: typeof this;

  assignaPosterior(valor: typeof this | undefined) {
    this._posterior = valor;
  }

  assignaAnterior(valor: typeof this | undefined) {
    this._anterior = valor;
  }

  posterior(nombre?: number): typeof this | undefined {
    if (nombre === 1 || nombre === undefined) return this._posterior;
    if (nombre < 0) return this.anterior(-nombre);
    if (nombre < 1) return this;
    return this._posterior && this._posterior.posterior(nombre - 1);
  }

  anterior(nombre?: number): typeof this | undefined {
    if (nombre === 1 || nombre === undefined) return this._anterior;
    if (nombre < 0) return this.posterior(-nombre);
    if (nombre < 1) return this;
    return this._anterior && this._anterior.anterior(nombre - 1);
  }
}
