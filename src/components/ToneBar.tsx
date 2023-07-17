import { useStore } from '@nanostores/react'
import { useCallback, useMemo } from 'react'
import { useKeyPress } from 'shared/hooks/useKeyPress'
import { selectedStore } from 'store/currentPosition'
import { overlayStore, versusColorStore } from 'store/overlay'
import { colorSpaceStore, paletteStore } from 'store/palette'
import { contrast } from './PaletteSwatches'
import Swatch from './Swatch'

const ToneBar = () => {
  const palette = useStore(paletteStore)
  const selected = useStore(selectedStore)
  const overlay = useStore(overlayStore)
  const versusColor = useStore(versusColorStore)
  const colorSpace = useStore(colorSpaceStore)
  const bPress = useKeyPress('KeyB')
  const { colors } = palette
  const getCR = useCallback(
    (hex: string) => {
      let cr = contrast[overlay.mode](versusColor, hex)
      return cr && Math.floor(cr * 10) / 10
    },
    [overlay.mode, versusColor]
  )

  const hueColors = useMemo(
    () => palette.colors.map(hue => hue[selected.toneId]),
    [palette.colors, selected.toneId]
  )
  return (
    <div>
      <h2 className="text-2xl mb-4 font-semibold">
        {palette.tones[selected.toneId]}
      </h2>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${hueColors.length}, 1fr)`,
        }}
      >
        {hueColors.map((color, i) => (
          <Swatch
            key={i.toString()}
            color={color}
            onClick={undefined}
            isSelected={undefined}
          >
            {+color['l'].toFixed(1)}
          </Swatch>
        ))}
      </div>
    </div>
  )
}

export default ToneBar
