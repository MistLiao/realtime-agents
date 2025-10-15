import { greeterAgent } from './greeter';
import { rogAgent } from './rog';
import { phoneAgent } from './phone';
import { translateAgent } from './translate';

// Cast to `any` to satisfy TypeScript until the core types make RealtimeAgent
// assignable to `Agent<unknown>` (current library versions are invariant on
// the context type).
(rogAgent.handoffs as any).push(phoneAgent, greeterAgent);
(phoneAgent.handoffs as any).push(rogAgent, greeterAgent);
(greeterAgent.handoffs as any).push(rogAgent, phoneAgent, translateAgent);
(translateAgent.handoffs as any).push(greeterAgent);

export const customerServiceAsusScenario = [
  greeterAgent,
  rogAgent,
  phoneAgent,
  translateAgent,
];