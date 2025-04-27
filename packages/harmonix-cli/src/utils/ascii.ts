export const themeColor = '\x1B[38;5;69m'
const icon = [
  `         _`,
  `      .$$$$$.`,
  `    x$$$' '$$$x`,
  `  ,$$p'     'q$$,`,
  `  *$$b,     ,d$$*`,
  `    "$$$, ,$$$"`,
  `      >$$$$$<`,
  `     d$$$^$$$b`,
  `   'x$@/   \\@$x'`
]

export const harmonixIcon = icon.map((line) => line.split('').join(themeColor)).join('\n')