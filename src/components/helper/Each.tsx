import { Children, ReactNode } from "react";

type EachProps<T> = {
  of: T[];
  render: (item: T, index: number) => ReactNode;
};

const Each = <T,>({ render, of }: EachProps<T>): any =>
  Children.toArray(of.map((item, index) => render(item, index)));

export default Each;
