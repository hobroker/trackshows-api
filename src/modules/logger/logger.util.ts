import { timer } from '../../util/timer';

const RESET = '\x1b[0m';
const BRIGHT = '\x1b[5m';
const BOLD = '\x1b[1m';
const CYAN = '\x1b[36m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const MAGENTA = '\x1b[35m';
const BLUE = '\x1b[34m';

const isColorLoggingEnabled = !process.env.NO_COLOR;
const formatLevel = (color: string, level: string) =>
  isColorLoggingEnabled ? `${color}${level}` : level;
const formatContext = (context: string) =>
  isColorLoggingEnabled ? `${BOLD}[${context}]${RESET}` : `[${context}]`;
const formatMs = (ms: number) =>
  isColorLoggingEnabled ? `${BRIGHT}${BLUE}+${ms}ms${RESET}` : `+${ms}ms`;

const loggerColors = {
  log: GREEN,
  error: RED,
  warn: YELLOW,
  debug: MAGENTA,
  verbose: CYAN,
};

let time = timer();
const createLogger = (level: string, color: string) => {
  const start = formatLevel(color, level);

  return (context: string, ...messages: any[]) => {
    let ms: number;
    const rest = [...messages];
    const options = rest.pop();

    if (options.ms !== undefined) {
      ms = options.ms;
    } else {
      ms = time();
      rest.push(options);
    }
    time = timer();

    const suffix = `${start} ${formatContext(context)}`;
    console.log(`${suffix}`, ...rest, formatMs(ms));
  };
};

const _logger: {
  [key: string]: (context: string, ...messages: any[]) => void;
} = {};

export const logger = new Proxy(_logger, {
  get(target, prop: string) {
    if (!_logger[prop]) {
      _logger[prop] = createLogger(prop.toUpperCase(), loggerColors[prop]);
    }

    return _logger[prop];
  },
});
