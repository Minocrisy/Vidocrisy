import { ReactNode } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Flex direction="column" minH="100vh">
      <Navbar />
      <Flex flex="1">
        <Sidebar />
        <Box
          as="main"
          flex="1"
          p={4}
          className="circuit-bg"
          overflowY="auto"
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  )
}

export default Layout
