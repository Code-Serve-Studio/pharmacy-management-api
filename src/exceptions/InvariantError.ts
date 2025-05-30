import ClientError from "./ClientError";

class InvariantError extends ClientError {
  constructor(message: string){
    super(message);
    this.name = 'InvariantError'
  }
}

export default InvariantError;
