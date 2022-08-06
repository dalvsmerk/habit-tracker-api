export abstract class CodedError extends Error {
  abstract code: string;

  toString() {
    return `${this.code}: ${this.message}`;
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
    };
  }
}
