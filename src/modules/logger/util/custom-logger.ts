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
  public log = this.createLogger('log').bind(this);
  public error = this.createLogger('error').bind(this);
  public warn = this.createLogger('warn').bind(this);
  public debug = this.createLogger('debug').bind(this);
  public verbose = this.createLogger('verbose').bind(this);

  private time;

  constructor() {
    this.time = timer();
  }

  private createLogger(level: string) {
    const start = this.formatLevel(level);

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

  private formatLevel(level: string) {
    const color = loggerColors[level];
    return WITH_COLOR ? `${color}${level}` : level;
  }
  private formatContext(context: string) {
    const value = context;
    return WITH_COLOR ? `${BOLD}${value}${RESET}` : value;
  }
  private formatMs(ms: number) {
    const value = `+${ms}ms`;
    return WITH_COLOR ? `${BRIGHT}${BLUE}${value}${RESET}` : value;
  }
}
