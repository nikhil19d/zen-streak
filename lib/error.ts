export class UnAuthorizedError extends Error {
  constructor(message = "UnAuthorized") {
    super(message)
    this.name = 'UnAuthorizedError'
  }
}
