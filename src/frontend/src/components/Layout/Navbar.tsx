import { 
  Box, 
  Flex, 
  Heading, 
  IconButton, 
  Image,
  HStack,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Text
} from '@chakra-ui/react'
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/menu'
import { FiSettings, FiUser, FiHelpCircle, FiInfo, FiKey, FiSliders } from 'react-icons/fi'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Box 
      as="nav" 
      bg={scrolled ? "rgba(38, 38, 38, 0.95)" : "gray.800"}
      px={4} 
      py={scrolled ? 2 : 3} 
      borderBottom="1px solid" 
      borderColor="gray.700"
      boxShadow={scrolled ? "0 4px 20px rgba(0, 0, 0, 0.4)" : "0 2px 10px rgba(0, 0, 0, 0.3)"}
      position="sticky"
      top={0}
      zIndex={100}
      backdropFilter={scrolled ? "blur(10px)" : "none"}
      transition="all 0.3s ease-in-out"
      className="fade-in"
    >
      <Flex justify="space-between" align="center">
        <HStack spacing={4} className="slide-in-right">
          <Image 
            src="/Minocrisy_Banner.png" 
            alt="Vidocrisy" 
            height="40px"
            className="glow"
            transition="transform 0.3s ease"
            _hover={{ transform: "scale(1.05)" }}
          />
          <Heading 
            as="h1" 
            size="md" 
            fontWeight="bold" 
            className="glow-text"
            color="brand.300"
            letterSpacing="tight"
          >
            Vidocrisy
          </Heading>
        </HStack>

        <HStack spacing={3} className="slide-in-right">
          <Tooltip label="Help & Documentation" placement="bottom" hasArrow>
            <IconButton
              aria-label="Help"
              icon={<FiHelpCircle />}
              variant="ghost"
              colorScheme="brand"
              fontSize="20px"
              className="btn-hover"
              onClick={onOpen}
              _hover={{
                bg: "rgba(0, 136, 230, 0.15)",
                transform: "translateY(-2px)"
              }}
              transition="all 0.2s ease"
            />
          </Tooltip>
          
          <Menu>
            <Tooltip label="Settings" placement="bottom" hasArrow>
              <MenuButton
                as={IconButton}
                aria-label="Settings"
                icon={<FiSettings />}
                variant="ghost"
                colorScheme="brand"
                fontSize="20px"
                className="btn-hover"
                _hover={{
                  bg: "rgba(0, 136, 230, 0.15)",
                  transform: "translateY(-2px)"
                }}
                transition="all 0.2s ease"
              />
            </Tooltip>
            <MenuList 
              bg="gray.800" 
              borderColor="gray.700"
              boxShadow="xl"
              p={2}
              borderRadius="md"
            >
              <MenuItem 
                bg="gray.800" 
                _hover={{ bg: "gray.700" }}
                icon={<FiUser />}
                borderRadius="md"
                mb={1}
              >
                Profile
              </MenuItem>
              <MenuItem 
                bg="gray.800" 
                _hover={{ bg: "gray.700" }}
                icon={<FiKey />}
                borderRadius="md"
                mb={1}
              >
                API Keys
              </MenuItem>
              <MenuItem 
                bg="gray.800" 
                _hover={{ bg: "gray.700" }}
                icon={<FiSliders />}
                borderRadius="md"
              >
                Preferences
              </MenuItem>
            </MenuList>
          </Menu>
          
          <Tooltip label="User Account" placement="bottom" hasArrow>
            <IconButton
              aria-label="User"
              icon={<FiUser />}
              variant="ghost"
              colorScheme="brand"
              fontSize="20px"
              className="btn-hover"
              _hover={{
                bg: "rgba(0, 136, 230, 0.15)",
                transform: "translateY(-2px)"
              }}
              transition="all 0.2s ease"
            />
          </Tooltip>
        </HStack>
      </Flex>
      
      {/* Help Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent bg="gray.800" color="white">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderColor="gray.700">
            <HStack>
              <FiInfo />
              <Text>Help & Documentation</Text>
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <VStack align="start" spacing={6} mt={4}>
              <Box>
                <Heading size="sm" mb={2} color="brand.300">Getting Started</Heading>
                <Text fontSize="sm">
                  Vidocrisy is a personal video generation platform that integrates multiple AI video generation services into a unified interface.
                </Text>
              </Box>
              
              <Box>
                <Heading size="sm" mb={2} color="brand.300">Generate Videos</Heading>
                <Text fontSize="sm">
                  Use the Generator to create talking head videos with AI avatars using Hedra. Select an avatar, enter your script, and customize settings.
                </Text>
              </Box>
              
              <Box>
                <Heading size="sm" mb={2} color="brand.300">Edit Videos</Heading>
                <Text fontSize="sm">
                  The Editor allows you to splice, trim, and combine videos with easy-to-apply transitions. Add branding elements and customize your videos.
                </Text>
              </Box>
              
              <Box>
                <Heading size="sm" mb={2} color="brand.300">Manage Library</Heading>
                <Text fontSize="sm">
                  The Library helps you organize and manage your generated videos. Browse, search, and categorize your videos for easy access.
                </Text>
              </Box>
              
              <Box>
                <Heading size="sm" mb={2} color="brand.300">Export Options</Heading>
                <Text fontSize="sm">
                  Export your videos in various formats (MP4, WebM, QuickTime) with different quality presets and custom settings.
                </Text>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default Navbar
