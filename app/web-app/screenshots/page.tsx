"use client";
import { getScreenshots, searchScreenshotOrg, selectOrgSS, toggleDisableScreenshot, getAvailableDates } from "@/app/api/screenshot-service";
import { Button } from "@heroui/button";
import { Calendar, DateValue } from "@heroui/calendar";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import React from "react";
import { useState } from "react";
import { Image } from "@heroui/image";
import { Code } from "@heroui/code";
import { FaExpand, FaImage, FaTrash, FaTrashRestore, } from "react-icons/fa";
import { Divider } from "@heroui/divider";
import { PasswordVerifyModal } from "@/components/verifyPassword";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";

export default function ScreenshotPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [selectedOrgUsers, setSelectedOrgUsers] = useState<any[]>([]);
  const [selectedOrgID, setSelectedOrgID] = useState<any>(null);
  const [selectedUserID, setSelectedUserID] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userScreenshots, setUserScreenshots] = useState<any[]>([]);
  const [availableDates, setAvailableDates] = useState<any[]>([]);
  const [date, setDate] = useState<any>(null);
  const {isOpen, onOpen, onClose} = useDisclosure();
  let [calendarValue, setCalendarValue] = useState<any>(null);

  const { 
    isOpen: isFullscreenOpen, 
    onOpen: onFullscreenOpen, 
    onClose: onFullscreenClose 
  } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Add this new function
  const handleOpenFullscreen = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    onFullscreenOpen();
  };

  const handleOpenModal = async (user: any) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAvailableDates(user.id, selectedOrgID);
    
      // Extract just the date strings (format: 'YYYY-MM-DD') from the API response
      const availableDates = data.map((item: any) => item.date); 
      // or if API returns full dates: data.map((item: any) => item.created_at.split('T')[0]);
      setAvailableDates(availableDates); // Store available dates for calendar disabling


      setSelectedUser(user)
      setSelectedUserID(user.id); // Fixed this line
      onOpen(); // Open modal after loading screenshots
    } catch (err: any) {
      setError(err.message || "Failed to load organization details.");
    } finally {
      setLoading(false);
    }
  };

  

  const handleGetScreenshots = async (date: any) => {
    setLoading(true);
    setError(null);
    try {
      const formattedDate = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
      setDate(date);
      
      const data = await getScreenshots(selectedOrgID, selectedUserID, formattedDate);
      
      const transformedScreenshots = await Promise.all(data.response.map(async (screenshot: any) => {
        let displaySource: string = '';
        let sourceType: 'blob' | 'base64' | 'invalid' = 'invalid';
        let blobData: Blob | null = null;
        let cleanup = () => {};
  
        try {
          // Handle storage type (convert signed URL to blob)
          if (screenshot.storage_type === 'storage') {
            if (screenshot.screenshot_url) {
              // Fetch the signed URL and convert to blob
              const response = await fetch(screenshot.screenshot_url);
              blobData = await response.blob();
              displaySource = URL.createObjectURL(blobData);
              sourceType = 'blob';
              cleanup = () => URL.revokeObjectURL(displaySource);
            }
          }
          // Handle base64 type
          else if (screenshot.storage_type === 'base64'|| screenshot.storage_type === 'missing' && screenshot.screenshot) {
            displaySource = `data:image/jpeg;base64,${screenshot.screenshot}`;
            sourceType = 'base64';
          }
  
          return {
            ...screenshot,
            screenshotGroupID: screenshot["screenshot-group-id"],
            displaySource,
            sourceType,
            blobData,
            isAvailable: !!displaySource,
            cleanup
          };
  
        } catch (error) {
          console.error('Error processing screenshot:', error);
          return {
            ...screenshot,
            displaySource: '',
            sourceType: 'invalid',
            blobData: null,
            isAvailable: false,
            cleanup: () => {}
          };
        }
      }));
  
      // Clean up previous screenshots before setting new ones
      setUserScreenshots(prev => {
        prev?.forEach(s => s.cleanup?.());
        return transformedScreenshots;
      });
  
    } catch (err: any) {
      setError(err.message || "Failed to load screenshots.");
    } finally {
      setLoading(false);
    }
  }


  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    setSelectedOrgID(null);
    setSelectedOrgUsers([]);
    try {
      const data = await searchScreenshotOrg(query);
      setOrganizations(data.response || []);
    } catch (err: any) {
      setError(err.message || "An error occurred while searching for organizations.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrg = async (orgId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await selectOrgSS(orgId); 
      setSelectedOrgUsers(data.response|| []);
      setSelectedOrgID(orgId);
    } catch (err: any) {
      setError(err.message || "Failed to load organization details.");
    } finally {
      setLoading(false);
    }
  };

      const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
      const [pendingAction, setPendingAction] = useState<{
        action: () => Promise<void>;
        description: string;
      } | null>(null);
      
  const requirePasswordVerification = (action: () => Promise<void>, description: string) => {
    setPendingAction({ action, description });
    setIsVerifyModalOpen(true);
  };

  return (
    <div>
      <PasswordVerifyModal
        isOpen={isVerifyModalOpen}
        onOpenChange={setIsVerifyModalOpen}
        onVerified={() => {
          if (pendingAction) {
            pendingAction.action();
          }
        }}
        title="Confirm Action"
        description={pendingAction?.description || ""}
      />
      <div className="flex flex-col w-full h-full">
        <h1 className="text-2xl font-bold">Screenshots</h1>
        <div className="flex flex-row gap-4 items-center mb-4">
          <Input
            placeholder="Search organization..."
            label="Organization"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onPress={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {!selectedOrgID && 
        <div className="space-y-4 grid">
          {organizations && query &&
            <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {organizations.length > 0 ? (
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Search results for {query}</span>
                      <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                        ({organizations.length} {organizations.length === 1 ? 'result' : 'results'})
                      </span>
                    </div>
                  ) : (
                    <div>
                      No results found for <span className="text-blue-600 dark:text-blue-400">"{query}"</span>
                    </div>
                  )}
                </h2>
                {organizations.length === 0 && (
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Try a different search term or check your spelling.
                  </p>
                )}
              <Divider className="my-4"/>
            </div>
          }
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {organizations.map((org) => (
              <div key={org.organization_id} className="row">
                <div className="flex items-center gap-3 mb-4">
                <Button
                  className="text-md font-semibold text-left"
                  size="lg"
                  color="secondary"
                  onPress={() => handleSelectOrg(org.organization_id)}
                >
                  <div className="w-full overflow-hidden">
                    <div className="truncate">{org.name}</div>
                    <div className="flex justify-center items-baseline text-sm font-normal">
                      <span className="truncate pr-2">{org.email}</span>
                      <span className="text-xs opacity-80">ID: {org.organization_id}</span>
                    </div>
                  </div>
                </Button>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      }
        <div className="space-y-4">
          {selectedOrgUsers?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {selectedOrgUsers.map((user) => (
                  <div key={`${user.email}-${user.name}`} className="w-full"> 
                  <Card className="p-4 h-full flex flex-col">
                    <div className="flex flex-row mb-4 items-center justify-between ">
                      <div className="flex flex-col gap-2">
                            <p className="font-lg truncate font-bold">{user.name}</p>
                            <p className="text-sm  truncate">{user.email}</p>
                            <p className="text-sm ">{user.role}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-[12px] text-center mb-4">Total Screenshots</p>
                            <div className="flex items-center justify-center align-center w-10 h-10 rounded-full bg-blue-100 border border-blue-300">
                                <p className="text-xs font-medium text-blue-600">{user.ss_total}</p>
                            </div>
                            <p className="text-sm text-gray-500">Blurred: <strong className="text-default-500">{user.is_blurred === 1 ? 'On' : 'Off'}</strong></p>
                            <p className="text-sm text-gray-500">Interval: <strong className="text-default-500">{user.ss_interval} Minutes</strong></p>
                        </div>
                    </div>
                    <Button onPress={() => handleOpenModal(user)}>View Screenshots</Button>
                  </Card>
                  </div>
              ))}
              </div>
          ) : (
              <p className="text-gray-500">No users found</p>
          )}
          </div>
          <div className="space-y-4">
          </div>
      </div>
      <Modal isOpen={isOpen} size='5xl' onClose={onClose} backdrop="blur" scrollBehavior="outside">
          <ModalContent>
            {(onClose) => (
              <div>
              {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                  <Spinner variant="simple" label={`Loading Screenshots of ${selectedUser.name} on ${date}`} />
                </div>
              )}
                <ModalHeader className="flex flex-col gap-1 text-center">{selectedUser.name}'s Screenshots</ModalHeader>
                <ModalBody className="justify-center">
                  <Calendar
                    isDateUnavailable={(date: DateValue) => {
                      return !availableDates.includes(date.toString());
                    }}
                      isDisabled={loading}
                      visibleMonths={3}
                      aria-label="Date (Controlled)" 
                      value={calendarValue}
                      onChange={(newDate) => {
                        setCalendarValue(newDate);
                        handleGetScreenshots(newDate);
                      }}
                  />    
                  <Divider className="my-4"/>           
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 p-4">
                    {userScreenshots.length > 0 ? (
                      userScreenshots.map((screenshot: any) => (
                        <Card key={screenshot.screenshot_id} className="h-full">
                        
                          <div className="flex flex-col gap-2 p-3 h-full">
                          <Code className="text-xs text-gray-500">
                              {new Date(screenshot.created_at).toLocaleString()}
                            </Code>
                            <div className="flex flex-row items-center justify-between gap-2">
                            <p className="text-sm font-medium truncate">ID: {screenshot.screenshot_id}</p>
                            <Code className="text-sm font-medium truncate">Group ID: {screenshot.screenshotGroupID}</Code>                            
                            <p className="text-sm font-medium truncate">Monitor: {screenshot.monitor}</p>
                            </div>
                            <div className="relative aspect-video overflow-hidden rounded-md bg-gray-100">
                            <Image

                                src={screenshot.displaySource}
                                alt={`Screenshot ${screenshot.screenshot_id}`}
                                className={`
                                  object-cover w-full h-full
                                  transition-all duration-300
                                  ${screenshot.is_deleted === 1 || loading
                                    ? 'filter blur-md opacity-75 cursor-not-allowed' 
                                    : 'cursor-pointer hover:scale-[1.02]'
                                  }
                                  ${!screenshot.isAvailable && 'hidden'}
                                `}
                                onClick={() => screenshot.isAvailable && handleOpenFullscreen(screenshot.displaySource)}
                              />
                            </div>
                            <div className="w-full flex justify-end mt-2">
                            {screenshot.is_deleted === 0 &&
                              <Button 
                                color="danger"
                                size="sm"
                                startContent={<FaTrash />}
                                className="hover:scale-105 transition-transform"
                                onPress={() => {
                                  requirePasswordVerification(async () => {
                                    toggleDisableScreenshot(screenshot.screenshot_id)
                                    handleGetScreenshots(date);
                                    addToast({
                                      title: "Screenshot Disabled",
                                      description: `${selectedUser.name}'s screenshot with ID: ${screenshot.screenshot_id} Deleted`,
                                      timeout: 3000,
                                      shouldShowTimeoutProgress: true,
                                      color:"danger"
                                    });
                                  },'Restore or Delete Screenshot')
                                }}
                                isLoading={loading}
                                disabled={loading}
                                >
                                  Delete
                              </Button>
                              }
                              {screenshot.is_deleted === 1  &&
                              <Button 
                                color="success"
                                size="sm"
                                startContent={<FaTrashRestore />}
                                className="hover:scale-105 transition-transform"
                                onPress={() => {
                                  requirePasswordVerification(async () => {
                                    toggleDisableScreenshot(screenshot.screenshot_id);
                                    handleGetScreenshots(date);
                                    addToast({
                                      title: "Screenshot Restored",
                                      description: `${selectedUser.name}'s screenshot with ID: ${screenshot.screenshot_id} Restored`,
                                      timeout: 3000,
                                      shouldShowTimeoutProgress: true,
                                      color:"success"
                                    });
                                  },'Restore or Delete Screenshot')
                                }}
                                isLoading={loading}
                                disabled={loading}
                                >
                                  Restore
                              </Button>
                              }
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full flex flex-col items-center justify-center py-12">
                        <div className="text-gray-400 mb-4">
                          <FaImage size={48} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-500">No screenshots found</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {date ? `for ${new Date(date).toLocaleDateString()}` : ''}
                        </p>
                      </div>
                    )}
                  </div>
                </ModalBody>
              </div>
            )}
          </ModalContent>
      </Modal>
      <Modal 
        isOpen={isFullscreenOpen} 
        size="5xl" 
        onClose={onFullscreenClose}
        backdrop="blur"
      >
        <ModalContent>
          <ModalBody className="flex items-center justify-center p-0">
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Fullscreen screenshot"
                className="object-contain w-full h-full max-h-screen"
                removeWrapper
              />
            )}
          </ModalBody>
          <ModalFooter className="absolute top-4 right-4">
            <Button 
              color="danger" 
              onPress={onFullscreenClose}
              isIconOnly
            >
              <FaExpand />
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  );
}