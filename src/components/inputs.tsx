import { MouseEventHandler, ReactNode } from 'react'
import styled from 'styled-components'

interface ButtonProps {
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
  title?: string
}

export const Button = ({ children, onClick, title }: ButtonProps) => {
  return (
    <button
      className="flex px-4 py-2 text-red bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded"
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  )
}

export const InvisibleInput = styled.input`
  border: none;
  color: var(--c-text-secondary);
  padding: 0;
  background: transparent;
  transition: 100ms;

  :hover {
    color: var(--c-text-primary);
  }

  :focus {
    outline: none;
    color: var(--c-text-primary);
  }
`

export const Input = styled.input`
  border: 1px solid transparent;
  border-radius: var(--radius-m);
  color: var(--c-text-primary);
  background: var(--c-btn-bg);
  padding: 5px 8px;
  font-size: 14px;
  line-height: 20px;
  transition: 100ms;

  :focus {
    outline: none;
    border-color: var(--c-text-primary);
    color: var(--c-text-primary);
  }
`

export const TextArea = Input.withComponent('textarea')

export const ControlGroup = styled.div`
  display: flex;
  gap: 1px;
  & > * {
    border-radius: 0;
  }
  & > *:first-child {
    border-top-left-radius: var(--radius-m);
    border-bottom-left-radius: var(--radius-m);
  }
  & > *:last-child {
    border-top-right-radius: var(--radius-m);
    border-bottom-right-radius: var(--radius-m);
  }
`
