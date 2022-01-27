class CustomError extends Error {
  constructor(status, message, name = 'Custom Error') {
    super()
    this.status = status
    this.message = message
    this.name = name
  }
}

export { CustomError }
