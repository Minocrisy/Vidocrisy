import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

// Color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

// Custom colors
const colors = {
  brand: {
    50: '#e6f6ff',
    100: '#b3e0ff',
    200: '#80cbff',
    300: '#4db5ff',
    400: '#1a9fff',
    500: '#0088e6',
    600: '#006bb3',
    700: '#004d80',
    800: '#00304d',
    900: '#00121a',
  },
  gray: {
    50: '#f2f2f2',
    100: '#d9d9d9',
    200: '#bfbfbf',
    300: '#a6a6a6',
    400: '#8c8c8c',
    500: '#737373',
    600: '#595959',
    700: '#404040',
    800: '#262626',
    900: '#121212',
  },
}

// Custom component styles
const components = {
  Button: {
    baseStyle: {
      borderRadius: 'md',
      fontWeight: 'medium',
      transition: 'all 0.2s ease-in-out',
      _focus: {
        boxShadow: 'outline',
      },
    },
    variants: {
      solid: {
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.600',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        _active: {
          bg: 'brand.700',
          transform: 'translateY(0)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
        },
      },
      outline: {
        border: '1px solid',
        borderColor: 'brand.500',
        color: 'brand.500',
        _hover: {
          bg: 'rgba(0, 136, 230, 0.1)',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        _active: {
          transform: 'translateY(0)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
        },
      },
      ghost: {
        color: 'brand.500',
        _hover: {
          bg: 'rgba(0, 136, 230, 0.1)',
        },
      },
    },
    defaultProps: {
      variant: 'solid',
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'md',
        bg: 'gray.800',
        boxShadow: 'md',
        overflow: 'hidden',
        transition: 'all 0.2s ease-in-out',
        _hover: {
          boxShadow: 'lg',
        },
      },
    },
  },
  Heading: {
    baseStyle: {
      fontWeight: 'medium',
      color: 'white',
      letterSpacing: '-0.01em',
    },
  },
  Text: {
    baseStyle: {
      color: 'gray.100',
    },
  },
  Input: {
    baseStyle: {
      field: {
        borderRadius: 'md',
        _focus: {
          borderColor: 'brand.500',
          boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
        },
      },
    },
    variants: {
      filled: {
        field: {
          bg: 'gray.700',
          _hover: {
            bg: 'gray.600',
          },
          _focus: {
            bg: 'gray.600',
          },
        },
      },
    },
    defaultProps: {
      variant: 'filled',
    },
  },
  Textarea: {
    baseStyle: {
      borderRadius: 'md',
      _focus: {
        borderColor: 'brand.500',
        boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
      },
    },
    variants: {
      filled: {
        bg: 'gray.700',
        _hover: {
          bg: 'gray.600',
        },
        _focus: {
          bg: 'gray.600',
        },
      },
    },
    defaultProps: {
      variant: 'filled',
    },
  },
  Select: {
    baseStyle: {
      field: {
        borderRadius: 'md',
      },
    },
    variants: {
      filled: {
        field: {
          bg: 'gray.700',
          _hover: {
            bg: 'gray.600',
          },
          _focus: {
            bg: 'gray.600',
          },
        },
      },
    },
    defaultProps: {
      variant: 'filled',
    },
  },
  Tabs: {
    variants: {
      enclosed: {
        tab: {
          _selected: {
            color: 'brand.500',
            borderColor: 'brand.500',
          },
        },
      },
    },
  },
}

// Custom styles
const styles = {
  global: {
    body: {
      bg: 'gray.900',
      color: 'white',
      lineHeight: 'tall',
    },
    a: {
      color: 'brand.500',
      _hover: {
        textDecoration: 'underline',
      },
    },
    '::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '::-webkit-scrollbar-track': {
      bg: 'gray.800',
    },
    '::-webkit-scrollbar-thumb': {
      bg: 'gray.600',
      borderRadius: '4px',
    },
    '::-webkit-scrollbar-thumb:hover': {
      bg: 'gray.500',
    },
    // Focus styles for keyboard navigation
    'a:focus, button:focus, input:focus, select:focus, textarea:focus': {
      outline: 'none',
      boxShadow: '0 0 0 2px var(--chakra-colors-brand-500) !important',
    },
  },
}

// Custom fonts
const fonts = {
  heading: 'Inter, system-ui, sans-serif',
  body: 'Inter, system-ui, sans-serif',
  mono: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace',
}

// Custom spacing
const space = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
}

// Custom border radius
const radii = {
  none: '0',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  full: '9999px',
}

// Custom shadows
const shadows = {
  xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  outline: '0 0 0 3px rgba(0, 136, 230, 0.6)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
  'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.35), 0 4px 6px -2px rgba(0, 0, 0, 0.25)',
  'brand-glow': '0 0 15px rgba(26, 159, 255, 0.5), 0 0 30px rgba(26, 159, 255, 0.3)',
}

// Custom transitions
const transition = {
  property: {
    common: 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
    colors: 'background-color, border-color, color, fill, stroke',
    dimensions: 'width, height',
    position: 'left, right, top, bottom',
    background: 'background-color, background-image, background-position',
  },
  easing: {
    'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
    'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
    'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  duration: {
    'ultra-fast': '50ms',
    faster: '100ms',
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '400ms',
    'ultra-slow': '500ms',
  },
}

// Extend the theme
const theme = extendTheme({
  config,
  colors,
  components,
  styles,
  fonts,
  space,
  radii,
  shadows,
  transition,
})

export default theme
