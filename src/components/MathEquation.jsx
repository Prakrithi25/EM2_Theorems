import { InlineMath, BlockMath } from 'react-katex'

function MathEquation({ equation, block = true }) {
  return block ? <BlockMath math={equation} /> : <InlineMath math={equation} />
}

export default MathEquation
