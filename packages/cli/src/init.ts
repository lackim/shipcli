export interface InitCommandOptions {
  description?: string;
  git: boolean;
  install: boolean;
}

export function createInitArgs(name: string | undefined, options: InitCommandOptions): string[] {
  const args = ["@shipcli/create"];
  if (name) args.push(name);
  if (options.description) args.push("--description", options.description);
  if (!options.git) args.push("--no-git");
  if (!options.install) args.push("--no-install");
  return args;
}
