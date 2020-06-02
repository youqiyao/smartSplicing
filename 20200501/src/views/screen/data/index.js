export default {
  resolutions: [
      { label: '1920*1080', value: '1920*1080', rotato: false},
      { label: '1080*1920', value: '1080*1920', rotato: true},
      { label: '3840*2160', value: '3840*2160', rotato: false},
      { label: '2160*3840', value: '2160*3840', rotato: true},
  ],
  //逻辑网格
  grids: [
      { label: '0 x 0', value: '0x0' },
      { label: '1 x 1', value: '1x1' },
      { label: '2 x 2', value: '2x2' },
      { label: '3 x 3', value: '3x3' },
      { label: '4 x 4', value: '4x4' },
      { label: '5 x 5', value: '5x5' },
      { label: '6 x 6', value: '6x6' },
      { label: '7 x 7', value: '7x7' },
      { label: '8 x 8', value: '8x8' }
  ],
  //旋转角度
  degrees: [
      { label: '0°', value: 0 },
      { label: '90°', value: 1 },
      { label: '180°', value: 2 },
      { label: '270°', value: 3}
  ],
}