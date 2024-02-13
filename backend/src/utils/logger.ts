export default class Logger {
    public static info = (args: any) => {
      console.log(`[${new Date().toLocaleString()}] [INFO] ${args}`);
    };
  
    public static error = (args: any) => {
      console.log(`[${new Date().toLocaleString()}] [ERROR] ${args}`);
    };
  }
  