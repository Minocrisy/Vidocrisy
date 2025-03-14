import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Box,
  Divider,
  useToast,
  Tooltip,
  IconButton,
  Flex,
  Badge
} from '@chakra-ui/react';
import { FiInfo, FiDownload, FiSettings, FiCheck } from 'react-icons/fi';
import editorService, { ExportOptions } from '../../services/editor.service';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string | null;
  onExportComplete: (newVideoId: string) => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  videoId,
  onExportComplete
}) => {
  const toast = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Export options
  const [format, setFormat] = useState<'mp4' | 'webm' | 'mov'>('mp4');
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [customResolution, setCustomResolution] = useState(false);
  const [width, setWidth] = useState(1280);
  const [height, setHeight] = useState(720);
  const [fps, setFps] = useState(30);
  const [filename, setFilename] = useState(`export-${Date.now()}.mp4`);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('exports');
  const [tags, setTags] = useState('exported');
  
  // Get available formats and quality presets
  const formats = editorService.getAvailableExportFormats();
  const qualities = editorService.getAvailableExportQualities();
  
  // Update filename extension when format changes
  React.useEffect(() => {
    const selectedFormat = formats.find(f => f.id === format);
    if (selectedFormat && filename) {
      const baseName = filename.split('.')[0];
      setFilename(`${baseName}${selectedFormat.extension}`);
    }
  }, [format, formats, filename]);
  
  // Update resolution when quality changes
  React.useEffect(() => {
    if (!customResolution) {
      const selectedQuality = qualities.find(q => q.id === quality);
      if (selectedQuality) {
        setWidth(selectedQuality.resolution.width);
        setHeight(selectedQuality.resolution.height);
        setFps(selectedQuality.fps);
      }
    }
  }, [quality, qualities, customResolution]);
  
  const handleExport = async () => {
    if (!videoId) {
      toast({
        title: 'No video selected',
        description: 'Please select a video to export',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }
    
    setIsExporting(true);
    setProgress(0);
    
    try {
      const options: ExportOptions = {
        videoId,
        format,
        quality,
        output: {
          filename,
          description,
          category,
          tags: tags.split(',').map(tag => tag.trim())
        }
      };
      
      // Add resolution if using custom resolution
      if (customResolution) {
        options.resolution = {
          width,
          height
        };
        options.fps = fps;
      }
      
      const newVideoId = await editorService.exportVideo(options, (progress) => {
        setProgress(progress);
      });
      
      toast({
        title: 'Video exported successfully',
        description: 'Your video has been exported with the selected settings',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      
      onExportComplete(newVideoId);
      onClose();
    } catch (error) {
      console.error('Error exporting video:', error);
      toast({
        title: 'Export failed',
        description: 'There was an error exporting your video',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="gray.800">
        <ModalHeader>Export Video</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>
            Configure export settings for your video. Higher quality and resolution will result in larger file sizes.
          </Text>
          
          <Box mb={6} className="slide-in-up">
            <Flex align="center" mb={2}>
              <FormLabel fontWeight="bold" mb={0}>Format</FormLabel>
              <Tooltip label="Choose the output format for your video" placement="top" hasArrow>
                <IconButton
                  aria-label="Format information"
                  icon={<FiInfo />}
                  size="xs"
                  variant="ghost"
                  ml={1}
                />
              </Tooltip>
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              {formats.map((formatOption) => (
                <Box
                  key={formatOption.id}
                  p={3}
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor={format === formatOption.id ? 'brand.500' : 'gray.600'}
                  bg={format === formatOption.id ? 'gray.700' : 'gray.800'}
                  cursor="pointer"
                  onClick={() => setFormat(formatOption.id as 'mp4' | 'webm' | 'mov')}
                  _hover={{ borderColor: 'brand.400', transform: 'translateY(-2px)' }}
                  transition="all 0.2s ease"
                  className="card-hover"
                  position="relative"
                >
                  {format === formatOption.id && (
                    <Badge 
                      position="absolute" 
                      top={2} 
                      right={2} 
                      colorScheme="brand" 
                      borderRadius="full"
                    >
                      <FiCheck size={10} />
                    </Badge>
                  )}
                  <Text fontWeight="bold">{formatOption.name}</Text>
                  <Text fontSize="sm">{formatOption.description}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
          
          <Box mb={6} className="slide-in-up" style={{ animationDelay: '0.1s' }}>
            <Flex align="center" mb={2}>
              <FormLabel fontWeight="bold" mb={0}>Quality Preset</FormLabel>
              <Tooltip label="Select a quality preset for your export" placement="top" hasArrow>
                <IconButton
                  aria-label="Quality information"
                  icon={<FiInfo />}
                  size="xs"
                  variant="ghost"
                  ml={1}
                />
              </Tooltip>
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              {qualities.map((qualityOption) => (
                <Box
                  key={qualityOption.id}
                  p={3}
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor={quality === qualityOption.id ? 'brand.500' : 'gray.600'}
                  bg={quality === qualityOption.id ? 'gray.700' : 'gray.800'}
                  cursor="pointer"
                  onClick={() => {
                    setQuality(qualityOption.id as 'low' | 'medium' | 'high');
                    setCustomResolution(false);
                  }}
                  _hover={{ borderColor: 'brand.400', transform: 'translateY(-2px)' }}
                  transition="all 0.2s ease"
                  className="card-hover"
                  position="relative"
                >
                  {quality === qualityOption.id && (
                    <Badge 
                      position="absolute" 
                      top={2} 
                      right={2} 
                      colorScheme="brand" 
                      borderRadius="full"
                    >
                      <FiCheck size={10} />
                    </Badge>
                  )}
                  <Text fontWeight="bold">{qualityOption.name}</Text>
                  <Text fontSize="sm">{qualityOption.description}</Text>
                  <Text fontSize="xs" mt={1}>
                    {qualityOption.resolution.width}x{qualityOption.resolution.height}, {qualityOption.fps} fps
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
          
          <Box mb={6} className="slide-in-up" style={{ animationDelay: '0.2s' }}>
            <Flex align="center" mb={2}>
              <FormLabel fontWeight="bold" mb={0}>Resolution Settings</FormLabel>
              <Tooltip label="Choose between preset or custom resolution" placement="top" hasArrow>
                <IconButton
                  aria-label="Resolution information"
                  icon={<FiInfo />}
                  size="xs"
                  variant="ghost"
                  ml={1}
                />
              </Tooltip>
            </Flex>
            
            <Box 
              p={4} 
              borderWidth="1px" 
              borderRadius="md" 
              borderColor="gray.600"
              bg="gray.800"
              mb={4}
            >
              <FormControl display="flex" alignItems="center" mb={4}>
                <RadioGroup value={customResolution ? 'custom' : 'preset'} onChange={(value) => setCustomResolution(value === 'custom')}>
                  <Stack direction="row">
                    <Radio value="preset">Use quality preset</Radio>
                    <Radio value="custom">Custom resolution</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
              
              {customResolution && (
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} className="fade-in">
                  <FormControl>
                    <FormLabel>Width</FormLabel>
                    <Input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(parseInt(e.target.value))}
                      bg="gray.700"
                      _hover={{ borderColor: 'brand.400' }}
                      _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                      transition="all 0.2s ease"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Height</FormLabel>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(parseInt(e.target.value))}
                      bg="gray.700"
                      _hover={{ borderColor: 'brand.400' }}
                      _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                      transition="all 0.2s ease"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>FPS</FormLabel>
                    <Input
                      type="number"
                      value={fps}
                      onChange={(e) => setFps(parseInt(e.target.value))}
                      bg="gray.700"
                      _hover={{ borderColor: 'brand.400' }}
                      _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                      transition="all 0.2s ease"
                    />
                  </FormControl>
                </SimpleGrid>
              )}
            </Box>
          </Box>
          
          <Divider my={6} />
          
          <Box mb={6} className="slide-in-up" style={{ animationDelay: '0.3s' }}>
            <Flex align="center" mb={2}>
              <FormLabel fontWeight="bold" mb={0}>Output Options</FormLabel>
              <Tooltip label="Metadata for your exported video" placement="top" hasArrow>
                <IconButton
                  aria-label="Output information"
                  icon={<FiInfo />}
                  size="xs"
                  variant="ghost"
                  ml={1}
                />
              </Tooltip>
            </Flex>
            
            <Box 
              p={4} 
              borderWidth="1px" 
              borderRadius="md" 
              borderColor="gray.600"
              bg="gray.800"
            >
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl>
                  <FormLabel>Filename</FormLabel>
                  <Input
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    bg="gray.700"
                    _hover={{ borderColor: 'brand.400' }}
                    _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                    transition="all 0.2s ease"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    bg="gray.700"
                    _hover={{ borderColor: 'brand.400' }}
                    _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                    transition="all 0.2s ease"
                  />
                </FormControl>
                <FormControl gridColumn={{ md: 'span 2' }}>
                  <FormLabel>Description</FormLabel>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    bg="gray.700"
                    _hover={{ borderColor: 'brand.400' }}
                    _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                    transition="all 0.2s ease"
                  />
                </FormControl>
                <FormControl gridColumn={{ md: 'span 2' }}>
                  <FormLabel>Tags (comma separated)</FormLabel>
                  <Input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    bg="gray.700"
                    _hover={{ borderColor: 'brand.400' }}
                    _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                    transition="all 0.2s ease"
                  />
                </FormControl>
              </SimpleGrid>
            </Box>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button 
            variant="ghost" 
            mr={3} 
            onClick={onClose} 
            isDisabled={isExporting}
            _hover={{ bg: 'gray.700' }}
          >
            Cancel
          </Button>
          <Button 
            colorScheme="brand" 
            onClick={handleExport} 
            isLoading={isExporting}
            loadingText={`Exporting (${progress}%)`}
            isDisabled={!videoId}
            leftIcon={<FiDownload />}
            className="btn-hover"
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg'
            }}
            transition="all 0.2s ease"
          >
            Export Video
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ExportDialog;
