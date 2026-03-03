#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';

const MUL = Symbol('MUL');
const PLUS = Symbol('PLUS');

function oldWalk(ops, expr, cb) {
  for (let i = 1, c = expr.length - 1; i < c; i++) {
    const op = expr[i];
    const left = expr[i - 1];
    const right = expr[i + 1];

    if (op && ops.indexOf(op.type) > -1) {
      expr.splice(i - 1, 3, cb(left, op, right));

      if (expr.length >= 3) {
        return oldWalk(ops, expr, cb);
      }
    }
  }

  return expr;
}

function newWalk(ops, expr, cb) {
  if (expr.length < 3) return expr;

  const output = [expr[0]];

  for (let i = 1, c = expr.length; i < c; i++) {
    const op = expr[i];

    if (op && ops.has(op.type) && i + 1 < c) {
      const left = output.pop();
      const right = expr[++i];

      output.push(cb(left, op, right));
    } else {
      output.push(op);
    }
  }

  return output;
}

function buildExpr(terms) {
  const expr = [];

  for (let i = 0; i < terms; i++) {
    expr.push({ type: 'num', value: i + 1 });

    if (i < terms - 1) {
      expr.push({
        type: i % 2 === 0 ? MUL : PLUS,
        value: i % 2 === 0 ? '*' : '+',
      });
    }
  }

  return expr;
}

function bench(label, fn, iterations) {
  const t0 = performance.now();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const t1 = performance.now();

  return {
    label,
    ms: Number((t1 - t0).toFixed(2)),
  };
}

function envArrayLookup(lookups, keys) {
  const items = [];

  for (let i = 0; i < keys; i++) {
    items.push(`k${i}`);
  }

  let hits = 0;
  const t0 = performance.now();

  for (let i = 0; i < lookups; i++) {
    if (items.includes(`k${i % keys}`)) {
      hits++;
    }
  }

  return {
    ms: Number((performance.now() - t0).toFixed(2)),
    hits,
  };
}

function envSetLookup(lookups, keys) {
  const items = new Set();

  for (let i = 0; i < keys; i++) {
    items.add(`k${i}`);
  }

  let hits = 0;
  const t0 = performance.now();

  for (let i = 0; i < lookups; i++) {
    if (items.has(`k${i % keys}`)) {
      hits++;
    }
  }

  return {
    ms: Number((performance.now() - t0).toFixed(2)),
    hits,
  };
}

function ratio(before, after) {
  if (!after) return null;
  return Number((before / after).toFixed(2));
}

function changePct(base, current) {
  if (!base) return null;
  return Number((((current - base) / base) * 100).toFixed(2));
}

const terms = Number(process.env.BENCH_TERMS || 2000);
const iterations = Number(process.env.BENCH_ITERS || 400);
const lookups = Number(process.env.BENCH_LOOKUPS || 200000);
const keys = Number(process.env.BENCH_KEYS || 10000);

const oldOps = [MUL, PLUS];
const newOps = new Set([MUL, PLUS]);
const cb = () => ({ type: 'num', value: 1 });

const walkOld = bench('oldWalk', () => oldWalk(oldOps, buildExpr(terms), cb), iterations);
const walkNew = bench('newWalk', () => newWalk(newOps, buildExpr(terms), cb), iterations);

const envOld = envArrayLookup(lookups, keys);
const envNew = envSetLookup(lookups, keys);

const result = {
  meta: {
    timestamp: new Date().toISOString(),
    runtime: process.version,
    terms,
    iterations,
    lookups,
    keys,
  },
  walk: {
    old_ms: walkOld.ms,
    new_ms: walkNew.ms,
    speedup: ratio(walkOld.ms, walkNew.ms),
  },
  env_resolved_lookup: {
    array_includes_ms: envOld.ms,
    set_has_ms: envNew.ms,
    speedup: ratio(envOld.ms, envNew.ms),
  },
};

const comparePath = process.argv.includes('--compare')
  ? (process.argv[process.argv.indexOf('--compare') + 1] || 'bench/plan05-baseline.json')
  : null;

if (comparePath) {
  try {
    const baseline = JSON.parse(readFileSync(comparePath, 'utf8'));
    result.comparison = {
      baseline: comparePath,
      walk_old_ms_change_pct: changePct(baseline.walk.old_ms, result.walk.old_ms),
      walk_new_ms_change_pct: changePct(baseline.walk.new_ms, result.walk.new_ms),
      env_array_ms_change_pct: changePct(
        baseline.env_resolved_lookup.array_includes_ms,
        result.env_resolved_lookup.array_includes_ms,
      ),
      env_set_ms_change_pct: changePct(
        baseline.env_resolved_lookup.set_has_ms,
        result.env_resolved_lookup.set_has_ms,
      ),
    };
  } catch (error) {
    result.comparison = {
      baseline: comparePath,
      error: error.message,
    };
  }
}

const savePath = process.argv.includes('--save')
  ? (process.argv[process.argv.indexOf('--save') + 1] || 'bench/results/latest.json')
  : null;

if (savePath) {
  writeFileSync(savePath, JSON.stringify(result, null, 2) + '\n');
}

console.log(JSON.stringify(result, null, 2));
