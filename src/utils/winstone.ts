import winston from 'winston';

// Create a logger instance
const logger = winston.createLogger({
  // Set the log levels
  level: 'info',
  // Define how logs are formatted
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  // Define transports
  transports: [
    // Console transport for logging to the console
    new winston.transports.Console(),
    // File transport for logging to a file
    new winston.transports.File({ filename: 'combined.log' })
  ],
});

export default logger;
