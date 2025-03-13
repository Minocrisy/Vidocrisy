import {
  Box,
  Heading,
  Text,
  Flex,
  Grid,
  GridItem,
  Card,
  CardBody,
  Button,
  IconButton,
  HStack,
  VStack,
  Divider,
  Tooltip,
  Image,
  SimpleGrid
} from '@chakra-ui/react'
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/menu'
import {
  FiPlus,
  FiTrash2,
  FiCopy,
  FiChevronUp,
  FiChevronDown,
  FiChevronRight,
  FiSettings,
  FiSave,
  FiDownload,
  FiUpload,
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward
} from 'react-icons/fi'

const EditorPage = () => {
  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>
        Video Editor
      </Heading>
      <Text mb={8}>
        Splice, trim, and combine videos with easy-to-apply transitions.
      </Text>

      <Grid templateColumns="1fr 300px" gap={6}>
        <GridItem>
          <Card bg="gray.800" mb={6}>
            <CardBody>
              <Heading as="h3" size="md" mb={4}>
                Preview
              </Heading>
              <Box
                bg="gray.900"
                height="400px"
                borderRadius="md"
                mb={4}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Text color="gray.500">Video preview will appear here</Text>
              </Box>
              <Flex justify="center" mb={2}>
                <HStack spacing={4}>
                  <IconButton
                    aria-label="Skip back"
                    icon={<FiSkipBack />}
                    variant="ghost"
                  />
                  <IconButton
                    aria-label="Play"
                    icon={<FiPlay />}
                    colorScheme="brand"
                    size="lg"
                    isRound
                  />
                  <IconButton
                    aria-label="Skip forward"
                    icon={<FiSkipForward />}
                    variant="ghost"
                  />
                </HStack>
              </Flex>
              <Flex bg="gray.700" height="20px" borderRadius="full" mb={6}>
                <Box bg="brand.500" width="30%" height="100%" borderRadius="full" />
              </Flex>

              <Heading as="h3" size="md" mb={4}>
                Timeline
              </Heading>
              <Box
                bg="gray.700"
                p={4}
                borderRadius="md"
                mb={4}
                overflowX="auto"
              >
                <Flex minWidth="800px">
                  {/* Video clip 1 */}
                  <Box
                    bg="brand.700"
                    width="200px"
                    height="80px"
                    borderRadius="md"
                    mr={1}
                    p={2}
                    position="relative"
                    className="drag-item"
                  >
                    <Text fontSize="sm" fontWeight="bold">Intro</Text>
                    <Text fontSize="xs">00:00 - 00:15</Text>
                    <Flex
                      position="absolute"
                      right="-10px"
                      top="50%"
                      transform="translateY(-50%)"
                      zIndex={2}
                      bg="gray.800"
                      borderRadius="full"
                      p={1}
                    >
                      <FiChevronRight />
                    </Flex>
                  </Box>

                  {/* Transition */}
                  <Box
                    bg="purple.700"
                    width="50px"
                    height="80px"
                    borderRadius="md"
                    mr={1}
                    p={2}
                    className="drag-item"
                  >
                    <Text fontSize="xs">Fade</Text>
                  </Box>

                  {/* Video clip 2 */}
                  <Box
                    bg="brand.600"
                    width="300px"
                    height="80px"
                    borderRadius="md"
                    mr={1}
                    p={2}
                    position="relative"
                    className="drag-item"
                  >
                    <Text fontSize="sm" fontWeight="bold">Main Content</Text>
                    <Text fontSize="xs">00:15 - 00:45</Text>
                    <Flex
                      position="absolute"
                      right="-10px"
                      top="50%"
                      transform="translateY(-50%)"
                      zIndex={2}
                      bg="gray.800"
                      borderRadius="full"
                      p={1}
                    >
                      <FiChevronRight />
                    </Flex>
                  </Box>

                  {/* Transition */}
                  <Box
                    bg="purple.700"
                    width="50px"
                    height="80px"
                    borderRadius="md"
                    mr={1}
                    p={2}
                    className="drag-item"
                  >
                    <Text fontSize="xs">Wipe</Text>
                  </Box>

                  {/* Video clip 3 */}
                  <Box
                    bg="brand.700"
                    width="150px"
                    height="80px"
                    borderRadius="md"
                    p={2}
                    className="drag-item"
                  >
                    <Text fontSize="sm" fontWeight="bold">Outro</Text>
                    <Text fontSize="xs">00:45 - 01:00</Text>
                  </Box>
                </Flex>
              </Box>

              <Flex justify="flex-end">
                <HStack spacing={4}>
                  <Button leftIcon={<FiSave />} variant="outline">
                    Save Project
                  </Button>
                  <Button leftIcon={<FiDownload />} colorScheme="brand">
                    Export Video
                  </Button>
                </HStack>
              </Flex>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg="gray.800" mb={6}>
            <CardBody>
              <Heading as="h3" size="md" mb={4}>
                Assets
              </Heading>
              <Flex justify="space-between" mb={4}>
                <Button leftIcon={<FiUpload />} size="sm" variant="outline">
                  Import
                </Button>
                <Button leftIcon={<FiPlus />} size="sm" colorScheme="brand">
                  New
                </Button>
              </Flex>

              <VStack spacing={3} align="stretch" mb={6}>
                <Box
                  p={2}
                  bg="gray.700"
                  borderRadius="md"
                  _hover={{ bg: 'gray.600' }}
                  cursor="pointer"
                >
                  <Flex>
                    <Image
                      src="/assets/images/Mike_Avatar.jpeg"
                      alt="Video thumbnail"
                      boxSize="50px"
                      borderRadius="md"
                      mr={3}
                      objectFit="cover"
                    />
                    <Box>
                      <Text fontWeight="bold" fontSize="sm">Mike Intro</Text>
                      <Text fontSize="xs">00:15 • Hedra</Text>
                    </Box>
                  </Flex>
                </Box>

                <Box
                  p={2}
                  bg="gray.700"
                  borderRadius="md"
                  _hover={{ bg: 'gray.600' }}
                  cursor="pointer"
                >
                  <Flex>
                    <Image
                      src="/assets/images/MIra_Avatar.jpeg"
                      alt="Video thumbnail"
                      boxSize="50px"
                      borderRadius="md"
                      mr={3}
                      objectFit="cover"
                    />
                    <Box>
                      <Text fontWeight="bold" fontSize="sm">Mira Explanation</Text>
                      <Text fontSize="xs">00:30 • Hedra</Text>
                    </Box>
                  </Flex>
                </Box>

                <Box
                  p={2}
                  bg="gray.700"
                  borderRadius="md"
                  _hover={{ bg: 'gray.600' }}
                  cursor="pointer"
                >
                  <Flex>
                    <Box
                      bg="gray.600"
                      boxSize="50px"
                      borderRadius="md"
                      mr={3}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize="xs">Logo</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" fontSize="sm">Minocrisy Outro</Text>
                      <Text fontSize="xs">00:10 • Branding</Text>
                    </Box>
                  </Flex>
                </Box>
              </VStack>

              <Divider mb={6} />

              <Heading as="h3" size="md" mb={4}>
                Transitions
              </Heading>
              <SimpleGrid columns={2} spacing={3} mb={6}>
                <Box
                  p={2}
                  bg="purple.800"
                  borderRadius="md"
                  textAlign="center"
                  _hover={{ bg: 'purple.700' }}
                  cursor="pointer"
                >
                  <Text fontSize="sm">Fade</Text>
                </Box>
                <Box
                  p={2}
                  bg="purple.800"
                  borderRadius="md"
                  textAlign="center"
                  _hover={{ bg: 'purple.700' }}
                  cursor="pointer"
                >
                  <Text fontSize="sm">Dissolve</Text>
                </Box>
                <Box
                  p={2}
                  bg="purple.800"
                  borderRadius="md"
                  textAlign="center"
                  _hover={{ bg: 'purple.700' }}
                  cursor="pointer"
                >
                  <Text fontSize="sm">Wipe</Text>
                </Box>
                <Box
                  p={2}
                  bg="purple.800"
                  borderRadius="md"
                  textAlign="center"
                  _hover={{ bg: 'purple.700' }}
                  cursor="pointer"
                >
                  <Text fontSize="sm">Zoom</Text>
                </Box>
              </SimpleGrid>

              <Divider mb={6} />

              <Heading as="h3" size="md" mb={4}>
                Branding
              </Heading>
              <VStack spacing={3} align="stretch">
                <Button variant="outline" leftIcon={<FiPlus />} size="sm">
                  Add Intro
                </Button>
                <Button variant="outline" leftIcon={<FiPlus />} size="sm">
                  Add Outro
                </Button>
                <Button variant="outline" leftIcon={<FiPlus />} size="sm">
                  Add Lower Third
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  )
}

export default EditorPage
