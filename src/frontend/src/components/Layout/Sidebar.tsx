import { Box, VStack, Icon, Tooltip, Divider, Flex } from '@chakra-ui/react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  FiHome, 
  FiVideo, 
  FiEdit, 
  FiFolder, 
  FiSettings,
  FiInfo
} from 'react-icons/fi'

interface NavItemProps {
  icon: React.ElementType
  to: string
  label: string
}

const NavItem = ({ icon, to, label }: NavItemProps) => {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Tooltip label={label} placement="right" hasArrow>
      <Flex
        as={NavLink}
        to={to}
        p={3}
        borderRadius="md"
        color={isActive ? 'brand.300' : 'gray.400'}
        bg={isActive ? 'gray.700' : 'transparent'}
        _hover={{
          bg: 'gray.700',
          color: 'brand.300',
        }}
        justifyContent="center"
        alignItems="center"
        className={isActive ? 'glow' : ''}
      >
        <Icon as={icon} boxSize={5} />
      </Flex>
    </Tooltip>
  )
}

const Sidebar = () => {
  return (
    <Box
      as="aside"
      bg="gray.800"
      w="64px"
      borderRight="1px solid"
      borderColor="gray.700"
      py={4}
    >
      <VStack spacing={2} align="center">
        <NavItem icon={FiHome} to="/" label="Home" />
        <NavItem icon={FiVideo} to="/generator" label="Generator" />
        <NavItem icon={FiEdit} to="/editor" label="Editor" />
        <NavItem icon={FiFolder} to="/library" label="Library" />
        
        <Divider my={4} borderColor="gray.700" />
        
        <NavItem icon={FiSettings} to="/settings" label="Settings" />
        <NavItem icon={FiInfo} to="/about" label="About" />
      </VStack>
    </Box>
  )
}

export default Sidebar
