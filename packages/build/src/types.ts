export interface PackageJson {
  name: string;
  version: string;
  description?: string;
  license?: string;
  bin?: string | Record<string, string>;
  repository?: { url?: string } | string;
  shipcli?: { entrypoint?: string };
}

export type ExecFileRunner = (
  command: string,
  args: string[],
  options?: Record<string, unknown>,
) => unknown;
