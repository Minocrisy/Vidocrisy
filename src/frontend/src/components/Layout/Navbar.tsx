import { 
  Box, 
  Flex, 
  Heading, 
  IconButton, 
  Image,
  HStack
} from '@chakra-ui/react'
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/menu'
import { FiSettings, FiUser, FiHelpCircle } from 'react-icons/fi'

const Navbar = () => {

  return (
    <Box 
      as="nav" 
      bg="gray.800" 
      px={4} 
      py={2} 
      borderBottom="1px solid" 
      borderColor="gray.700"
      boxShadow="0 2px 10px rgba(0, 0, 0, 0.3)"
    >
      <Flex justify="space-between" align="center">
        <HStack spacing={4}>
          <Image 
            src="/assets/images/Minocrisy_Banner.png" 
            alt="Vidocrisy" 
            height="40px"
          />
          <Heading 
            as="h1" 
            size="md" 
            fontWeight="bold" 
            className="glow-text"
            color="brand.300"
          >
            Vidocrisy
          </Heading>
        </HStack>

        <HStack spacing={2}>
          <IconButton
            aria-label="Help"
            icon={<FiHelpCircle />}
            variant="ghost"
            colorScheme="brand"
          />
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Settings"
              icon={<FiSettings />}
              variant="ghost"
              colorScheme="brand"
            />
            <MenuList bg="gray.800" borderColor="gray.700">
              <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>
                Profile
              </MenuItem>
              <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>
                API Keys
              </MenuItem>
              <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>
                Preferences
              </MenuItem>
            </MenuList>
          </Menu>
          <IconButton
            aria-label="User"
            icon={<FiUser />}
            variant="ghost"
            colorScheme="brand"
          />
        </HStack>
      </Flex>
    </Box>
  )
}

export default Navbar
