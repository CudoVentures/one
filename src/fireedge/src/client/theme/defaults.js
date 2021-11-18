/* ------------------------------------------------------------------------- *
 * Copyright 2002-2021, OpenNebula Project, OpenNebula Systems               *
 *                                                                           *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may   *
 * not use this file except in compliance with the License. You may obtain   *
 * a copy of the License at                                                  *
 *                                                                           *
 * http://www.apache.org/licenses/LICENSE-2.0                                *
 *                                                                           *
 * Unless required by applicable law or agreed to in writing, software       *
 * distributed under the License is distributed on an "AS IS" BASIS,         *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
 * See the License for the specific language governing permissions and       *
 * limitations under the License.                                            *
 * ------------------------------------------------------------------------- */
import { createTheme, ThemeOptions, colors, alpha } from '@mui/material'
import { UbuntuFont } from 'client/theme/fonts'
import { SCHEMES } from 'client/constants'

const defaultTheme = createTheme()
const { grey } = colors
const black = '#1D1D1D'
const white = '#ffffff'

const systemFont = [
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"'
]

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536
}

export const toolbar = {
  regular: 56,
  xs: 48,
  sm: 64
}

export const footer = {
  regular: 30
}

export const sidebar = {
  minified: 60,
  fixed: 250
}

const buttonSvgStyle = {
  fontSize: '1.25rem',
  width: '1em',
  height: '1em'
}

/**
 * @param {ThemeOptions} appTheme - App theme
 * @param {SCHEMES} mode - Scheme type
 * @returns {ThemeOptions} Material theme options
 */
