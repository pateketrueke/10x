export function parseGherkin(source) {
  const lines = String(source || '').split('\n');
  const feature = {
    name: '',
    steps: null,
    component: null,
    scenarios: [],
  };
  
  let currentScenario = null;
  let inScenario = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    if (trimmed.startsWith('Feature:')) {
      feature.name = trimmed.slice(8).trim();
      continue;
    }
    
    if (trimmed.startsWith('@steps')) {
      const match = trimmed.match(/@steps\s+"([^"]+)"/);
      if (match) feature.steps = match[1];
      continue;
    }
    
    if (trimmed.startsWith('@component')) {
      const match = trimmed.match(/@component\s+"([^"]+)"/);
      if (match) feature.component = match[1];
      continue;
    }
    
    if (trimmed.startsWith('Scenario:')) {
      if (currentScenario) {
        feature.scenarios.push(currentScenario);
      }
      currentScenario = {
        name: trimmed.slice(9).trim(),
        steps: [],
      };
      inScenario = true;
      continue;
    }
    
    if (inScenario && currentScenario) {
      if (trimmed.startsWith('Given ')) {
        currentScenario.steps.push({
          type: 'given',
          text: trimmed.slice(6).trim(),
        });
      } else if (trimmed.startsWith('When ')) {
        currentScenario.steps.push({
          type: 'when',
          text: trimmed.slice(5).trim(),
        });
      } else if (trimmed.startsWith('Then ')) {
        currentScenario.steps.push({
          type: 'then',
          text: trimmed.slice(5).trim(),
        });
      } else if (trimmed.startsWith('And ')) {
        const prevStep = currentScenario.steps[currentScenario.steps.length - 1];
        if (prevStep) {
          currentScenario.steps.push({
            type: prevStep.type,
            text: trimmed.slice(4).trim(),
          });
        }
      }
    }
  }
  
  if (currentScenario) {
    feature.scenarios.push(currentScenario);
  }
  
  return feature;
}

export function parseStepDefinitions(source) {
  const lines = String(source || '').split('\n');
  const steps = {
    before_all: null,
    before_each: null,
    after_all: null,
    after_each: null,
    definitions: [],
  };
  
  let currentDef = null;
  let blockLines = [];
  let inBlock = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('import ')) continue;
    
    if (trimmed.startsWith('@before_all')) {
      steps.before_all = { type: 'hook', name: 'before_all', body: [] };
      currentDef = steps.before_all;
      inBlock = true;
      blockLines = [];
      continue;
    }
    
    if (trimmed.startsWith('@before_each')) {
      steps.before_each = { type: 'hook', name: 'before_each', body: [] };
      currentDef = steps.before_each;
      inBlock = true;
      blockLines = [];
      continue;
    }
    
    if (trimmed.startsWith('@after_all')) {
      steps.after_all = { type: 'hook', name: 'after_all', body: [] };
      currentDef = steps.after_all;
      inBlock = true;
      blockLines = [];
      continue;
    }
    
    if (trimmed.startsWith('@after_each')) {
      steps.after_each = { type: 'hook', name: 'after_each', body: [] };
      currentDef = steps.after_each;
      inBlock = true;
      blockLines = [];
      continue;
    }
    
    if (trimmed.startsWith('Given "')) {
      const match = trimmed.match(/Given\s+"([^"]+)"\s*(\([^)]*\))?\s*=>/);
      if (match) {
        currentDef = {
          type: 'given',
          pattern: match[1],
          params: match[2] ? match[2].slice(1, -1).split(',').map(s => s.trim()).filter(Boolean) : [],
          body: [],
        };
        steps.definitions.push(currentDef);
        inBlock = true;
        blockLines = [];
      }
      continue;
    }
    
    if (trimmed.startsWith('When "')) {
      const match = trimmed.match(/When\s+"([^"]+)"\s*(\([^)]*\))?\s*=>/);
      if (match) {
        currentDef = {
          type: 'when',
          pattern: match[1],
          params: match[2] ? match[2].slice(1, -1).split(',').map(s => s.trim()).filter(Boolean) : [],
          body: [],
        };
        steps.definitions.push(currentDef);
        inBlock = true;
        blockLines = [];
      }
      continue;
    }
    
    if (trimmed.startsWith('Then "')) {
      const match = trimmed.match(/Then\s+"([^"]+)"\s*(\([^)]*\))?\s*=>/);
      if (match) {
        currentDef = {
          type: 'then',
          pattern: match[1],
          params: match[2] ? match[2].slice(1, -1).split(',').map(s => s.trim()).filter(Boolean) : [],
          body: [],
        };
        steps.definitions.push(currentDef);
        inBlock = true;
        blockLines = [];
      }
      continue;
    }
    
    if (inBlock && currentDef) {
      if (trimmed.endsWith('.')) {
        blockLines.push(trimmed);
        currentDef.body = blockLines;
        inBlock = false;
        currentDef = null;
        blockLines = [];
      } else {
        blockLines.push(trimmed);
      }
    }
  }
  
  return steps;
}

export function stepPatternToKey(type, pattern) {
  const key = pattern
    .replace(/\{[^}]+\}/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  return `${type}_${key}`;
}

export function compileStepDefinitions(steps) {
  const lines = [];
  
  lines.push(`import { mount, click, expect } from '10x/testing';`);
  lines.push(`import { signal, effect, html } from '10x/core';`);
  lines.push('');
  
  if (steps.before_all) {
    lines.push(`export const before_all = async () => {`);
    lines.push(`  ${steps.before_all.body.join('\n  ')}`);
    lines.push(`};`);
    lines.push('');
  }
  
  if (steps.before_each) {
    lines.push(`export const before_each = async () => {`);
    lines.push(`  ${steps.before_each.body.join('\n  ')}`);
    lines.push(`};`);
    lines.push('');
  }
  
  for (const def of steps.definitions) {
    const key = stepPatternToKey(def.type, def.pattern);
    const params = def.params.length ? def.params.join(', ') : '';
    
    lines.push(`export const ${key} = async (${params}) => {`);
    lines.push(`  ${def.body.join('\n  ')}`);
    lines.push(`};`);
    lines.push('');
  }
  
  return lines.join('\n');
}

export function compileFeature(feature, stepsModule, componentModule) {
  const lines = [];
  
  lines.push(`import { test, describe, beforeAll, beforeEach } from 'bun:test';`);
  lines.push(`import { mount, click, expect } from '10x/testing';`);
  
  if (componentModule) {
    const componentName = componentModule.replace(/\.md$/, '').split('/').pop();
    const capitalizedName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
    lines.push(`import ${capitalizedName} from ${JSON.stringify(componentModule)};`);
  }
  
  if (stepsModule) {
    lines.push(`import * as steps from ${JSON.stringify(stepsModule)};`);
  }
  
  lines.push('');
  lines.push(`describe(${JSON.stringify(feature.name)}, () => {`);
  
  if (stepsModule) {
    lines.push(`  if (steps.before_all) beforeAll(steps.before_all);`);
    lines.push(`  if (steps.before_each) beforeEach(steps.before_each);`);
  }
  
  for (const scenario of feature.scenarios) {
    lines.push('');
    lines.push(`  test(${JSON.stringify(scenario.name)}, async () => {`);
    
    for (const step of scenario.steps) {
      const stepKey = `${step.type}_${step.text.replace(/\{[^}]+\}/g, '_').replace(/[^a-zA-Z0-9_]/g, '_')}`;
      lines.push(`    await steps[${JSON.stringify(stepKey)}]?.();`);
    }
    
    lines.push(`  });`);
  }
  
  lines.push('});');
  
  return lines.join('\n');
}
