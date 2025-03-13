import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  IconButton,
  VStack,
  HStack,
  Divider,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  useToast,
  Progress,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Input,
  FormControl,
  FormLabel,
  Select,
  Textarea
} from '@chakra-ui/react';
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
  FiSkipForward,
  FiClock,
  FiScissors,
  FiLink
} from 'react-icons/fi';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import VideoPlayer from '../VideoPlayer';
import videoService from '../../services/video.service';
import editorService from '../../services/editor.service';
import { VideoMetadata } from '../../services/video.service';

// Define types
interface TimelineItem {
  id: string;
  type: 'video' | 'transition';
  videoId?: string;
  transitionType?: 'fade' | 'dissolve' | 'wipe' | 'zoom';
  duration: number;
  startTime: number;
  endTime: number;
  thumbnail?: string;
  title?: string;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

// Timeline Item Component
const TimelineItemComponent = ({ 
  item, 
  index, 
  moveItem, 
  removeItem, 
  selectItem,
  isSelected
}: { 
  item: TimelineItem; 
  index: number; 
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  removeItem: (index: number) => void;
  selectItem: (index: number) => void;
  isSelected: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'timelineItem',
    item: { type: 'timelineItem', id: item.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  const [, drop] = useDrop({
    accept: 'timelineItem',
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      
      // Get horizontal middle
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      
      // Get pixels to the left
      const hoverClientX = clientOffset!.x - hoverBoundingRect.left;
      
      // Only perform the move when the mouse has crossed half of the items width
      // When dragging rightward, only move when the cursor is after 50%
      // When dragging leftward, only move when the cursor is before 50%
      
      // Dragging rightward
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }
      
      // Dragging leftward
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }
      
      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex);
      
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  
  drag(drop(ref));
  
  const opacity = isDragging ? 0.4 : 1;
  
  return (
    <Box
      ref={ref}
      opacity={opacity}
      cursor="move"
      borderWidth="2px"
      borderColor={isSelected ? "brand.500" : "gray.600"}
      borderRadius="md"
      bg={item.type === 'video' ? "gray.700" : "purple.800"}
      p={2}
      mr={1}
      minWidth={item.type === 'video' ? "200px" : "50px"}
      height="80px"
      position="relative"
      onClick={() => selectItem(index)}
      _hover={{ borderColor: "brand.400" }}
    >
      {item.type === 'video' ? (
        <>
          <Text fontSize="sm" fontWeight="bold" isTruncated>
            {item.title || 'Untitled'}
          </Text>
          <Text fontSize="xs">
            {formatTime(item.startTime)} - {formatTime(item.endTime)}
          </Text>
          <HStack position="absolute" top={1} right={1}>
            <IconButton
              aria-label="Remove item"
              icon={<FiTrash2 size={12} />}
              size="xs"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                removeItem(index);
              }}
            />
          </HStack>
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
        </>
      ) : (
        <>
          <Text fontSize="xs" textAlign="center">
            {item.transitionType}
          </Text>
          <Text fontSize="xs" textAlign="center">
            {item.duration}s
          </Text>
          <HStack position="absolute" top={1} right={1}>
            <IconButton
              aria-label="Remove transition"
              icon={<FiTrash2 size={12} />}
              size="xs"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                removeItem(index);
              }}
            />
          </HStack>
        </>
      )}
    </Box>
  );
};

// Format time (seconds to MM:SS)
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

