import { FC, ReactNode } from 'react'
import styled from 'styled-components'
import {
  CSExportButton,
  CSSExportButton,
  SCSSExportButton,
  TokenExportButton,
  XAMLExportButton,
} from './Export'

export const Help: FC = () => (
  <Wrapper>
    <Export />
    <Hotkeys />
  </Wrapper>
)

const Export: FC = () => (
  <Section>
    <h3>Exports</h3>

    <p>
      <b>Figma.</b> Install{' '}
      <Link href="https://www.figma.com/community/plugin/843461159747178978/Figma-Tokens">
        Figma Tokens
      </Link>
      . Run the plugin and open JSON tab. Copy tokens and paste there.
    </p>
    <p>
      <TokenExportButton />
    </p>
    <p>
      <CSSExportButton />
    </p>
    <p>
      <SCSSExportButton />
    </p>
    <p>
      <XAMLExportButton />
    </p>
    <p>
      <CSExportButton />
    </p>
  </Section>
)

const Hotkeys = () => {
  return (
    <Section>
      <h3>Hotkeys</h3>
      <List role="list">
        <li>
          <Key>1</Key> - <Key>9</Key> — switch palette
        </li>
        <li>
          <Key>↑</Key> <Key>↓</Key> <Key>→</Key> <Key>←</Key> — select another
          color
        </li>
        <li>
          <Key meta /> + <Key>↑</Key> <Key>↓</Key> <Key>→</Key> <Key>←</Key> —
          move rows and columns
        </li>
        <li>
          <Key meta /> + <Key>⇧</Key> + <Key>↑</Key> <Key>↓</Key> <Key>→</Key>{' '}
          <Key>←</Key> — duplicate rows and columns
        </li>
        <li>
          <Key>L</Key> + <Key>↑</Key> <Key>↓</Key> — change lightness of
          selected color
        </li>
        <li>
          <Key>C</Key> + <Key>↑</Key> <Key>↓</Key> — change chroma of selected
          color
        </li>
        <li>
          <Key>H</Key> + <Key>↑</Key> <Key>↓</Key> — change hue of selected
          color
        </li>
        <li>
          <Key meta /> + <Key>C</Key> — copy selected color as hex.
        </li>
        <li>
          <Key meta /> + <Key>⇧</Key> + <Key>C</Key> — copy selected color in{' '}
          <Code>lch()</Code> format. Note that it has limited{' '}
          <Link href="https://caniuse.com/css-lch-lab">browser support</Link>.
        </li>
        <li>
          <Key meta /> + <Key>V</Key> — paste color. Just copy color in any
          format and paste it here.
        </li>
        <li>
          Hold <Key>B</Key> — preview palette in greys.
        </li>
      </List>
    </Section>
  )
}

const Wrapper = styled.div`
  margin-top: 24px;
`

const Section = styled.section`
  font-size: 16px;
  margin-bottom: 24px;

  p {
    max-width: 60ch;
    margin-top: 12px;
  }
`

const List = styled.ul`
  padding-left: 0;
  & > li {
    margin-top: 12px;
  }
  & > li:first-child {
    margin-top: 0;
  }
`

interface KeyProps {
  children?: ReactNode
  meta?: boolean
}

export const Key = ({ children, meta }: KeyProps) => {
  if (meta === true) {
    const isWin = navigator.platform.toUpperCase().indexOf('WIN') >= 0

    if (isWin) {
      return <Key>Ctrl</Key>
    } else {
      return <Key>⌘</Key>
    }
  }

  return (
    <span className="inline-flex place-content-center p-0.5 text-sm min-w-[3ch] text-center rounded bg-zinc-200 dark:bg-zinc-800">
      {children}
    </span>
  )
}

const Link = styled.a`
  color: inherit;
  text-decoration-color: var(--c-text-secondary);
  :hover {
    color: var(--c-text-primary);
    text-decoration: none;
  }
`

const Code = styled.code`
  /* background-color: #eee; */
  border: 1px solid var(--c-divider);
  border-radius: var(--radius-m);
  font-family: courier, monospace;
  padding: 0 3px;
`
