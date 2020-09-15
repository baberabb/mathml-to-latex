import { MathMLTag } from './MathMLTag';
import { BracketWrapper } from '../../../../utils/wrappers';
import { InvalidNumberOfChild } from '../../../../errors';

export class MSubsup extends MathMLTag {
  constructor(value: string, attributes: Record<string, string>, children: MathMLTag[]) {
    super('msubsup', value, attributes, children);
  }

  convert(): string {
    if (this._children.length !== 3) throw new InvalidNumberOfChild(this._name, 2, this._children.length);

    const base = this._children[0].convert();
    const sub = this._children[1].convert();
    const sup = this._children[2].convert();

    const wrappedSub = new BracketWrapper().wrap(sub);
    const wrappedSup = new BracketWrapper().wrap(sup);

    return `${base}_${wrappedSub}^${wrappedSup}`;
  }
}