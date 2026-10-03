import { Rule, SchematicContext, SchematicsException, Tree, chain } from '@angular-devkit/schematics';
import { addRootProvider, readWorkspace, updateWorkspace } from '@schematics/angular/utility';

export interface NgAddOptions {
  project?: string;
  icons: 'core' | 'all';
  motion: 'system' | 'reduce';
}

const STYLE = 'node_modules/@airiona/ui/styles/airiona.css';

async function resolveProject(tree: Tree, name?: string): Promise<string> {
  const workspace = await readWorkspace(tree);
  if (name && workspace.projects.has(name)) return name;
  for (const [key, project] of workspace.projects) {
    if (project.extensions['projectType'] === 'application') return key;
  }
  throw new SchematicsException('No Angular application found. Pass --project=<name>.');
}

function addStylesheet(project: string): Rule {
  return updateWorkspace((workspace) => {
    const target = workspace.projects.get(project)?.targets.get('build');
    if (!target) throw new SchematicsException(`Project "${project}" has no build target.`);
    const options = (target.options ??= {}) as Record<string, unknown>;
    const styles = (options['styles'] as Array<string | { input: string }> | undefined) ?? [];
    const has = styles.some((s) => (typeof s === 'string' ? s : s.input) === STYLE);
    if (!has) options['styles'] = [STYLE, ...styles];
  });
}

export function ngAdd(options: NgAddOptions): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const project = await resolveProject(tree, options.project);
    context.logger.info(`Setting up Airiona in "${project}".`);
    return chain([
      addStylesheet(project),
      addRootProvider(project, ({ code, external }) => {
        const parts: string[] = [];
        if (options.icons === 'all') parts.push(`icons: [${external('AR_ALL_ICONS', '@airiona/ui/icons')}]`);
        if (options.motion === 'reduce') parts.push(`motion: 'reduce'`);
        const config = parts.length ? `{ ${parts.join(', ')} }` : '';
        return code`${external('provideAiriona', '@airiona/ui')}(${config})`;
      }),
      () => context.logger.info('Done. Use components from "@airiona/ui", e.g. <button arButton>Book now</button>.'),
    ]);
  };
}
