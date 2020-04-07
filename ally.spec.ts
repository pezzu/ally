import * as ally from './ally';

const mappings = {
  "foo": {
    "executable": "C:\\Path\\To\\FOO\\foo.exe",
    "aliales": {
      "log": "log -n",
      "glog -l": "glog -n",
      "st -q": "st -uno"
    }
  },
 
  "bar": {
    "executable": "C:\\Path\\To\\BAR\\bar.exe",
    "aliases": {
      "add -v": "add",
      "glog": "log"
    }
  }
};

describe('Updates command line according to specified mappings', () => { 
  it('Set correct executable', () => { 
    expect(ally.convertCommandLine(['foo'], mappings)).toEqual(['C:\\Path\\To\\FOO\\foo.exe']);
  });
  
  it('Adds missing new param', () => {
    expect(ally.convertCommandLine(['foo', 'log'], mappings)).toEqual(['C:\\Path\\To\\FOO\\foo.exe', 'log', '-n']);
  });

  it('Does not add param if it already exists', () => { 
    expect(ally.convertCommandLine(['foo', 'log', '-n'], mappings)).toEqual(['C:\\Path\\To\\FOO\\foo.exe', 'log', '-n']);
  });

  it('Removes ambigous param', () => { 
    expect(ally.convertCommandLine(['bar', 'add', '-v'], mappings)).toEqual(['C:\\Path\\To\\BAR\\bar.exe', 'add']);
  });

  it('Replaces params according to mappings', () => { 
    expect(ally.convertCommandLine(['foo', 'log', '-l'], mappings)).toEqual(['C:\\Path\\To\\FOO\\foo.exe', 'log', '-n']);
    expect(ally.convertCommandLine(['bar', 'glog'], mappings)).toEqual(['C:\\Path\\To\\BAR\\bar.exe', 'log']);
  });

  it('Leaves other params intact', () => {
    expect(ally.convertCommandLine(['foo', 'test'], mappings)).toEqual(['C:\\Path\\To\\FOO\\foo.exe', 'test']);
  });

});