const SPACE_SCALE = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  px: '1px',
  auto: 'auto',
};

const OPACITY_SCALE = {
  0: '0',
  50: '0.5',
  100: '1',
};

const COLORS = {
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  current: 'currentColor',
  'gray-100': '#f3f4f6',
  'gray-200': '#e5e7eb',
  'gray-300': '#d1d5db',
  'gray-400': '#9ca3af',
  'gray-500': '#6b7280',
  'gray-600': '#4b5563',
  'gray-700': '#374151',
  'gray-800': '#1f2937',
  'gray-900': '#111827',
  'blue-100': '#dbeafe',
  'blue-500': '#3b82f6',
  'blue-600': '#2563eb',
  'blue-700': '#1d4ed8',
  'red-500': '#ef4444',
  'red-600': '#dc2626',
  'green-500': '#22c55e',
  'green-600': '#16a34a',
  'yellow-500': '#eab308',
  'purple-500': '#a855f7',
  'pink-500': '#ec4899',
};

const STATIC_RULES = {
  flex: 'display:flex',
  grid: 'display:grid',
  block: 'display:block',
  inline: 'display:inline',
  'inline-flex': 'display:inline-flex',
  'inline-block': 'display:inline-block',
  hidden: 'display:none',
  'flex-col': 'flex-direction:column',
  'flex-row': 'flex-direction:row',
  'flex-wrap': 'flex-wrap:wrap',
  'flex-1': 'flex:1 1 0%',
  'flex-auto': 'flex:1 1 auto',
  'flex-none': 'flex:none',
  'items-start': 'align-items:flex-start',
  'items-center': 'align-items:center',
  'items-end': 'align-items:flex-end',
  'items-stretch': 'align-items:stretch',
  'justify-start': 'justify-content:flex-start',
  'justify-center': 'justify-content:center',
  'justify-end': 'justify-content:flex-end',
  'justify-between': 'justify-content:space-between',
  'justify-around': 'justify-content:space-around',
  'w-full': 'width:100%',
  'w-screen': 'width:100vw',
  'w-auto': 'width:auto',
  'h-full': 'height:100%',
  'h-screen': 'height:100vh',
  'h-auto': 'height:auto',
  'min-w-0': 'min-width:0',
  'min-h-0': 'min-height:0',
  'text-xs': 'font-size:0.75rem;line-height:1rem',
  'text-sm': 'font-size:0.875rem;line-height:1.25rem',
  'text-base': 'font-size:1rem;line-height:1.5rem',
  'text-lg': 'font-size:1.125rem;line-height:1.75rem',
  'text-xl': 'font-size:1.25rem;line-height:1.75rem',
  'text-2xl': 'font-size:1.5rem;line-height:2rem',
  'text-3xl': 'font-size:1.875rem;line-height:2.25rem',
  'text-4xl': 'font-size:2.25rem;line-height:2.5rem',
  'font-light': 'font-weight:300',
  'font-normal': 'font-weight:400',
  'font-medium': 'font-weight:500',
  'font-semibold': 'font-weight:600',
  'font-bold': 'font-weight:700',
  'text-left': 'text-align:left',
  'text-center': 'text-align:center',
  'text-right': 'text-align:right',
  uppercase: 'text-transform:uppercase',
  lowercase: 'text-transform:lowercase',
  capitalize: 'text-transform:capitalize',
  truncate: 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap',
  border: 'border-width:1px;border-style:solid',
  'border-0': 'border-width:0',
  'border-t': 'border-top-width:1px;border-top-style:solid',
  'border-b': 'border-bottom-width:1px;border-bottom-style:solid',
  rounded: 'border-radius:0.25rem',
  'rounded-md': 'border-radius:0.375rem',
  'rounded-lg': 'border-radius:0.5rem',
  'rounded-xl': 'border-radius:0.75rem',
  'rounded-full': 'border-radius:9999px',
  'rounded-none': 'border-radius:0',
  shadow: 'box-shadow:0 1px 3px rgba(0,0,0,0.1),0 1px 2px rgba(0,0,0,0.06)',
  'shadow-md': 'box-shadow:0 4px 6px rgba(0,0,0,0.1),0 2px 4px rgba(0,0,0,0.06)',
  'shadow-lg': 'box-shadow:0 10px 15px rgba(0,0,0,0.1),0 4px 6px rgba(0,0,0,0.05)',
  'shadow-none': 'box-shadow:none',
  relative: 'position:relative',
  absolute: 'position:absolute',
  fixed: 'position:fixed',
  sticky: 'position:sticky',
  'inset-0': 'top:0;right:0;bottom:0;left:0',
  'overflow-hidden': 'overflow:hidden',
  'overflow-auto': 'overflow:auto',
  'overflow-scroll': 'overflow:scroll',
  'cursor-pointer': 'cursor:pointer',
  'cursor-default': 'cursor:default',
  'select-none': 'user-select:none',
  'pointer-events-none': 'pointer-events:none',
  'box-border': 'box-sizing:border-box',
  'sr-only': 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0',
};

