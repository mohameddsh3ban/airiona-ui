import { DemoDef } from './demo';
import { CORE_DEMOS } from './core.demos';
import { MOTION_DEMOS } from './motion.demos';
import { A_DEMOS } from './a.demos';
import { B_DEMOS } from './b.demos';
import { C_DEMOS } from './c.demos';
import { D_DEMOS } from './d.demos';
import { E_DEMOS } from './e.demos';
import { F_DEMOS } from './f.demos';
import { G_DEMOS } from './g.demos';
import { INTEGRATION_DEMOS } from './integration.demos';

const GROUPS = ['Primitives', 'Actions', 'Forms', 'Overlays', 'Status', 'Identity', 'Booking', 'Data', 'Dashboard', 'Analytics', 'Widgets', 'Workspace', 'Navigation', 'Screens', 'Motion', 'Mobile navigation', 'Mobile inputs', 'Mobile content', 'Mobile onboarding'];
const rank = (g: string) => (GROUPS.indexOf(g) < 0 ? 99 : GROUPS.indexOf(g));

export const DEMOS: DemoDef[] = [...CORE_DEMOS, ...MOTION_DEMOS, ...A_DEMOS, ...B_DEMOS, ...C_DEMOS, ...D_DEMOS, ...E_DEMOS, ...F_DEMOS, ...G_DEMOS, ...INTEGRATION_DEMOS]
  .map((d, i) => ({ d, i }))
  .sort((x, y) => rank(x.d.group) - rank(y.d.group) || x.i - y.i)
  .map((x) => x.d);
