import { spawn } from 'child_process';
import { parse } from 'path';
import {readFileSync} from 'fs';

const containsSequence = (master: any[], sub: any[]): boolean => sub.every((i => v => i = master.indexOf(v, i) + 1)(0));

const replaceSequence = (array: any[], oldSeq: any[], newSeq: any[]): any[] => {
  const position = array.indexOf(oldSeq[0]);
  array = array.filter(item => !oldSeq.includes(item));
  array.splice(position, 0, ...newSeq);
  return array;
}
 
const getExeName = ():string => {
  return parse(__filename).name;
}

const readSettingsFromConfig = (command: string): Object => {
  const configFileName = `ally.config.json`;
  let config;
  try {
    config = JSON.parse(readFileSync(configFileName, 'utf8'));
  }
  catch (e) {
    console.error(`Problem reading or parsing ${configFileName}: `, e);
    process.exit(1);
  }

  if (!config[command]) {
    console.error(`No configuration is found for ${command} in ${configFileName}`);
    process.exit(1)
  }

  return config[command];
}

const requiresUpdate = (cmdLine: string[], oldParams: string[], newParams: string[]): boolean => {
  return (containsSequence(cmdLine, oldParams) && (!containsSequence(cmdLine, newParams) || (oldParams.length > newParams.length)));
}

const replaceParam = (cmdLine: string[], oldParams: string[], newParams: string[]): string[] => {
  if (requiresUpdate(cmdLine, oldParams, newParams)) {
    cmdLine = replaceSequence(cmdLine, oldParams, newParams);  
  }
  
  return cmdLine;
}
  
const replaceParams = (params: string[], aliases): string[] => {
  return Object.entries(aliases).reduce((p, [cmd, alias]: [string, string]) => replaceParam(p, cmd.split(' '), alias.split(' ')), params);
}

export const convertCommandLine = (argv: string[], options): string[] => {
  return [options.executable, ...replaceParams(argv.slice(1), options.aliases)];
}

const runCommand = (argv: string[]): void => {
  spawn(argv[0], argv.slice(1), { shell: true, stdio: 'inherit' });
}

function main(): void {
  const exe = getExeName();
  const options = readSettingsFromConfig(exe);
  
  const cmd = convertCommandLine(process.argv.slice(1), options);

  runCommand(cmd);
}

if (!module.parent) {
  main();
}
