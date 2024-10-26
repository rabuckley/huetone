import React, { FC, useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { useStore } from '@nanostores/react'
import {
  exportToHexPalette,
  exportToTokens,
  parseHexPalette,
} from 'store/palette'
import {
  exportToCS,
  exportToCSS,
  exportToSCSS,
  exportToXAML,
} from 'store/palette/converters'
import { paletteStore, setPalette } from 'store/palette'
import { TextArea } from './inputs'
import { CopyButton } from './CopyButton'

export const TokenExportButton: FC = () => {
  const palette = useStore(paletteStore)
  return (
    <CopyButton
      getContent={() => {
        const tokens = exportToTokens(palette)
        return JSON.stringify(tokens, null, 2)
      }}
    >
      Copy tokens
    </CopyButton>
  )
}

export const CSSExportButton: FC = () => {
  const palette = useStore(paletteStore)
  return (
    <CopyButton getContent={() => exportToCSS(palette)}>
      Copy CSS variables
    </CopyButton>
  )
}

export const SCSSExportButton: FC = () => {
  const palette = useStore(paletteStore)
  return (
    <CopyButton getContent={() => exportToSCSS(palette)}>
      Copy SCSS variables
    </CopyButton>
  )
}

export const XAMLExportButton: FC = () => {
  const palette = useStore(paletteStore)
  return (
    <CopyButton getContent={() => exportToXAML(palette)}>
      Copy XAML definition
    </CopyButton>
  )
}

export const CSExportButton: FC = () => {
  const palette = useStore(paletteStore)
  return (
    <CopyButton getContent={() => exportToCS(palette)}>
      Copy C# definition
    </CopyButton>
  )
}

export const ExportField: FC = () => {
  const palette = useStore(paletteStore)
  const ref = useRef<any>()
  const [areaValue, setAreaValue] = useState('')
  const currentJSON = JSON.stringify(exportToHexPalette(palette), null, 2)

  useEffect(() => {
    if (document.activeElement !== ref.current) {
      const newPaletteJson = currentJSON
      setAreaValue(newPaletteJson)
    }
  }, [currentJSON])

  return (
    <JSONArea
      ref={ref}
      onBlur={() => setAreaValue(currentJSON)}
      value={areaValue}
      onFocus={onFocus}
      onChange={(e: { target: { value: any } }) => {
        const value = e.target.value
        setAreaValue(value)
        if (value) {
          try {
            const json = JSON.parse(value)
            const newPalette = parseHexPalette(json, palette.mode)
            setPalette(newPalette)
          } catch (error) {
            console.warn('Parsing error', error)
          }
        }
      }}
    />
  )
}

const JSONArea = styled(TextArea)`
  width: 100%;
  min-height: 120px;
  resize: none;
`
const onFocus = (e: { target: { select: () => any } }) => e.target.select()
