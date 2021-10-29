const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const CYAN = '\x1b[36m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const MAGENTA = '\x1b[35m';

const loggerColors = {
  log: GREEN,
  error: RED,
  warn: YELLOW,
  debug: MAGENTA,
  verbose: CYAN,
};

const loggers = {};

const createLogger = (level: string, color: string) => {
  const start = `${color}${level}`;

  return (context: string, ...messages: any[]) => {
    const suffix = `${start} ${BOLD}[${context}]${RESET}`;

    console.log(`${suffix}`, ...messages);
  };
};

export const log = (level) => {
  if (!loggers[level]) {
    loggers[level] = createLogger(level.toUpperCase(), loggerColors[level]);
  }
  return loggers[level];
};
