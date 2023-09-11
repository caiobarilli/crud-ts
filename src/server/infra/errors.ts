/**
 * Adiciona mensagem de erro ao objeto de resposta.
 */
export class HttpNotFoundError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.status = 404;
  }
}
