import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Button,
  IconButton,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  HStack,
  Image,
  Badge,
  Divider,
  Container,
  Tooltip,
  useBreakpointValue,
  Skeleton
} from '@chakra-ui/react'
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/menu'
import {
  FiSearch,
  FiFilter,
  FiPlay,
  FiEdit,
  FiDownload,
  FiMoreVertical,
  FiPlus,
  FiFolder,
  FiInfo
} from 'react-icons/fi'
import { useState, useEffect } from 'react'

const LibraryPage = () => {
  // Responsive adjustments
  const headingSize = useBreakpointValue({ base: "xl", md: "2xl" })
  const cardColumns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 })
  
  // Loading state
  const [loading, setLoading] = useState(true)
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <Box className="fade-in">
      <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
        <Box mb={8} className="slide-in-up">
          <Heading as="h1" size={headingSize} mb={3} className="glow-text">
            Video Library
          </Heading>
          <Text fontSize="lg" mb={4} opacity={0.9}>
            Browse, organize, and manage your generated videos.
          </Text>
          
          <Badge colorScheme="brand" fontSize="sm" px={2} py={1} borderRadius="full">
            Organized Collection
          </Badge>
        </Box>

        <Flex 
          mb={6} 
          justify="space-between" 
          align="center" 
          wrap="wrap" 
          gap={4}
          className="slide-in-right"
        >
          <InputGroup maxW="400px">
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input 
              placeholder="Search videos..." 
              bg="gray.700" 
              _hover={{ borderColor: 'brand.400' }}
              _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
              transition="all 0.2s ease"
            />
          </InputGroup>

          <HStack spacing={4}>
            <Select 
              placeholder="All Videos" 
              maxW="200px" 
              bg="gray.700"
              _hover={{ borderColor: 'brand.400' }}
              _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
              transition="all 0.2s ease"
            >
              <option value="hedra">Hedra Videos</option>
              <option value="runway">RunwayML Videos</option>
              <option value="edited">Edited Videos</option>
            </Select>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<FiFilter />}
                variant="outline"
                className="btn-hover"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'md'
                }}
                transition="all 0.2s ease"
              >
                Filter
              </MenuButton>
              <MenuList bg="gray.800" borderColor="gray.700">
                <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>
                  Date: Newest First
                </MenuItem>
                <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>
                  Date: Oldest First
                </MenuItem>
                <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>
                  Name: A-Z
                </MenuItem>
                <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>
                  Duration: Longest First
                </MenuItem>
              </MenuList>
            </Menu>
            <Button 
              leftIcon={<FiPlus />} 
              colorScheme="brand"
              className="btn-hover"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg'
              }}
              transition="all 0.2s ease"
            >
              New Folder
            </Button>
          </HStack>
        </Flex>

        <Box mb={8} className="slide-in-up">
          <Heading as="h2" size="md" mb={4} className="slide-in-right">
            Recent Videos
          </Heading>
          <SimpleGrid columns={cardColumns} spacing={6}>
            {loading ? (
              // Loading skeletons
              Array(4).fill(0).map((_, index) => (
                <Card key={`skeleton-${index}`} bg="gray.800" overflow="hidden" className="stagger-item">
                  <Skeleton height="160px" />
                  <CardBody>
                    <Skeleton height="20px" width="70%" mb={2} />
                    <Skeleton height="15px" width="50%" mb={4} />
                    <Flex justify="space-between">
                      <Skeleton height="24px" width="80px" />
                      <Skeleton height="24px" width="24px" borderRadius="full" />
                    </Flex>
                  </CardBody>
                </Card>
              ))
            ) : (
              <>
                {/* Video Card 1 */}
                <Card 
                  bg="gray.800" 
                  overflow="hidden" 
                  className="stagger-item card-hover"
                  _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
                  transition="all 0.3s ease"
                >
                  <Box position="relative">
                    <Image
                      src="/assets/images/Mike_Avatar.jpeg"
                      alt="Video thumbnail"
                      w="100%"
                      h="160px"
                      objectFit="cover"
                    />
                    <Flex
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      bg="rgba(0,0,0,0.3)"
                      justify="center"
                      align="center"
                      opacity={0}
                      _hover={{ opacity: 1 }}
                      transition="opacity 0.2s"
                    >
                      <IconButton
                        aria-label="Play video"
                        icon={<FiPlay />}
                        colorScheme="brand"
                        size="lg"
                        isRound
                      />
                    </Flex>
                    <Badge
                      position="absolute"
                      bottom={2}
                      right={2}
                      colorScheme="gray"
                      bg="rgba(0,0,0,0.6)"
                    >
                      00:45
                    </Badge>
                  </Box>
                  <CardBody>
                    <Heading as="h3" size="sm" mb={1}>
                      Product Introduction
                    </Heading>
                    <Text fontSize="xs" color="gray.400" mb={3}>
                      Created with Hedra • 2 days ago
                    </Text>
                    <Flex justify="space-between">
                      <HStack>
                        <IconButton
                          aria-label="Edit video"
                          icon={<FiEdit />}
                          variant="ghost"
                          size="sm"
                        />
                        <IconButton
                          aria-label="Download video"
                          icon={<FiDownload />}
                          variant="ghost"
                          size="sm"
                        />
                      </HStack>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          aria-label="More options"
                          icon={<FiMoreVertical />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList bg="gray.800" borderColor="gray.700">
                          <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>
                            Rename
                          </MenuItem>
                          <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>
                            Move to Folder
                          </MenuItem>
                          <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>
                            Duplicate
                          </MenuItem>
                          <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }} color="red.300">
                            Delete
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Flex>
                  </CardBody>
                </Card>

                {/* Video Card 2 */}
                <Card 
                  bg="gray.800" 
                  overflow="hidden"
                  className="stagger-item card-hover"
                  _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
                  transition="all 0.3s ease"
                >
                  <Box position="relative">
                    <Image
                      src="/assets/images/MIra_Avatar.jpeg"
                      alt="Video thumbnail"
                      w="100%"
                      h="160px"
                      objectFit="cover"
                    />
                    <Flex
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      bg="rgba(0,0,0,0.3)"
                      justify="center"
                      align="center"
                      opacity={0}
                      _hover={{ opacity: 1 }}
                      transition="opacity 0.2s"
                    >
                      <IconButton
                        aria-label="Play video"
                        icon={<FiPlay />}
                        colorScheme="brand"
                        size="lg"
                        isRound
                      />
                    </Flex>
                    <Badge
                      position="absolute"
                      bottom={2}
                      right={2}
                      colorScheme="gray"
                      bg="rgba(0,0,0,0.6)"
                    >
                      01:20
                    </Badge>
                  </Box>
                  <CardBody>
                    <Heading as="h3" size="sm" mb={1}>
                      Feature Walkthrough
                    </Heading>
                    <Text fontSize="xs" color="gray.400" mb={3}>
                      Created with Hedra • 3 days ago
                    </Text>
                    <Flex justify="space-between">
                      <HStack>
                        <IconButton
                          aria-label="Edit video"
                          icon={<FiEdit />}
                          variant="ghost"
                          size="sm"
                        />
                        <IconButton
                          aria-label="Download video"
                          icon={<FiDownload />}
                          variant="ghost"
                          size="sm"
                        />
                      </HStack>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          aria-label="More options"
                          icon={<FiMoreVertical />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList bg="gray.800" borderColor="gray.700">
                          <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>
                            Rename
                          </MenuItem>
                          <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>
                            Move to Folder
                          </MenuItem>
                          <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>
                            Duplicate
                          </MenuItem>
                          <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }} color="red.300">
                            Delete
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Flex>
                  </CardBody>
                </Card>

                {/* Video Card 3 */}
                <Card 
                  bg="gray.800" 
                  overflow="hidden"
                  className="stagger-item card-hover"
                  _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
                  transition="all 0.3s ease"
                >
                  <Box position="relative">
                    <Box
                      bg="gray.700"
                      w="100%"
                      h="160px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text color="gray.500">Combined Video</Text>
                    </Box>
                    <Flex
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      bg="rgba(0,0,0,0.3)"
                      justify="center"
                      align="center"
                      opacity={0}
                      _hover={{ opacity: 1 }}
                      transition="opacity 0.2s"
                    >
                      <IconButton
                        aria-label="Play video"
                        icon={<FiPlay />}
                        colorScheme="brand"
                        size="lg"
                        isRound
                      />
                    </Flex>
                    <Badge
                      position="absolute"
                      bottom={2}
                      right={2}
                      colorScheme="gray"
                      bg="rgba(0,0,0,0.6)"
                    >
                      02:30
                    </Badge>
                  </Box>
                  <CardBody>
                    <Heading as="h3" size="sm" mb={1}>
                      Full Presentation
                    </Heading>
                    <Text fontSize="xs" color="gray.400" mb={3}>
                      Edited • 1 day ago
                    </Text>
                    <Flex justify="space-between">
                      <HStack>
                        <IconButton
                          aria-label="Edit video"
                          icon={<FiEdit />}
                          variant="ghost"
                          size="sm"
                        />
                        <IconButton
                          aria-label="Download video"
                          icon={<FiDownload />}
                          variant="ghost"
                          size="sm"
                        />
                      </HStack>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          aria-label="More options"
                          icon={<FiMoreVertical />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList bg="gray.800" borderColor="gray.700">
                          <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>
                            Rename
                          </MenuItem>
                          <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>
                            Move to Folder
                          </MenuItem>
                          <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>
                            Duplicate
                          </MenuItem>
                          <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }} color="red.300">
                            Delete
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Flex>
                  </CardBody>
                </Card>

                {/* Add New Video Card */}
                <Card 
                  bg="gray.800" 
                  overflow="hidden" 
                  borderStyle="dashed" 
                  borderWidth="2px" 
                  borderColor="gray.600"
                  _hover={{ borderColor: 'brand.500', transform: 'translateY(-5px)', boxShadow: 'xl' }}
                  cursor="pointer"
                  className="stagger-item"
                  transition="all 0.3s ease"
                >
                  <Flex 
                    direction="column" 
                    justify="center" 
                    align="center" 
                    h="100%" 
                    p={6}
                  >
                    <Box 
                      bg="gray.700" 
                      borderRadius="full" 
                      p={4} 
                      mb={4}
                      className="pulse"
                    >
                      <FiPlus size={24} />
                    </Box>
                    <Heading as="h3" size="sm" mb={2}>
                      Create New Video
                    </Heading>
                    <Text fontSize="sm" textAlign="center">
                      Generate a new video or upload existing content
                    </Text>
                  </Flex>
                </Card>
              </>
            )}
          </SimpleGrid>
        </Box>

        <Divider mb={8} />

        <Box mb={8} className="slide-in-up">
          <Heading as="h2" size="md" mb={4} className="slide-in-right">
            Folders
          </Heading>
          <SimpleGrid columns={cardColumns} spacing={6}>
            {/* Folder 1 */}
            <Card 
              bg="gray.800" 
              overflow="hidden" 
              cursor="pointer" 
              _hover={{ bg: 'gray.700', transform: 'translateY(-5px)', boxShadow: 'xl' }}
              className="stagger-item card-hover"
              transition="all 0.3s ease"
            >
              <CardBody>
                <Flex align="center">
                  <Box 
                    bg="gray.700" 
                    borderRadius="md" 
                    p={3} 
                    mr={4}
                    className="glow"
                  >
                    <FiFolder size={24} color="#4db5ff" />
                  </Box>
                  <Box>
                    <Heading as="h3" size="sm" mb={1}>
                      Product Videos
                    </Heading>
                    <Text fontSize="xs" color="gray.400">
                      5 videos
                    </Text>
                  </Box>
                </Flex>
              </CardBody>
            </Card>

            {/* Folder 2 */}
            <Card 
              bg="gray.800" 
              overflow="hidden" 
              cursor="pointer" 
              _hover={{ bg: 'gray.700', transform: 'translateY(-5px)', boxShadow: 'xl' }}
              className="stagger-item card-hover"
              transition="all 0.3s ease"
            >
              <CardBody>
                <Flex align="center">
                  <Box 
                    bg="gray.700" 
                    borderRadius="md" 
                    p={3} 
                    mr={4}
                    className="glow"
                  >
                    <FiFolder size={24} color="#4db5ff" />
                  </Box>
                  <Box>
                    <Heading as="h3" size="sm" mb={1}>
                      Tutorials
                    </Heading>
                    <Text fontSize="xs" color="gray.400">
                      3 videos
                    </Text>
                  </Box>
                </Flex>
              </CardBody>
            </Card>

            {/* Folder 3 */}
            <Card 
              bg="gray.800" 
              overflow="hidden" 
              cursor="pointer" 
              _hover={{ bg: 'gray.700', transform: 'translateY(-5px)', boxShadow: 'xl' }}
              className="stagger-item card-hover"
              transition="all 0.3s ease"
            >
              <CardBody>
                <Flex align="center">
                  <Box 
                    bg="gray.700" 
                    borderRadius="md" 
                    p={3} 
                    mr={4}
                    className="glow"
                  >
                    <FiFolder size={24} color="#4db5ff" />
                  </Box>
                  <Box>
                    <Heading as="h3" size="sm" mb={1}>
                      Branding
                    </Heading>
                    <Text fontSize="xs" color="gray.400">
                      2 videos
                    </Text>
                  </Box>
                </Flex>
              </CardBody>
            </Card>

            {/* Add New Folder Card */}
            <Card 
              bg="gray.800" 
              overflow="hidden" 
              borderStyle="dashed" 
              borderWidth="2px" 
              borderColor="gray.600"
              _hover={{ borderColor: 'brand.500', transform: 'translateY(-5px)', boxShadow: 'xl' }}
              cursor="pointer"
              className="stagger-item"
              transition="all 0.3s ease"
            >
              <CardBody>
                <Flex align="center" justify="center" h="100%" py={2}>
                  <Box 
                    bg="gray.700" 
                    borderRadius="md" 
                    p={3} 
                    mr={4}
                    className="pulse"
                  >
                    <FiPlus size={24} color="#4db5ff" />
                  </Box>
                  <Box>
                    <Heading as="h3" size="sm" mb={1}>
                      New Folder
                    </Heading>
                    <Text fontSize="xs" color="gray.400">
                      Organize your videos
                    </Text>
                  </Box>
                </Flex>
              </CardBody>
            </Card>
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  )
}

export default LibraryPage
