import { timer } from '../../../util/timer';

const RESET = '\x1b[0m';
const BRIGHT = '\x1b[5m';
const BOLD = '\x1b[1m';
const CYAN = '\x1b[36m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const MAGENTA = '\x1b[35m';
const BLUE = '\x1b[34m';

const WITH_COLOR = !process.env.NO_COLOR;

const loggerColors = {
  log: GREEN,
  error: RED,
  warn: YELLOW,
  debug: MAGENTA,
  verbose: CYAN,
};

export class CustomLogger {
  public log = this.createLogger('log', loggerColors.log);
  public error = this.createLogger('error', loggerColors.error);
  public warn = this.createLogger('warn', loggerColors.warn);
  public debug = this.createLogger('debug', loggerColors.debug);
  public verbose = this.createLogger('verbose', loggerColors.verbose);

  private time;

  constructor() {
    this.log = this.log.bind(this);
    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);
    this.debug = this.debug.bind(this);
    this.verbose = this.verbose.bind(this);

    this.time = timer();
  }

  private createLogger(level: string, color: string) {
    const start = this.formatLevel(color, level);

    return (context: string, ...messages: any[]) => {
      let ms: number;
      const rest = [...messages];
      const options = rest.pop();

      if (options.ms !== undefined) {
        ms = options.ms;
      } else {
        ms = this.time();
        rest.push(options);
      }
      this.time = timer();

      const suffix = `${start} ${this.formatContext(context)}`;
      console.log(`${suffix}`, ...rest, this.formatMs(ms));
    };
  }

  private formatLevel(color: string, level: string) {
    return WITH_COLOR ? `${color}${level}` : level;
  }
  private formatContext(context: string) {
    return WITH_COLOR ? `${BOLD}[${context}]${RESET}` : `[${context}]`;
  }
  private formatMs(ms: number) {
    return WITH_COLOR ? `${BRIGHT}${BLUE}+${ms}ms${RESET}` : `+${ms}ms`;
  }
}
