"use client";
import { getScreenshots, searchScreenshotOrg, selectOrgSS, toggleDisableScreenshot } from "@/app/api/screenshot-service";
import { Button } from "@heroui/button";
import { Calendar } from "@heroui/calendar";
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
          else if (screenshot.storage_type === 'base64' && screenshot.screenshot) {
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

    function parseDate(arg0: string): unknown {
        throw new Error("Function not implemented.");
    }

  return (
    <>
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
        {organizations.map((org) => (
          <div key={org.organization_id} className="row">
            <div className="flex items-center gap-3 mb-4">
              <Button className="text-lg font-semibold" 
              onPress={() => handleSelectOrg(org.organization_id)}
              >{org.name}</Button>
            </div>
          </div>
        ))}
      </div>
    }
      <div className="space-y-4">
        {selectedOrgUsers?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {selectedOrgUsers.map((user) => (
                <div key={`${user.email}-${user.name}`} className="w-full"> 
                <Card className="p-4 h-full flex flex-col">
                  <div className="flex flex-row mb-4">
                    <div className="flex flex-col gap-2">
                          <p className="font-medium truncate">{user.name}</p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                          <p className="text-sm text-gray-500">{user.role}</p>
                      </div>
                      <div className="flex flex-col items-center justify-center ml-4">
                          <p className="text-[12px] text-center mb-4">Total Screenshots</p>
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 border border-blue-300">
                              <p className="text-xs font-medium text-blue-600">{user.ss_total}</p>
                          </div>
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
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">{selectedUser.name}'s Screenshots</ModalHeader>
              <ModalBody className="justify-center">
                <Calendar
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
                                ${screenshot.is_deleted === 1 
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
            </>
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
    </>
  );
}