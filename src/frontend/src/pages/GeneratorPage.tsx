import { 
  Box, 
  Heading, 
  Text, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  Card,
  CardBody,
  SimpleGrid,
  Image,
  VStack,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  Select,
  HStack,
  IconButton,
  Flex,
  Spacer
} from '@chakra-ui/react'
import { FiPlay, FiDownload, FiSave, FiUpload } from 'react-icons/fi'

const GeneratorPage = () => {
  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>
        Video Generator
      </Heading>
      <Text mb={8}>
        Create talking head videos with AI avatars using Hedra.
      </Text>

      <Tabs variant="enclosed" colorScheme="brand" mb={8}>
        <TabList>
          <Tab>Hedra</Tab>
          <Tab>RunwayML</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Card bg="gray.800" p={4}>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                  <Box>
                    <Heading as="h3" size="md" mb={4}>
                      Avatar Selection
                    </Heading>
                    <SimpleGrid columns={2} spacing={4} mb={6}>
                      <VStack 
                        p={2} 
                        borderRadius="md" 
                        borderWidth="2px" 
                        borderColor="brand.500"
                        _hover={{ borderColor: 'brand.400' }}
                        cursor="pointer"
                      >
                        <Image 
                          src="/assets/images/Mike_Avatar.jpeg" 
                          alt="Mike Avatar" 
                          borderRadius="md" 
                          boxSize="120px"
                          objectFit="cover"
                        />
                        <Text fontWeight="bold">Mike</Text>
                      </VStack>
                      <VStack 
                        p={2} 
                        borderRadius="md" 
                        borderWidth="2px" 
                        borderColor="gray.600"
                        _hover={{ borderColor: 'brand.400' }}
                        cursor="pointer"
                      >
                        <Image 
                          src="/assets/images/MIra_Avatar.jpeg" 
                          alt="Mira Avatar" 
                          borderRadius="md" 
                          boxSize="120px"
                          objectFit="cover"
                        />
                        <Text fontWeight="bold">Mira</Text>
                      </VStack>
                    </SimpleGrid>

                    <FormControl mb={4}>
                      <FormLabel>Voice</FormLabel>
                      <Select bg="gray.700">
                        <option value="mike">Mike (Male)</option>
                        <option value="mira">Mira (Female)</option>
                        <option value="custom">Custom Voice</option>
                      </Select>
                    </FormControl>

                    <FormControl mb={4}>
                      <FormLabel>Video Resolution</FormLabel>
                      <Select bg="gray.700" defaultValue="720p">
                        <option value="720p">720p</option>
                        <option value="1080p">1080p</option>
                      </Select>
                    </FormControl>

                    <FormControl mb={4}>
                      <FormLabel>Aspect Ratio</FormLabel>
                      <Select bg="gray.700" defaultValue="16:9">
                        <option value="16:9">16:9 (Landscape)</option>
                        <option value="9:16">9:16 (Portrait)</option>
                        <option value="1:1">1:1 (Square)</option>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box>
                    <Heading as="h3" size="md" mb={4}>
                      Script
                    </Heading>
                    <FormControl mb={4}>
                      <FormLabel>Enter your script</FormLabel>
                      <Textarea 
                        placeholder="Type or paste your script here..." 
                        bg="gray.700"
                        rows={10}
                      />
                    </FormControl>

                    <FormControl mb={6}>
                      <FormLabel>Emotions & Gestures (Optional)</FormLabel>
                      <Textarea 
                        placeholder="Add emotions or gestures instructions..." 
                        bg="gray.700"
                        rows={3}
                      />
                    </FormControl>

                    <HStack spacing={4}>
                      <Button leftIcon={<FiUpload />} variant="outline">
                        Upload Audio
                      </Button>
                      <Spacer />
                      <Button 
                        colorScheme="brand" 
                        leftIcon={<FiPlay />}
                        size="lg"
                      >
                        Generate Video
                      </Button>
                    </HStack>
                  </Box>
                </SimpleGrid>
              </CardBody>
            </Card>
          </TabPanel>
          <TabPanel>
            <Card bg="gray.800" p={4}>
              <CardBody>
                <Text>RunwayML integration coming soon...</Text>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Card bg="gray.800" p={4} mb={8}>
        <CardBody>
          <Heading as="h3" size="md" mb={4}>
            Preview
          </Heading>
          <Box 
            bg="gray.900" 
            height="300px" 
            borderRadius="md" 
            display="flex" 
            justifyContent="center" 
            alignItems="center"
          >
            <Text color="gray.500">Video preview will appear here</Text>
          </Box>
          <Flex mt={4} justify="flex-end">
            <HStack spacing={4}>
              <Button leftIcon={<FiSave />} variant="outline">
                Save to Library
              </Button>
              <Button leftIcon={<FiDownload />} colorScheme="brand">
                Download
              </Button>
            </HStack>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  )
}

export default GeneratorPage
