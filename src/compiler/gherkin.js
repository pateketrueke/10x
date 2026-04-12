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
