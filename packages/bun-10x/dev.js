#!/usr/bin/env bun
import { createDevServer } from './index.js';

const root = process.argv[2] || '.';
const port = parseInt(process.env.PORT || '3000');

createDevServer({ root, port });
