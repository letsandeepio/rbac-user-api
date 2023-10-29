import pino from "pino";

export const logger = pino({
  transport: {
    redact: ["DATABASE_CONNECTION"],
    level: "debug",
    target: "pino-pretty",
  },
});
