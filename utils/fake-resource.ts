// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type FakeResource = {
  readonly name: string;
  readonly getName: () => string;
};

export const FakeResourceBuilder = (name: string): FakeResource => ({
  getName: (): string => name,
  name
});
