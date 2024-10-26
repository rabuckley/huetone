import { HexPalette, LCH, Palette, spaceName } from 'shared/types'
import { convertToMode } from './paletteReducers'
import { paletteStore, paletteIdStore, paletteListStore } from './stores'
import {
  clampColorsToRgb,
  setHueHue,
  setChromaChroma,
  setToneLuminance,
} from './paletteReducers'
import { parseHexPalette } from './converters'
import { selectedStore } from '../currentPosition'
import { colorSpaceStore, exportToHexPalette, savedPalettesStore } from '.'

export const switchPalette = (id: number) => {
  if (id === paletteIdStore.get()) return
  const paletteList = paletteListStore.get()
  if (!paletteList[id]) return
  paletteIdStore.set(id)
  const { mode } = paletteStore.get()
  const newPalette = parseHexPalette(paletteList[id], mode)
  paletteStore.set(newPalette)
}

export const switchColorSpace = (space: spaceName) => {
  const palette = paletteStore.get()
  if (palette.mode === space) return
  paletteStore.set(convertToMode(palette, space))
}

// Palllete list actions

export const updateSavedPalette = (palette: HexPalette, idx: number) => {
  const paletteList = savedPalettesStore.get()
  savedPalettesStore.set(paletteList.map((p, i) => (i === idx ? palette : p)))
}

const removeSavedPalette = (idx: number) => {
  const paletteList = savedPalettesStore.get()
  savedPalettesStore.set(paletteList.filter((_, i) => i !== idx))
}

export const deletePalette = (idx: number) => {
  removeSavedPalette(idx)
  const currentId = paletteIdStore.get()
  if (currentId > idx) paletteIdStore.set(currentId - 1)
  if (currentId === idx) switchPalette(currentId)
}

export const duplicatePalette = (idx: number) => {
  const savedPalettes = savedPalettesStore.get()
  if (savedPalettes[idx]) {
    // Duplicating user palette
    savedPalettesStore.set(
      savedPalettes.flatMap((palette, i) =>
        i === idx
          ? [palette, { ...palette, name: palette.name + ' copy' }]
          : palette
      )
    )
    switchPalette(idx + 1)
  }
}

// Color space actions

export const toggleColorSpace = () => {
  const palette = paletteStore.get()
  switchColorSpace(
    palette.mode === spaceName.cielch ? spaceName.oklch : spaceName.cielch
  )
}

//  Palette actions

/** Main action for editing the palette.  */
export const setPalette = (newPalette: Palette) => {
  const savedPalettes = savedPalettesStore.get()
  const currentId = paletteIdStore.get()
  if (currentId > savedPalettes.length - 1) {
    // Trying to change preset
    const name = newPalette.name + ' copy'
    const changedPalette = { ...newPalette, name }
    savedPalettesStore.set([
      exportToHexPalette(changedPalette),
      ...savedPalettes,
    ])
    paletteIdStore.set(0)
    paletteStore.set(changedPalette)
  } else {
    // Changing user palette
    paletteStore.set(newPalette)
    setTimeout(() => {
      updateSavedPalette(exportToHexPalette(newPalette), currentId)
    }, 10)
  }
}

export const pushColorsIntoRgb = () => {
  setPalette(clampColorsToRgb(paletteStore.get()))
}

export const currentLuminanceToColumn = () => {
  const selected = selectedStore.get()
  setPalette(
    setToneLuminance(paletteStore.get(), selected.color.l, selected.toneId)
  )
}

export const currentHueToRow = () => {
  const selected = selectedStore.get()
  setPalette(setHueHue(paletteStore.get(), selected.color.h, selected.hueId))
}

export const currentChromaToRow = () => {
  const selected = selectedStore.get()
  setPalette(
    setChromaChroma(paletteStore.get(), selected.color.c, selected.hueId)
  )
}

export const renamePalette = (name: string) => {
  setPalette({ ...paletteStore.get(), name })
}

export const setLchColor = (lch: LCH, hueId: number, toneId: number) => {
  const palette = paletteStore.get()
  const { lch2color } = colorSpaceStore.get()
  const color = lch2color(lch)
  setPalette({
    ...palette,
    colors: palette.colors.map((tones, hue) =>
      hue === hueId
        ? tones.map((lch, tone) => (toneId === tone ? color : lch))
        : tones
    ),
  })
}
