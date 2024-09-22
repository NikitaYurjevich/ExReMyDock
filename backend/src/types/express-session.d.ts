import 'express-session';

declare module 'express-session' {
  export interface SessionData {
    user?: {
      id: string;
      name: string;
    };
  }
}