function escapeClassName(value) {
  return String(value).replace(/\//g, '\\/');
}

function makeRule(className, declaration) {
  return `.${escapeClassName(className)}{${declaration}}`;
}

function resolveSpaceDeclaration(kind, axis, value) {
  if (!Object.prototype.hasOwnProperty.call(SPACE_SCALE, value)) return null;

  const cssValue = SPACE_SCALE[value];
  const longhand = kind === 'p'
    ? ['padding']
    : kind === 'm'
      ? ['margin']
      : ['gap'];

  if (kind === 'gap') {
    if (!axis) return `gap:${cssValue}`;
    if (axis === 'x') return `column-gap:${cssValue}`;
    if (axis === 'y') return `row-gap:${cssValue}`;
    return null;
  }

  if (!axis) return `${longhand[0]}:${cssValue}`;

  const map = {
    x: [`${longhand[0]}-left`, `${longhand[0]}-right`],
    y: [`${longhand[0]}-top`, `${longhand[0]}-bottom`],
    t: [`${longhand[0]}-top`],
    r: [`${longhand[0]}-right`],
    b: [`${longhand[0]}-bottom`],
    l: [`${longhand[0]}-left`],
  };

  if (!map[axis]) return null;
  return map[axis].map(prop => `${prop}:${cssValue}`).join(';');
}

function resolveColorDeclaration(kind, colorName) {
  if (!Object.prototype.hasOwnProperty.call(COLORS, colorName)) return null;
  const value = COLORS[colorName];

  if (kind === 'text') return `color:${value}`;
  if (kind === 'bg') return `background-color:${value}`;
  if (kind === 'border') return `border-color:${value}`;
  return null;
}

export function atomicRule(className) {
  if (Object.prototype.hasOwnProperty.call(STATIC_RULES, className)) {
    return makeRule(className, STATIC_RULES[className]);
  }

  const opacity = /^opacity-(0|50|100)$/.exec(className);
  if (opacity) return makeRule(className, `opacity:${OPACITY_SCALE[opacity[1]]}`);

  const spacing = /^(p|m|gap)(x|y|t|r|b|l)?-(.+)$/.exec(className);
  if (spacing) {
    const declaration = resolveSpaceDeclaration(spacing[1], spacing[2], spacing[3]);
    if (declaration) return makeRule(className, declaration);
  }

  const color = /^(text|bg|border)-(.+)$/.exec(className);
  if (color) {
    const declaration = resolveColorDeclaration(color[1], color[2]);
    if (declaration) return makeRule(className, declaration);
  }

  return null;
}

export function generateAtomicCss(classSet) {
  if (!classSet || !classSet.size) return '';

  const css = [];
  classSet.forEach(className => {
    const rule = atomicRule(className);
    if (rule) css.push(rule);
  });

  return css.join('\n');
}
