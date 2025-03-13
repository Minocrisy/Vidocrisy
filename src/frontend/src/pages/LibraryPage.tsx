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
  Divider
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
  FiFolder
} from 'react-icons/fi'

const LibraryPage = () => {
  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>
        Video Library
      </Heading>
      <Text mb={8}>
        Browse, organize, and manage your generated videos.
      </Text>

      <Flex mb={6} justify="space-between" align="center" wrap="wrap" gap={4}>
        <InputGroup maxW="400px">
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input placeholder="Search videos..." bg="gray.700" />
        </InputGroup>

        <HStack spacing={4}>
          <Select placeholder="All Videos" maxW="200px" bg="gray.700">
            <option value="hedra">Hedra Videos</option>
            <option value="runway">RunwayML Videos</option>
            <option value="edited">Edited Videos</option>
          </Select>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<FiFilter />}
              variant="outline"
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
          <Button leftIcon={<FiPlus />} colorScheme="brand">
            New Folder
          </Button>
        </HStack>
      </Flex>

      <Box mb={8}>
        <Heading as="h2" size="md" mb={4}>
          Recent Videos
        </Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
          {/* Video Card 1 */}
          <Card bg="gray.800" overflow="hidden">
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
          <Card bg="gray.800" overflow="hidden">
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
          <Card bg="gray.800" overflow="hidden">
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
            _hover={{ borderColor: 'brand.500' }}
            cursor="pointer"
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
        </SimpleGrid>
      </Box>

      <Divider mb={8} />

      <Box>
        <Heading as="h2" size="md" mb={4}>
          Folders
        </Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
          {/* Folder 1 */}
          <Card bg="gray.800" overflow="hidden" cursor="pointer" _hover={{ bg: 'gray.700' }}>
            <CardBody>
              <Flex align="center">
                <Box 
                  bg="gray.700" 
                  borderRadius="md" 
                  p={3} 
                  mr={4}
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
          <Card bg="gray.800" overflow="hidden" cursor="pointer" _hover={{ bg: 'gray.700' }}>
            <CardBody>
              <Flex align="center">
                <Box 
                  bg="gray.700" 
                  borderRadius="md" 
                  p={3} 
                  mr={4}
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
          <Card bg="gray.800" overflow="hidden" cursor="pointer" _hover={{ bg: 'gray.700' }}>
            <CardBody>
              <Flex align="center">
                <Box 
                  bg="gray.700" 
                  borderRadius="md" 
                  p={3} 
                  mr={4}
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
        </SimpleGrid>
      </Box>
    </Box>
  )
}

export default LibraryPage
