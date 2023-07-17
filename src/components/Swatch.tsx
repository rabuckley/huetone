import { useStore } from '@nanostores/react'
import { ReactNode } from 'react'
import { getMostContrast } from 'shared/color'
import { useKeyPress } from 'shared/hooks/useKeyPress'
import { TColor } from 'shared/types'
import { colorSpaceStore } from 'store/palette'

interface SwatchProps {
  children: ReactNode
  key: string
  onClick: (() => void) | undefined
  isSelected: boolean | undefined
  color: TColor
}

const Swatch = ({ children, key, onClick, isSelected, color }: SwatchProps) => {
  const colorSpace = useStore(colorSpaceStore)
  const bPress = useKeyPress('KeyB')

  const color2020 = `oklch(${color.l}% ${color.c} ${color.h})`

  return (
    <button
      key={key}
      onClick={onClick}
      className="cursor-pointer grid relative border-0 items-center content-center will-change-transform focus:outline-none h-12"
      style={{
        background: !bPress
          ? color2020
          : colorSpace.lch2color([color.l, 0, 0]).hex,
        color: getMostContrast(color.hex, ['#000', '#fff']),
        borderRadius: isSelected ? 'var(--radius-m)' : 0,
        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
        zIndex: isSelected ? 3 : 0,
        fontWeight: isSelected ? 700 : 400,
      }}
    >
      {children}
    </button>
  )
}

export default Swatch