export default (appTheme, mode = SCHEMES.DARK) => {
  const { primary, secondary } = appTheme.palette
  const isDarkMode = mode === SCHEMES.DARK

  return {
    palette: {
      mode,
      primary,
      secondary,
      common: {
        black,
        white
      },
      background: {
        paper: isDarkMode ? primary.light : white,
        default: isDarkMode ? primary.main : '#f2f4f8'
      },
      error: {
        100: '#fdeae7',
        200: '#f8c0b7',
        300: '#f5aca0',
        400: '#f39788',
        500: '#ee6d58',
        600: '#ec5840',
        700: '#ec462b',
        800: '#f2391b',
        light: '#f8c0b7',
        main: '#ec5840',
        dark: '#f2391b',
        contrastText: white
      },
      warning: {
        100: '#FFF4DB',
        200: '#FFEDC2',
        300: '#FFE4A3',
        400: '#FFD980',
        500: '#FCC419',
        600: '#FAB005',
        700: '#F1A204',
        800: '#DB9A00',
        light: '#ffe4a3',
        main: '#f1a204',
        dark: '#f1a204',
        contrastText: 'rgba(0, 0, 0, 0.87)'
      },
      info: {
        light: '#64b5f6',
        main: '#2196f3',
        dark: '#01579b',
        contrastText: white
      },
      success: {
        100: '#bce1bd',
        200: '#a6d7a8',
        300: '#8fcd92',
        400: '#79c37c',
        500: '#62b966',
        600: '#4caf50',
        700: '#419b46',
        800: '#388e3c',
        light: '#3adb76',
        main: '#4caf50',
        dark: '#388e3c',
        contrastText: white
      },
      debug: {
        light: '#e0e0e0',
        main: '#757575',
        dark: '#424242',
        contrastText: isDarkMode ? white : black
      }
    },
    breakpoints: {
      values: breakpoints,
      keys: Object.keys(breakpoints)
    },
    typography: {
      fontFamily: [UbuntuFont.fontFamily, ...systemFont].join(','),
      fontFamilyCode: [
        'Consolas',
        'Menlo',
        'Monaco',
        'Andale Mono',
        'Ubuntu Mono',
        'monospace'
      ].join(','),
      fontFamilySystem: systemFont.join(','),
      h1: {
        fontSize: 'clamp(2.625rem, 1.2857rem + 3.5714vw, 4rem)',
        fontWeight: 800,
        lineHeight: 78 / 70
      },
      h2: {
        fontSize: 'clamp(1.5rem, 0.9643rem + 1.4286vw, 2.25rem)',
        fontWeight: 800,
        lineHeight: 44 / 36
      },
      h3: {
        fontSize: defaultTheme.typography.pxToRem(36),
        lineHeight: 44 / 36,
        letterSpacing: 0
      },
      h4: {
        fontSize: defaultTheme.typography.pxToRem(28),
        lineHeight: 42 / 28,
        letterSpacing: 0
      },
      h5: {
        fontSize: defaultTheme.typography.pxToRem(24),
        lineHeight: 36 / 24,
        letterSpacing: 0
      },
      h6: {
        fontSize: defaultTheme.typography.pxToRem(20),
        lineHeight: 30 / 20,
        letterSpacing: 0
      },
      button: {
        fontSize: defaultTheme.typography.pxToRem(12),
        textTransform: 'initial',
        fontWeight: 500,
        letterSpacing: 0
      },
      subtitle1: {
        fontSize: defaultTheme.typography.pxToRem(18),
        lineHeight: 24 / 18,
        letterSpacing: 0,
        fontWeight: 500
      },
      body1: {
        fontSize: defaultTheme.typography.pxToRem(16),
        lineHeight: 24 / 16,
        letterSpacing: 0
      },
      body2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        lineHeight: 21 / 14,
        letterSpacing: 0
      },
      caption: {
        display: 'inline-block',
        fontSize: defaultTheme.typography.pxToRem(12),
        lineHeight: 18 / 12,
        letterSpacing: 0,
        fontWeight: 500
      },
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      fontWeightExtraBold: 800
    },
    mixins: {
      toolbar: {
        minHeight: toolbar.regular,
        [`@media (min-width:${breakpoints.xs}px) and (orientation: landscape)`]: {
          minHeight: toolbar.xs
        },
        [`@media (min-width:${breakpoints.sm}px)`]: {
          minHeight: toolbar.sm
        }
      }
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '@font-face': UbuntuFont,
          '.description__link': {
            margin: 0,
            color: isDarkMode ? secondary.main : secondary.dark,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          },
          fieldset: { border: 'none' }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'unset' }
        }
      },
      MuiButtonBase: {
        defaultProps: {
          disableTouchRipple: true
        }
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            '&.Mui-selected, &.Mui-selected:hover': {
              backgroundColor: alpha(secondary.main, 0.60)
            }
          }
        }
      },
      MuiButton: {
        defaultProps: {
          disableTouchRipple: true
        },
        styleOverrides: {
          root: {
            padding: '5px 16px',
            '& svg:nth-of-type(1)': buttonSvgStyle
          },
          endIcon: {
            marginLeft: 4,
            width: '1rem',
            height: '1rem'
          },
          text: {
            color: isDarkMode ? white : grey[900],
            '&:hover': {
              backgroundColor: isDarkMode ? alpha(white, 0.1) : alpha(grey[900], 0.1)
            }
          },
          outlined: {
            border: '1px solid',
            borderColor: isDarkMode ? alpha(grey[100], 0.45) : alpha(grey[700], 0.45),
            borderRadius: defaultTheme.shape.borderRadius,
            color: isDarkMode ? white : grey[900]
          }
        }
      },
      MuiIconButton: {
        styleOverrides: {
          root: { '& svg:nth-of-type(1)': buttonSvgStyle }
        },
        variants: [{
          props: { color: 'default' },
          style: { '&:hover': { color: secondary.main } }
        }]
      },
      MuiIcon: {
        styleOverrides: {
          root: { '& svg:nth-of-type(1)': buttonSvgStyle }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            padding: '0 2px',
            boxShadow: 'none',
            borderStyle: 'solid',
            borderColor: alpha(grey[100], 0.1),
            borderWidth: 0,
            borderBottomWidth: 'thin',
            backgroundColor: primary.main,
            '& .MuiIconButton-root, & .MuiButton-root': {
              color: white,
              border: 'none',
              backgroundColor: 'transparent',
              '&:hover': {
                border: 'none',
                backgroundColor: 'transparent',
                color: alpha(white, 0.7)
              }
            }
          }
        }
      },
      MuiLink: {
        defaultProps: {
          underline: 'hover'
        }
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            margin: '.5rem 0'
          }
        }
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          size: 'small',
          color: 'secondary',
          SelectProps: {
            native: true
          }
        }
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? secondary.dark : secondary.main,
            borderRadius: 8,
            boxShadow: '0px 20px 25px rgba(0, 0, 0, 0.05), 0px 10px 10px rgba(0, 0, 0, 0.02)'
          },
          indicator: {
            backgroundColor: 'transparent',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              left: 30,
              right: 30,
              height: '100%',
              backgroundColor: white
            }
          }
        }
      },
      MuiTab: {
        styleOverrides: {
          root: {
            color: isDarkMode ? secondary[200] : secondary[100],
            textTransform: 'capitalize',
            fontSize: '1rem',
            '&.Mui-selected': {
              color: white
            }
          }
        }
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? primary.main : '#f2f4f8'
          }
        },
        defaultProps: {
          color: 'secondary'
        }
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 700,
            color: isDarkMode ? grey[300] : grey[700],
            borderColor: isDarkMode ? secondary[500] : grey[400],
            '&.Mui-selected': {
              borderColor: `${secondary[500]} !important`,
              color: isDarkMode ? white : secondary[800],
              backgroundColor: isDarkMode ? alpha(secondary[800], 0.2) : secondary[100]
            }
          }
        }
      },
      MuiList: {
        defaultProps: {
          dense: true
        }
      },
      MuiChip: {
        variants: [{
          props: { variant: 'text' },
          style: {
            border: 0,
            backgroundColor: 'transparent'
          }
        }]
      }
    }
  }
}
