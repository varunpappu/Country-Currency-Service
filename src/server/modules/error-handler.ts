export class ErroHandler extends Error {
  public readonly code;

  constructor(code: number, message?: string) {
    super(message);

    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}