// Main VideoEditor Component
const VideoEditor = () => {
  const toast = useToast();
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [transitions, setTransitions] = useState<any[]>([]);
  const [brandingTemplates, setBrandingTemplates] = useState<any[]>([]);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [outputFilename, setOutputFilename] = useState('edited-video.mp4');
  const [outputDescription, setOutputDescription] = useState('');
  const [outputCategory, setOutputCategory] = useState('');
  const [outputTags, setOutputTags] = useState('');
  
  // Fetch videos and transitions on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch videos
        const fetchedVideos = await videoService.getAllVideos();
        setVideos(fetchedVideos);
        
        // Fetch transitions
        const fetchedTransitions = editorService.getAvailableTransitions();
        setTransitions(fetchedTransitions);
        
        // Fetch branding templates
        const fetchedBrandingTemplates = editorService.getAvailableBrandingTemplates();
        setBrandingTemplates(fetchedBrandingTemplates);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error fetching data',
          description: 'Could not load videos and transitions',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  // Move timeline item
  const moveTimelineItem = (dragIndex: number, hoverIndex: number) => {
    const dragItem = timelineItems[dragIndex];
    const newTimelineItems = [...timelineItems];
    newTimelineItems.splice(dragIndex, 1);
    newTimelineItems.splice(hoverIndex, 0, dragItem);
    
    // Update selected item index if it was moved
    if (selectedItemIndex === dragIndex) {
      setSelectedItemIndex(hoverIndex);
    } else if (
      selectedItemIndex !== null &&
      ((dragIndex < selectedItemIndex && hoverIndex >= selectedItemIndex) ||
        (dragIndex > selectedItemIndex && hoverIndex <= selectedItemIndex))
    ) {
      // Adjust selected item index if items were moved around it
      setSelectedItemIndex(
        dragIndex < selectedItemIndex ? selectedItemIndex - 1 : selectedItemIndex + 1
      );
    }
    
    setTimelineItems(newTimelineItems);
  };
  
  // Remove timeline item
  const removeTimelineItem = (index: number) => {
    const newTimelineItems = [...timelineItems];
    newTimelineItems.splice(index, 1);
    setTimelineItems(newTimelineItems);
    
    // Update selected item index if needed
    if (selectedItemIndex === index) {
      setSelectedItemIndex(null);
    } else if (selectedItemIndex !== null && selectedItemIndex > index) {
      setSelectedItemIndex(selectedItemIndex - 1);
    }
  };
  
  // Select timeline item
  const selectTimelineItem = (index: number) => {
    setSelectedItemIndex(index);
    
    // Set current video if the selected item is a video
    const item = timelineItems[index];
    if (item.type === 'video' && item.videoId) {
      setCurrentVideo(item.videoId);
    } else {
      setCurrentVideo(null);
    }
  };
  
  // Add video to timeline
  const addVideoToTimeline = (video: VideoMetadata) => {
    const newItem: TimelineItem = {
      id: `video-${Date.now()}-${Math.round(Math.random() * 1E9)}`,
      type: 'video',
      videoId: video.id,
      duration: video.duration || 30, // Default to 30 seconds if duration is not available
      startTime: 0,
      endTime: video.duration || 30,
      thumbnail: video.thumbnailUrl,
      title: video.description || video.filename
    };
    
    setTimelineItems([...timelineItems, newItem]);
  };
  
  // Add transition to timeline
  const addTransitionToTimeline = (transitionType: 'fade' | 'dissolve' | 'wipe' | 'zoom') => {
    const newItem: TimelineItem = {
      id: `transition-${Date.now()}-${Math.round(Math.random() * 1E9)}`,
      type: 'transition',
      transitionType,
      duration: 1, // Default to 1 second
      startTime: 0,
      endTime: 1
    };
    
    // If there's a selected item, insert after it
    if (selectedItemIndex !== null) {
      const newTimelineItems = [...timelineItems];
      newTimelineItems.splice(selectedItemIndex + 1, 0, newItem);
      setTimelineItems(newTimelineItems);
      setSelectedItemIndex(selectedItemIndex + 1);
    } else {
      setTimelineItems([...timelineItems, newItem]);
      setSelectedItemIndex(timelineItems.length);
    }
  };
  
  // Update timeline item
  const updateTimelineItem = (index: number, updates: Partial<TimelineItem>) => {
    const newTimelineItems = [...timelineItems];
    newTimelineItems[index] = { ...newTimelineItems[index], ...updates };
    setTimelineItems(newTimelineItems);
  };
  
  // Combine videos
  const combineVideos = async () => {
    // Validate timeline
    if (timelineItems.length === 0) {
      toast({
        title: 'No videos to combine',
        description: 'Please add at least one video to the timeline',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }
    
    // Extract video IDs and transitions
    const videoIds: string[] = [];
    const transitionOptions: { type: 'fade' | 'dissolve' | 'wipe' | 'zoom'; duration: number }[] = [];
    
    timelineItems.forEach(item => {
      if (item.type === 'video' && item.videoId) {
        videoIds.push(item.videoId);
      } else if (item.type === 'transition' && item.transitionType) {
        transitionOptions.push({
          type: item.transitionType,
          duration: item.duration
        });
      }
    });
    
    if (videoIds.length === 0) {
      toast({
        title: 'No videos to combine',
        description: 'Please add at least one video to the timeline',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }
    
    // Start processing
    setProcessing(true);
    setProcessingProgress(0);
    
    try {
      // Combine videos
      const options = {
        videos: videoIds,
        transitions: transitionOptions.length > 0 ? transitionOptions : undefined,
        output: {
          filename: outputFilename,
          description: outputDescription,
          category: outputCategory,
          tags: outputTags ? outputTags.split(',') : undefined
        }
      };
      
      const videoId = await editorService.concatenateVideos(options, (progress) => {
        setProcessingProgress(progress);
      });
      
      // Processing complete
      setProcessing(false);
      setProcessingProgress(100);
      
      toast({
        title: 'Videos combined successfully',
        description: 'Your video is ready to view',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      
      // Set current video to the new video
      setCurrentVideo(videoId);
    } catch (error) {
      console.error('Error combining videos:', error);
      setProcessing(false);
      
      toast({
        title: 'Error combining videos',
        description: 'Could not combine videos',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };
  
  // Add branding to video
  const addBrandingToVideo = async (videoId: string, brandingType: string, brandingId: string) => {
    if (!videoId) {
      toast({
        title: 'No video selected',
        description: 'Please select a video to add branding to',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }
    
    // Start processing
    setProcessing(true);
    setProcessingProgress(0);
    
    try {
      // Create options based on branding type
      const options: any = {
        videoId,
        output: {
          filename: `branded-${Date.now()}.mp4`,
          description: `Branded version of video`,
          category: 'branded',
          tags: ['branded']
        }
      };
      
      if (brandingType === 'intro') {
        options.intro = brandingId;
      } else if (brandingType === 'outro') {
        options.outro = brandingId;
      } else if (brandingType === 'lowerThird') {
        options.lowerThird = {
          text: 'Sample Lower Third',
          position: 'bottom',
          duration: 5,
          startTime: 2
        };
      }
      
      // Add branding
      const newVideoId = await editorService.addBranding(options, (progress) => {
        setProcessingProgress(progress);
      });
      
      // Processing complete
      setProcessing(false);
      setProcessingProgress(100);
      
      toast({
        title: 'Branding added successfully',
        description: 'Your video is ready to view',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      
      // Set current video to the new video
      setCurrentVideo(newVideoId);
    } catch (error) {
      console.error('Error adding branding:', error);
      setProcessing(false);
      
      toast({
        title: 'Error adding branding',
        description: 'Could not add branding to video',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };
  
  // Trim video
  const trimVideo = async (videoId: string, startTime: number, endTime: number) => {
    if (!videoId) {
      toast({
        title: 'No video selected',
        description: 'Please select a video to trim',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }
    
    // Start processing
    setProcessing(true);
    setProcessingProgress(0);
    
    try {
      // Trim video
      const options = {
        videoId,
        startTime,
        endTime,
        output: {
          filename: `trimmed-${Date.now()}.mp4`,
          description: `Trimmed version of video`,
          category: 'trimmed',
          tags: ['trimmed']
        }
      };
      
      const newVideoId = await editorService.trimVideo(options, (progress) => {
        setProcessingProgress(progress);
      });
      
      // Processing complete
      setProcessing(false);
      setProcessingProgress(100);
      
      toast({
        title: 'Video trimmed successfully',
        description: 'Your video is ready to view',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      
      // Set current video to the new video
      setCurrentVideo(newVideoId);
    } catch (error) {
      console.error('Error trimming video:', error);
      setProcessing(false);
      
      toast({
        title: 'Error trimming video',
        description: 'Could not trim video',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
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
                
                {/* Processing indicator */}
                {processing && (
                  <Box mb={4}>
                    <Text mb={2}>Processing: {processingProgress}%</Text>
                    <Progress value={processingProgress} colorScheme="brand" size="sm" borderRadius="md" />
                  </Box>
                )}
                
                {/* Video preview */}
                <Box
                  bg="gray.900"
                  height="400px"
                  borderRadius="md"
                  mb={4}
                  overflow="hidden"
                >
                  {currentVideo ? (
                    <VideoPlayer
                      videoId={currentVideo}
                      width="100%"
                      height="100%"
                    />
                  ) : (
                    <Flex
                      justify="center"
                      align="center"
                      height="100%"
                    >
                      <Text color="gray.500">Select a video to preview</Text>
                    </Flex>
                  )}
                </Box>

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
                    {timelineItems.length > 0 ? (
                      timelineItems.map((item, index) => (
                        <TimelineItemComponent
                          key={item.id}
                          item={item}
                          index={index}
                          moveItem={moveTimelineItem}
                          removeItem={removeTimelineItem}
                          selectItem={selectTimelineItem}
                          isSelected={selectedItemIndex === index}
                        />
                      ))
                    ) : (
                      <Flex
                        justify="center"
                        align="center"
                        width="100%"
                        height="80px"
                        borderWidth="2px"
                        borderStyle="dashed"
                        borderColor="gray.600"
                        borderRadius="md"
                      >
                        <Text color="gray.500">Drag videos and transitions here</Text>
                      </Flex>
                    )}
                  </Flex>
                </Box>

                {/* Output options */}
                <Box mb={6}>
                  <Heading as="h3" size="md" mb={4}>
                    Output Options
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel>Filename</FormLabel>
                      <Input
                        value={outputFilename}
                        onChange={(e) => setOutputFilename(e.target.value)}
                        placeholder="Enter filename"
                        bg="gray.700"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Category</FormLabel>
                      <Input
                        value={outputCategory}
                        onChange={(e) => setOutputCategory(e.target.value)}
                        placeholder="Enter category"
                        bg="gray.700"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        value={outputDescription}
                        onChange={(e) => setOutputDescription(e.target.value)}
                        placeholder="Enter description"
                        bg="gray.700"
                        rows={2}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Tags (comma separated)</FormLabel>
                      <Input
                        value={outputTags}
                        onChange={(e) => setOutputTags(e.target.value)}
                        placeholder="Enter tags"
                        bg="gray.700"
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>

                <Flex justify="flex-end">
                  <HStack spacing={4}>
                    <Button
                      leftIcon={<FiScissors />}
                      variant="outline"
                      isDisabled={!currentVideo}
                      onClick={() => {
                        if (currentVideo) {
                          trimVideo(currentVideo, 0, 10); // Default to trimming first 10 seconds
                        }
                      }}
                    >
                      Trim Video
                    </Button>
                    <Button
                      leftIcon={<FiSave />}
                      variant="outline"
                      isDisabled={timelineItems.length === 0}
                      onClick={combineVideos}
                    >
                      Save Project
                    </Button>
                    <Button
                      leftIcon={<FiDownload />}
                      colorScheme="brand"
                      isDisabled={timelineItems.length === 0}
                      onClick={combineVideos}
                    >
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

                {/* Videos */}
                <Box mb={6}>
                  <Heading as="h4" size="sm" mb={2}>
                    Videos
                  </Heading>
                  <VStack spacing={3} align="stretch" maxHeight="200px" overflowY="auto">
                    {videos.map((video) => (
                      <Box
                        key={video.id}
                        p={2}
                        bg="gray.700"
                        borderRadius="md"
                        _hover={{ bg: 'gray.600' }}
                        cursor="pointer"
                        onClick={() => addVideoToTimeline(video)}
                      >
                        <Flex>
                          <Box
                            bg="gray.600"
                            boxSize="50px"
                            borderRadius="md"
                            mr={3}
                            overflow="hidden"
                          >
                            {video.thumbnailUrl ? (
                              <Image
                                src={video.thumbnailUrl}
                                alt="Video thumbnail"
                                boxSize="50px"
                                objectFit="cover"
                              />
                            ) : (
                              <Flex
                                align="center"
                                justify="center"
                                height="100%"
                              >
                                <Text fontSize="xs">No thumbnail</Text>
                              </Flex>
                            )}
                          </Box>
                          <Box>
                            <Text fontWeight="bold" fontSize="sm" isTruncated>
                              {video.description || video.filename}
                            </Text>
                            <Text fontSize="xs">
                              {video.duration ? formatTime(video.duration) : 'Unknown duration'} • {video.source}
                            </Text>
                          </Box>
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                </Box>

                <Divider mb={6} />

                {/* Transitions */}
                <Box mb={6}>
                  <Heading as="h4" size="sm" mb={2}>
                    Transitions
                  </Heading>
                  <SimpleGrid columns={2} spacing={3}>
                    {transitions.map((transition) => (
                      <Box
                        key={transition.id}
                        p={2}
                        bg="purple.800"
                        borderRadius="md"
                        textAlign="center"
                        _hover={{ bg: 'purple.700' }}
                        cursor="pointer"
                        onClick={() => addTransitionToTimeline(transition.id as 'fade' | 'dissolve' | 'wipe' | 'zoom')}
                      >
                        <Text fontSize="sm">{transition.name}</Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>

                <Divider mb={6} />

                {/* Branding */}
                <Box>
                  <Heading as="h4" size="sm" mb={2}>
                    Branding
                  </Heading>
                  <VStack spacing={3} align="stretch">
                    {brandingTemplates
                      .filter((template) => template.type === 'intro')
                      .map((template) => (
                        <Button
                          key={template.id}
                          variant="outline"
                          leftIcon={<FiPlus />}
                          size="sm"
                          onClick={() => {
                            if (currentVideo) {
                              addBrandingToVideo(currentVideo, 'intro', template.id);
                            }
                          }}
                          isDisabled={!currentVideo}
                        >
                          {template.name}
                        </Button>
                      ))}
                    
                    {brandingTemplates
                      .filter((template) => template.type === 'outro')
                      .map((template) => (
                        <Button
                          key={template.id}
                          variant="outline"
                          leftIcon={<FiPlus />}
                          size="sm"
                          onClick={() => {
                            if (currentVideo) {
                              addBrandingToVideo(currentVideo, 'outro', template.id);
                            }
                          }}
                          isDisabled={!currentVideo}
                        >
                          {template.name}
                        </Button>
                      ))}
                    
                    {brandingTemplates
                      .filter((template) => template.type === 'lowerThird')
                      .map((template) => (
                        <Button
                          key={template.id}
                          variant="outline"
                          leftIcon={<FiPlus />}
                          size="sm"
                          onClick={() => {
                            if (currentVideo) {
                              addBrandingToVideo(currentVideo, 'lowerThird', template.id);
                            }
                          }}
                          isDisabled={!currentVideo}
                        >
                          {template.name}
                        </Button>
                      ))}
                  </VStack>
                </Box>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Box>
    </DndProvider>
  );
};

export default VideoEditor;
