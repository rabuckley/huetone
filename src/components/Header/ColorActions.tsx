import { More } from 'shared/icons/More'
import { EqualizeH } from 'shared/icons/EqualizeH'
import { EqualizeL } from 'shared/icons/EqualizeL'
import { Minimize } from 'shared/icons/Minimize'
import * as Menu from '../DropdownMenu'
import { Button } from '../inputs'
import {
  currentHueToRow,
  currentLuminanceToColumn,
  currentChromaToRow,
  pushColorsIntoRgb,
} from 'store/palette'
import { Key } from 'components/Help'

export const ColorActions = () => {
  const isWin = navigator.platform.toUpperCase().indexOf('WIN') >= 0
  const MetaKey = () => (isWin ? <Key>Ctrl</Key> : <Key>⌘</Key>)

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <button
          className="flex px-4 py-2 text-red bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded"
          title="Actions"
        >
          <More />
        </button>
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Content align="end" sideOffset={4}>
          <Menu.Item
            onSelect={pushColorsIntoRgb}
            title="Not all LCH colors are displayable in RGB color space. This button will tweak all LCH values to be displayable."
          >
            <span style={{ display: 'flex', gap: 8 }}>
              <Minimize />
              Make colors displayable
            </span>
          </Menu.Item>
          <Menu.Item onSelect={currentHueToRow}>
            <span style={{ display: 'flex', gap: 8 }}>
              <EqualizeH />
              Apply current hue to row
            </span>
          </Menu.Item>
          <Menu.Item onClick={currentLuminanceToColumn}>
            <span style={{ display: 'flex', gap: 8 }}>
              <EqualizeL />
              Apply current luminance to column (<Key meta /> + <Key>a</Key>)
            </span>
          </Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  )
}
