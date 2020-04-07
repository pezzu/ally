import { spawn } from 'child_process';

export const convertCommandLine = (argv: string[], aliases): string[] => {
  return [];
}

// export const getParams = (cmdLine: string): string[] => {
//   return [];
// }

if (!module.parent) {
  main();
}

function main(): void {
  console.log('Hello world');
}
