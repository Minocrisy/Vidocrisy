import { Box, VStack, Icon, Tooltip, Divider, Flex, Text, useDisclosure, Collapse } from '@chakra-ui/react'
import { NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { 
  FiHome, 
  FiVideo, 
  FiEdit, 
  FiFolder, 
  FiSettings,
  FiInfo,
  FiChevronRight,
  FiChevronLeft
} from 'react-icons/fi'

interface NavItemProps {
  icon: React.ElementType
  to: string
  label: string
  index?: number
}

const NavItem = ({ icon, to, label, index = 0 }: NavItemProps) => {
  const location = useLocation()
  const isActive = location.pathname === to
  const delay = 0.1 + index * 0.05 // Staggered animation delay

  return (
    <Tooltip label={label} placement="right" hasArrow openDelay={300}>
      <Flex
        as={NavLink}
        to={to}
        p={3}
        borderRadius="md"
        color={isActive ? 'brand.300' : 'gray.400'}
        bg={isActive ? 'rgba(0, 136, 230, 0.1)' : 'transparent'}
        _hover={{
          bg: 'gray.700',
          color: 'brand.300',
          transform: 'translateX(3px)',
        }}
        justifyContent="center"
        alignItems="center"
        className={isActive ? 'glow' : ''}
        transition="all 0.2s ease-in-out"
        position="relative"
        style={{
          animation: `slideInRight 0.5s ease-out forwards`,
          animationDelay: `${delay}s`,
          opacity: 0
        }}
        role="group"
      >
        <Icon 
          as={icon} 
          boxSize={5} 
          transition="transform 0.2s ease"
          _groupHover={{ transform: 'scale(1.1)' }}
        />
        {isActive && (
          <Box
            position="absolute"
            left={0}
            top="50%"
            transform="translateY(-50%)"
            w="3px"
            h="70%"
            bg="brand.500"
            borderRadius="full"
            className="glow"
          />
        )}
      </Flex>
    </Tooltip>
  )
}

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <Box
      as="aside"
      bg="gray.800"
      w={isExpanded ? "180px" : "64px"}
      borderRight="1px solid"
      borderColor="gray.700"
      py={4}
      position="relative"
      transition="width 0.3s ease-in-out"
      boxShadow="2px 0 10px rgba(0, 0, 0, 0.2)"
      className="fade-in"
    >
      <VStack spacing={2} align="center" className="fade-in">
        <NavItem icon={FiHome} to="/" label="Home" index={0} />
        <NavItem icon={FiVideo} to="/generator" label="Generator" index={1} />
        <NavItem icon={FiEdit} to="/editor" label="Editor" index={2} />
        <NavItem icon={FiFolder} to="/library" label="Library" index={3} />
        
        <Divider 
          my={4} 
          borderColor="gray.700" 
          opacity={0.5}
          w="80%"
        />
        
        <NavItem icon={FiSettings} to="/settings" label="Settings" index={4} />
        <NavItem icon={FiInfo} to="/about" label="About" index={5} />
      </VStack>
      
      {/* Expand/Collapse Button */}
      <Flex
        position="absolute"
        right="-12px"
        top="20px"
        w="24px"
        h="24px"
        bg="gray.800"
        borderRadius="full"
        justifyContent="center"
        alignItems="center"
        cursor="pointer"
        border="1px solid"
        borderColor="gray.700"
        onClick={() => setIsExpanded(!isExpanded)}
        transition="transform 0.3s ease"
        _hover={{ bg: 'gray.700' }}
        boxShadow="0 2px 5px rgba(0, 0, 0, 0.2)"
        zIndex={10}
        display="none" // Hidden for now, can be enabled later
      >
        <Icon 
          as={isExpanded ? FiChevronLeft : FiChevronRight} 
          color="brand.300"
          fontSize="sm"
        />
      </Flex>
    </Box>
  )
}

export default Sidebar
