import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { store } from '../lib/store';
import { Summary } from './Summary';

beforeEach(() => {
  store.clear();
});

describe('Summary tests', () => {
  test('Basics', async () => {
    render(
      <Summary
        entries={`
          1999-12-31 23:00
          OH-7 2h
          2000-01-01 01:00
          OH-4
          2000-01-01 05:00
          OH-7 5h
          2000-01-01 10:00
          A-25
          2000-01-01 12:30
          A-35
        `}
        now={`
          2000-01-01 16:00
        `.trim()}
      />,
    );
    expect(screen.getByTestId('summary').innerHTML).toMatchInlineSnapshot(`
      "By ticket:
      OH-7: 7h0m
      OH-4: 4h0m
      A-25: 2h30m
      A-35: 3h30m

      By project:
      OH: 11h0m
      A: 6h0m

      Total: 17h0m"
    `);
  });

  test('Empty on error', async () => {
    render(
      <Summary
        entries={`
          2000-01-01 10:0
          OH-1
        `}
        now={`
          2000-01-01 16:00
        `.trim()}
      />,
    );
    expect(screen.getByTestId('summary').innerHTML).toMatchInlineSnapshot('""');
  });

  test('Allows empty', async () => {
    render(
      <Summary
        entries={`
          2000-01-01 10:00
          A-1
          2000-01-01 10:00
          A-2
          2000-01-01 10:00
          A-3
        `}
        now={`
          2000-01-01 16:00
        `.trim()}
      />,
    );
    expect(screen.getByTestId('summary').innerHTML).toMatchInlineSnapshot(`
      "By ticket:
      A-1: 0m
      A-2: 0m
      A-3: 6h0m

      By project:
      A: 6h0m

      Total: 6h0m"
    `);
  });
});
