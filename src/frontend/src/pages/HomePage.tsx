import { 
  Box, 
  Heading, 
  Text, 
  SimpleGrid, 
  Card, 
  CardBody, 
  CardHeader,
  Button,
  Flex,
  Icon,
  VStack,
  HStack,
  Image,
  useColorModeValue
} from '@chakra-ui/react'
import { FiVideo, FiEdit, FiFolder, FiPlay } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'

const HomePage = () => {
  const cardBg = useColorModeValue('gray.800', 'gray.800')
  const cardHoverBg = useColorModeValue('gray.700', 'gray.700')

  return (
    <Box>
      <Box mb={8} textAlign="center" py={10}>
        <Heading as="h1" size="2xl" mb={4} className="glow-text" color="brand.300">
          VideoGen
        </Heading>
        <Text fontSize="xl" maxW="800px" mx="auto">
          Your personal AI video generation platform
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={12}>
        <Card 
          bg={cardBg} 
          _hover={{ bg: cardHoverBg, transform: 'translateY(-5px)' }} 
          transition="all 0.3s"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="lg"
        >
          <CardHeader>
            <Flex align="center">
              <Icon as={FiVideo} boxSize={6} color="brand.400" mr={2} />
              <Heading size="md">Generate</Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            <VStack align="start" spacing={4}>
              <Text>Create talking head videos with Mike and Mira avatars using Hedra AI.</Text>
              <Button 
                as={RouterLink} 
                to="/generator" 
                rightIcon={<FiPlay />} 
                colorScheme="brand"
              >
                Start Creating
              </Button>
            </VStack>
          </CardBody>
        </Card>

        <Card 
          bg={cardBg} 
          _hover={{ bg: cardHoverBg, transform: 'translateY(-5px)' }} 
          transition="all 0.3s"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="lg"
        >
          <CardHeader>
            <Flex align="center">
              <Icon as={FiEdit} boxSize={6} color="brand.400" mr={2} />
              <Heading size="md">Edit</Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            <VStack align="start" spacing={4}>
              <Text>Splice, trim, and combine videos with easy-to-apply transitions.</Text>
              <Button 
                as={RouterLink} 
                to="/editor" 
                rightIcon={<FiPlay />} 
                colorScheme="brand"
              >
                Start Editing
              </Button>
            </VStack>
          </CardBody>
        </Card>

        <Card 
          bg={cardBg} 
          _hover={{ bg: cardHoverBg, transform: 'translateY(-5px)' }} 
          transition="all 0.3s"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="lg"
        >
          <CardHeader>
            <Flex align="center">
              <Icon as={FiFolder} boxSize={6} color="brand.400" mr={2} />
              <Heading size="md">Library</Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            <VStack align="start" spacing={4}>
              <Text>Browse, organize, and manage your generated videos.</Text>
              <Button 
                as={RouterLink} 
                to="/library" 
                rightIcon={<FiPlay />} 
                colorScheme="brand"
              >
                View Library
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Box mb={12}>
        <Heading as="h2" size="lg" mb={6}>
          Your Avatars
        </Heading>
        <HStack spacing={8} justify="center">
          <VStack>
            <Image 
              src="/assets/images/Mike_Avatar.jpeg" 
              alt="Mike Avatar" 
              borderRadius="lg" 
              boxSize="200px"
              objectFit="cover"
              className="glow"
            />
            <Text fontWeight="bold" fontSize="lg">Mike</Text>
          </VStack>
          <VStack>
            <Image 
              src="/assets/images/MIra_Avatar.jpeg" 
              alt="Mira Avatar" 
              borderRadius="lg" 
              boxSize="200px"
              objectFit="cover"
              className="glow"
            />
            <Text fontWeight="bold" fontSize="lg">Mira</Text>
          </VStack>
        </HStack>
      </Box>
    </Box>
  )
}

export default HomePage
