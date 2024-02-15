import React from 'react';
import { render, screen } from '@testing-library/react';
import { Todo } from './List';

it('renders welcome message', () => {
  const todo = {
    text: "Deze todo is sucesvol gerenderd",
    done: true
  }
  render(<Todo todo={todo} />);
  expect(screen.getByText('Deze todo is sucesvol gerenderd')).toBeInTheDocument();
  expect(screen.getByText('This todo is done')).toBeInTheDocument();
  expect(screen.getByText('Delete')).toBeInTheDocument();
})