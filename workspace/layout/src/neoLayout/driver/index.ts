export {
  ModelType,
  IMoveType
} from './cell';

export * from './event';

export {ILayout} from './container';

export type { ICell } from './cell';

const str = () =>
  (
    '00000000000000000' + (Math.random() * 0xffffffffffffffff).toString(16)
  ).slice(-16);

export const uuid = () => {
  const a = str();
  const b = str();
  return (
    a.slice(0, 8) +
    '-' +
    a.slice(8, 12) +
    '-4' +
    a.slice(13) +
    '-a' +
    b.slice(1, 4) +
    '-' +
    b.slice(4)
  );
};
