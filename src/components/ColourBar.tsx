import { useStore } from '@nanostores/react'
import { useCallback } from 'react'
import { getMostContrast } from 'shared/color'
import { useKeyPress } from 'shared/hooks/useKeyPress'
import { selectedStore, setSelected } from 'store/currentPosition'
import { overlayStore, versusColorStore } from 'store/overlay'
import { colorSpaceStore, paletteStore } from 'store/palette'
import styled from 'styled-components'
import { contrast } from './PaletteSwatches'
import Swatch from './Swatch'

const ColourBar = () => {
  const palette = useStore(paletteStore)
  const selected = useStore(selectedStore)
  const overlay = useStore(overlayStore)
  const versusColor = useStore(versusColorStore)
  const { colors } = palette
  const getCR = useCallback(
    (hex: string) => {
      let cr = contrast[overlay.mode](versusColor, hex)
      return cr && Math.floor(cr * 10) / 10
    },
    [overlay.mode, versusColor]
  )

  return (
    <div>
      <h2 className="text-2xl mb-4 font-semibold">
        {palette.hues[selected.hueId]}
      </h2>
      {colors.map((hueColors, hueId) => {
        if (hueId !== selected.hueId) {
          return <></>
        }

        return (
          <div
            className="grid"
            style={{ gridTemplateColumns: `repeat(${hueColors.length}, 1fr)` }}
          >
            {hueColors.map((color, toneId) => {
              const isSelected = toneId === selected.toneId
              return (
                <Swatch
                  key={toneId + '-' + hueId}
                  onClick={() => setSelected([hueId, toneId])}
                  color={color}
                  isSelected={isSelected}
                >
                  <span>{getCR(color.hex)}</span>
                </Swatch>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default ColourBar
