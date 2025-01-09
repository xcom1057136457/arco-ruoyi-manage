export interface IServer {
  cpu: ICpu
  mem: IMem
  jvm: IJvm
  sys: ISys
  sysFiles: any[]
}

export interface ICpu {
  cpuNum?: any
  used?: any
  sys?: any
  free?: any
}

export interface IMem {
  total?: any
  used?: any
  free?: any
  usage?: any
}

export interface IJvm {
  total?: any
  used?: any
  free?: any
  usage?: any
  name?: any
  version?: any
  startTime?: any
  runTime?: any
  home?: any
  inputArgs?: any
}

export interface ISys {
  computerName?: any
  osName?: any
  computerIp?: any
  osArch?: any
  userDir?: any
}
