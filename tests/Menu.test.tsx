import React from 'react';
import { render, screen } from '@testing-library/react';
import Menu from '../src/components/Menu';

jest.mock('gatsby', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  )
}));

describe('Menu component', () => {
  test('renders menu button', () => {
    render(<Menu />);
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
  });
});
