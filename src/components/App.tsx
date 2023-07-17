import { useStore } from '@nanostores/react'
import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { Scale } from './ColorGraph'
import { PaletteSwatches } from './PaletteSwatches'
import { setLchColor } from 'store/palette'
import { ExportField } from './Export'
import { ColorInfo } from './ColorInfo'
import { Help } from './Help'
import { KeyPressHandler } from './KeyPressHandler'
import { paletteStore } from 'store/palette'
import { selectedStore, setSelected } from 'store/currentPosition'
import { Header } from './Header'
import ColourBar from './ColourBar'
import ToneBar from './ToneBar'

const chartWidth = 500

export default function App() {
  const palette = useStore(paletteStore)
  const selected = useStore(selectedStore)

  const hueColors = useMemo(
    () => palette.colors.map(hue => hue[selected.toneId]),
    [palette.colors, selected.toneId]
  )

  return (
    <div className="h-full flex flex-col dark:text-zinc-200 dark:bg-zinc-900">
      <Header />
      <Wrapper>
        <KeyPressHandler />
        <PaletteSection>
          <PaletteSwatches />
          <ColorInfo />
          <ControlRow>
            <ExportField />
          </ControlRow>
        </PaletteSection>

        <div className="d-flex gap-4 p-8">
          <div className="grid grid-cols-2 gap-12">
            <ColourBar />
            <ToneBar />
          </div>
          <div>
            <div
              className="grid gap-4 my-8"
              style={{
                gridTemplateColumns: `${chartWidth}px 1rem ${chartWidth}px`,
              }}
            >
              <Scale
                width={chartWidth}
                selected={selected.toneId}
                channel="l"
                colors={palette.colors[selected.hueId]}
                onSelect={i => setSelected([selected.hueId, i])}
                onColorChange={(i, lch) => {
                  setSelected([selected.hueId, i])
                  setLchColor(lch, selected.hueId, i)
                }}
              />
              <ScaleIndicator axis="l" />
              <Scale
                width={chartWidth}
                selected={selected.hueId}
                channel="l"
                colors={hueColors}
                onSelect={i => setSelected([i, selected.toneId])}
                onColorChange={(i, lch) => {
                  setSelected([i, selected.toneId])
                  setLchColor(lch, i, selected.toneId)
                }}
              />
            </div>
          </div>
          <div>
            <div
              className="grid gap-4 my-8"
              style={{
                gridTemplateColumns: `${chartWidth}px 1rem ${chartWidth}px`,
              }}
            >
              <Scale
                width={chartWidth}
                selected={selected.toneId}
                channel="c"
                colors={palette.colors[selected.hueId]}
                onSelect={i => setSelected([selected.hueId, i])}
                onColorChange={(i, lch) => {
                  setSelected([selected.hueId, i])
                  setLchColor(lch, selected.hueId, i)
                }}
              />
              <ScaleIndicator axis="c" />
              <Scale
                width={chartWidth}
                selected={selected.hueId}
                channel="c"
                colors={hueColors}
                onSelect={i => setSelected([i, selected.toneId])}
                onColorChange={(i, lch) => {
                  setSelected([i, selected.toneId])
                  setLchColor(lch, i, selected.toneId)
                }}
              />
            </div>
          </div>

          <div>
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `${chartWidth}px 1rem ${chartWidth}px`,
              }}
            >
              <Scale
                width={chartWidth}
                selected={selected.toneId}
                channel="h"
                colors={palette.colors[selected.hueId]}
                onSelect={i => setSelected([selected.hueId, i])}
                onColorChange={(i, lch) => {
                  setSelected([selected.hueId, i])
                  setLchColor(lch, selected.hueId, i)
                }}
              />
              <ScaleIndicator axis="h" />
              <Scale
                width={chartWidth}
                selected={selected.hueId}
                channel="h"
                colors={hueColors}
                onSelect={i => setSelected([i, selected.toneId])}
                onColorChange={(i, lch) => {
                  setSelected([i, selected.toneId])
                  setLchColor(lch, i, selected.toneId)
                }}
              />
            </div>
          </div>
          <Help />
        </div>
      </Wrapper>
    </div>
  )
}

const Wrapper = styled.main`
  flex-grow: 1;
  min-height: 0;
  display: flex;
  @media (max-width: 860px) {
    flex-direction: column;
  }
`

const ControlRow = styled.main`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`
const PaletteSection = styled.section`
  width: min-content;
  overflow: auto;
  min-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
`

const Axis = styled.div`
  border-radius: 8px;
  width: 8px;
`
const AxisL = styled(Axis)`
  background: linear-gradient(#fff, #b9b9b9, #777, #3b3b3b, #000);
`
const AxisC = styled(Axis)`
  background: linear-gradient(
    #ff00ff,
    #f440f3,
    #ea58e7,
    #df69dc,
    #d377d0,
    #c783c4,
    #bb8db8,
    #ad97ac,
    #9f9f9f
  );
`
const AxisH = styled(Axis)`
  background: linear-gradient(
    #e183a1,
    #b093e5,
    #55aee8,
    #2fbda7,
    #9bb054,
    #db9152,
    #e183a1
  );
`

const axises = {
  l: <AxisL />,
  c: <AxisC />,
  h: <AxisH />,
}

const ScaleIndicator: FC<{ axis: 'l' | 'c' | 'h' }> = ({ axis }) => {
  return <div className="grid pt-20">{axises[axis]}</div>
}
