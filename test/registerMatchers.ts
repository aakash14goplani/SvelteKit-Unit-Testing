import matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';
import { toBeUnprocessableEntity } from '../src/matchers/toBeUnprocessableEntity';

expect.extend(matchers);

expect.extend({ toBeUnprocessableEntity });
