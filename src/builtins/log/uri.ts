import { DataFactory } from 'n3';
import type { Binding } from '../../BindUtil';
import type { BuiltinBindFn, BuiltinCallOptions, BuiltinCheckFn, BuiltinImplementation } from '../../BuiltinUtil';

// Gets as object the string representation of the subject URI.
// true if and only if $o is the string representation of $s.
//  $s? log:uri $o?
// where:
// $s: (a URI)
// $o: xsd:string
const check: BuiltinCheckFn = ({ quad }: BuiltinCallOptions): boolean | undefined => {
  if (quad.subject.termType === 'BlankNode' || quad.object.termType === 'BlankNode') {
    return undefined;
  }
  else if (quad.subject.termType === 'NamedNode' && quad.object.termType === 'Literal') {
    return quad.subject.value === quad.object.value;
  }
  else {
    return false;
  }
};

const bind: BuiltinBindFn = ({ quad }: BuiltinCallOptions): Binding | undefined => {
    if (quad.subject.termType === 'BlankNode' && quad.object.termType === 'Literal') {
        return { [quad.subject.value]: DataFactory.namedNode(quad.object.value) };
    }
    else if (quad.subject.termType === 'NamedNode' && quad.object.termType === 'BlankNode') {
        return { [quad.object.value]: DataFactory.literal(quad.subject.value) };
    }
    else {
        return undefined;
    }
};

export default {
  predicate: 'http://www.w3.org/2000/10/swap/log#uri',
  check,
  bind,
} satisfies BuiltinImplementation;
