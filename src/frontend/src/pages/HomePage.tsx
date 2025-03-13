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
  useColorModeValue,
  Badge,
  Divider,
  Container,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  StatHelpText,
  useBreakpointValue,
  Spacer
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { FiVideo, FiEdit, FiFolder, FiPlay, FiArrowRight, FiCpu, FiLayers, FiZap } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Keyframes for the floating animation
const floating = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const HomePage = () => {
  const cardBg = useColorModeValue('gray.800', 'gray.800')
  const cardHoverBg = useColorModeValue('gray.700', 'gray.700')
  const floatingAnimation = `${floating} 3s ease-in-out infinite`
  
  // Responsive adjustments
  const headingSize = useBreakpointValue({ base: "xl", md: "2xl" })
  const cardColumns = useBreakpointValue({ base: 1, md: 3 })
  const avatarSize = useBreakpointValue({ base: "150px", md: "200px" })
  
  // Stats for the dashboard
  const [stats, setStats] = useState({
    videosCreated: 0,
    videosEdited: 0,
    totalDuration: 0
  })
  
  // Simulate loading stats
  useEffect(() => {
    // This would normally fetch from an API
    const timer = setTimeout(() => {
      setStats({
        videosCreated: 12,
        videosEdited: 8,
        totalDuration: 45
      })
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <Box className="fade-in">
      <Box 
        mb={12} 
        textAlign="center" 
        py={16} 
        position="relative"
        overflow="hidden"
        borderRadius="lg"
        bg="gray.900"
        boxShadow="xl"
      >
        {/* Background glow effect */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width="60%"
          height="60%"
          bg="brand.500"
          opacity="0.1"
          filter="blur(60px)"
          borderRadius="full"
        />
        
        <Heading 
          as="h1" 
          size={headingSize} 
          mb={6} 
          className="glow-text" 
          color="brand.300"
          letterSpacing="-1px"
          fontWeight="bold"
          textTransform="uppercase"
          animation={floatingAnimation}
        >
          Vidocrisy
        </Heading>
        
        <Text 
          fontSize={{ base: "lg", md: "xl" }} 
          maxW="800px" 
          mx="auto"
          mb={8}
          opacity={0.9}
        >
          Your personal AI video generation platform
        </Text>
        
        <Badge 
          colorScheme="brand" 
          fontSize="sm" 
          p={2} 
          borderRadius="full"
          className="pulse"
        >
          Powered by Hedra AI
        </Badge>
      </Box>
      
      {/* Stats Section */}
      <Container maxW="container.lg" mb={12}>
        <StatGroup 
          bg="gray.800" 
          p={6} 
          borderRadius="lg" 
          boxShadow="md"
          className="slide-in-up"
        >
          <Stat>
            <StatLabel>Videos Created</StatLabel>
            <StatNumber className="glow-text">{stats.videosCreated}</StatNumber>
            <StatHelpText>Using Hedra AI</StatHelpText>
          </Stat>
          
          <Stat>
            <StatLabel>Videos Edited</StatLabel>
            <StatNumber className="glow-text">{stats.videosEdited}</StatNumber>
            <StatHelpText>With transitions</StatHelpText>
          </Stat>
          
          <Stat>
            <StatLabel>Total Duration</StatLabel>
            <StatNumber className="glow-text">{stats.totalDuration} min</StatNumber>
            <StatHelpText>Of content</StatHelpText>
          </Stat>
        </StatGroup>
      </Container>

      <Container maxW="container.lg" mb={16}>
        <Heading as="h2" size="lg" mb={6} className="slide-in-right">
          Features
        </Heading>
        
        <SimpleGrid columns={cardColumns} spacing={8} mb={12}>
          <Card 
            bg={cardBg} 
            _hover={{ bg: cardHoverBg, transform: 'translateY(-8px)', boxShadow: 'xl' }} 
            transition="all 0.3s ease-in-out"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            className="card-hover stagger-item"
            borderWidth="1px"
            borderColor="gray.700"
          >
            <CardHeader borderBottomWidth="1px" borderColor="gray.700">
              <Flex align="center">
                <Box 
                  bg="rgba(0, 136, 230, 0.2)" 
                  p={2} 
                  borderRadius="md" 
                  mr={3}
                  className="glow"
                >
                  <Icon as={FiVideo} boxSize={6} color="brand.400" />
                </Box>
                <Heading size="md">Generate</Heading>
              </Flex>
            </CardHeader>
            <CardBody>
              <VStack align="start" spacing={4} h="100%">
                <Text>Create talking head videos with Mike and Mira avatars using Hedra AI.</Text>
                <Spacer />
                <Button 
                  as={RouterLink} 
                  to="/generator" 
                  rightIcon={<FiArrowRight />} 
                  colorScheme="brand"
                  className="btn-hover"
                  size="md"
                  w="full"
                >
                  Start Creating
                </Button>
              </VStack>
            </CardBody>
          </Card>

          <Card 
            bg={cardBg} 
            _hover={{ bg: cardHoverBg, transform: 'translateY(-8px)', boxShadow: 'xl' }} 
            transition="all 0.3s ease-in-out"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            className="card-hover stagger-item"
            borderWidth="1px"
            borderColor="gray.700"
          >
            <CardHeader borderBottomWidth="1px" borderColor="gray.700">
              <Flex align="center">
                <Box 
                  bg="rgba(0, 136, 230, 0.2)" 
                  p={2} 
                  borderRadius="md" 
                  mr={3}
                  className="glow"
                >
                  <Icon as={FiEdit} boxSize={6} color="brand.400" />
                </Box>
                <Heading size="md">Edit</Heading>
              </Flex>
            </CardHeader>
            <CardBody>
              <VStack align="start" spacing={4} h="100%">
                <Text>Splice, trim, and combine videos with easy-to-apply transitions.</Text>
                <Spacer />
                <Button 
                  as={RouterLink} 
                  to="/editor" 
                  rightIcon={<FiArrowRight />} 
                  colorScheme="brand"
                  className="btn-hover"
                  size="md"
                  w="full"
                >
                  Start Editing
                </Button>
              </VStack>
            </CardBody>
          </Card>

          <Card 
            bg={cardBg} 
            _hover={{ bg: cardHoverBg, transform: 'translateY(-8px)', boxShadow: 'xl' }} 
            transition="all 0.3s ease-in-out"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            className="card-hover stagger-item"
            borderWidth="1px"
            borderColor="gray.700"
          >
            <CardHeader borderBottomWidth="1px" borderColor="gray.700">
              <Flex align="center">
                <Box 
                  bg="rgba(0, 136, 230, 0.2)" 
                  p={2} 
                  borderRadius="md" 
                  mr={3}
                  className="glow"
                >
                  <Icon as={FiFolder} boxSize={6} color="brand.400" />
                </Box>
                <Heading size="md">Library</Heading>
              </Flex>
            </CardHeader>
            <CardBody>
              <VStack align="start" spacing={4} h="100%">
                <Text>Browse, organize, and manage your generated videos.</Text>
                <Spacer />
                <Button 
                  as={RouterLink} 
                  to="/library" 
                  rightIcon={<FiArrowRight />} 
                  colorScheme="brand"
                  className="btn-hover"
                  size="md"
                  w="full"
                >
                  View Library
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Container>
      
      {/* Technology Section */}
      <Container maxW="container.lg" mb={12}>
        <Heading as="h2" size="lg" mb={6} className="slide-in-right">
          Technology
        </Heading>
        
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={12}>
          <Card 
            bg="gray.800" 
            p={6} 
            borderRadius="lg" 
            boxShadow="md"
            className="stagger-item"
            borderWidth="1px"
            borderColor="gray.700"
          >
            <VStack spacing={4} align="center">
              <Icon as={FiCpu} boxSize={10} color="brand.300" />
              <Heading size="md">AI-Powered</Heading>
              <Text textAlign="center">
                Leveraging advanced AI models to generate realistic talking head videos.
              </Text>
            </VStack>
          </Card>
          
          <Card 
            bg="gray.800" 
            p={6} 
            borderRadius="lg" 
            boxShadow="md"
            className="stagger-item"
            borderWidth="1px"
            borderColor="gray.700"
          >
            <VStack spacing={4} align="center">
              <Icon as={FiLayers} boxSize={10} color="brand.300" />
              <Heading size="md">Customizable</Heading>
              <Text textAlign="center">
                Multiple export options with various formats and quality settings.
              </Text>
            </VStack>
          </Card>
          
          <Card 
            bg="gray.800" 
            p={6} 
            borderRadius="lg" 
            boxShadow="md"
            className="stagger-item"
            borderWidth="1px"
            borderColor="gray.700"
          >
            <VStack spacing={4} align="center">
              <Icon as={FiZap} boxSize={10} color="brand.300" />
              <Heading size="md">Fast & Efficient</Heading>
              <Text textAlign="center">
                Optimized video processing for quick generation and editing.
              </Text>
            </VStack>
          </Card>
        </SimpleGrid>
      </Container>

      <Container maxW="container.lg" mb={16}>
        <Heading as="h2" size="lg" mb={8} className="slide-in-right">
          Your Avatars
        </Heading>
        
        <Flex 
          direction={{ base: "column", md: "row" }} 
          justify="center"
          align="center"
          gap={{ base: 8, md: 12 }}
          className="slide-in-up"
        >
          <VStack 
            spacing={4} 
            mb={{ base: 8, md: 0 }}
            mr={{ base: 0, md: 12 }}
            className="stagger-item"
          >
            <Box 
              position="relative" 
              className="glow"
              borderRadius="lg"
              overflow="hidden"
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.05)" }}
            >
              <Image 
                src="/Mike_Avatar.jpeg" 
                alt="Mike Avatar" 
                borderRadius="lg" 
                boxSize={avatarSize}
                objectFit="cover"
              />
              <Box 
                position="absolute" 
                bottom={0} 
                left={0} 
                right={0} 
                bg="rgba(0,0,0,0.7)" 
                p={2}
                backdropFilter="blur(5px)"
              >
                <Text fontWeight="bold" fontSize="lg" textAlign="center">Mike</Text>
              </Box>
            </Box>
            <Badge colorScheme="brand" fontSize="sm">Professional Male</Badge>
          </VStack>
          
          <VStack 
            spacing={4}
            className="stagger-item"
          >
            <Box 
              position="relative" 
              className="glow"
              borderRadius="lg"
              overflow="hidden"
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.05)" }}
            >
              <Image 
                src="/MIra_Avatar.jpeg" 
                alt="Mira Avatar" 
                borderRadius="lg" 
                boxSize={avatarSize}
                objectFit="cover"
              />
              <Box 
                position="absolute" 
                bottom={0} 
                left={0} 
                right={0} 
                bg="rgba(0,0,0,0.7)" 
                p={2}
                backdropFilter="blur(5px)"
              >
                <Text fontWeight="bold" fontSize="lg" textAlign="center">Mira</Text>
              </Box>
            </Box>
            <Badge colorScheme="brand" fontSize="sm">Professional Female</Badge>
          </VStack>
        </Flex>
      </Container>
      
      {/* Call to Action */}
      <Box 
        bg="gray.800" 
        p={10} 
        borderRadius="lg" 
        textAlign="center"
        boxShadow="xl"
        mb={8}
        className="slide-in-up"
        borderWidth="1px"
        borderColor="gray.700"
      >
        <Heading size="lg" mb={4}>Ready to create your first AI video?</Heading>
        <Text mb={6} maxW="600px" mx="auto">
          Start generating professional-looking videos with just a few clicks.
        </Text>
        <Button 
          as={RouterLink} 
          to="/generator" 
          size="lg" 
          colorScheme="brand"
          rightIcon={<FiArrowRight />}
          className="btn-hover"
          px={8}
          py={6}
          fontSize="lg"
        >
          Get Started Now
        </Button>
      </Box>
    </Box>
  )
}

export default HomePage
