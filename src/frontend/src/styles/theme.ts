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
        },
        _active: {
          bg: 'brand.700',
        },
      },
      outline: {
        border: '1px solid',
        borderColor: 'brand.500',
        color: 'brand.500',
        _hover: {
          bg: 'rgba(0, 136, 230, 0.1)',
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
      },
    },
  },
  Heading: {
    baseStyle: {
      fontWeight: 'medium',
      color: 'white',
    },
  },
  Text: {
    baseStyle: {
      color: 'gray.100',
    },
  },
}

// Custom styles
const styles = {
  global: {
    body: {
      bg: 'gray.900',
      color: 'white',
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
  },
}

// Custom fonts
const fonts = {
  heading: 'Inter, system-ui, sans-serif',
  body: 'Inter, system-ui, sans-serif',
}

// Extend the theme
const theme = extendTheme({
  config,
  colors,
  components,
  styles,
  fonts,
})

export default theme
