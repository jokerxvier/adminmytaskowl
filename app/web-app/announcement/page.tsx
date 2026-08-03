"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { getAnnouncements, createAnnouncement, updateAnnouncement, createChatbotAnnouncement, getChatbotAnnouncements, toggleChatbotAnnouncementStatus } from "@/app/api/announcement-service";
import { Chip } from "@heroui/chip";
import { Card } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Divider } from "@heroui/divider";
import { RadioGroup, Radio } from "@heroui/radio";
import exp from "constants";
import SimpleRichEditor from "@/components/SimpleRichEditor";

export default function AnnouncementPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [chatbotAnnouncements, setChatbotAnnouncements] = useState<any[]>([]);
  const [chatbotListLoading, setChatbotListLoading] = useState(false);

  const [announcementType, setAnnouncementType] = useState<"web" | "chatbot">("web");
  const [chatbotMessage, setChatbotMessage] = useState<string>("");
  const [chatbotAttachment, setChatbotAttachment] = useState<File | null>(null);
  const [chatbotAttachmentPreview, setChatbotAttachmentPreview] = useState<string | null>(null);

  const[title,setTitle] = useState<string | null>(null);
  const[content,setContent] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const[expires_at,setExpiresAt] = useState<string | null>(null);
  const[redirect_url,setRedirectUrl] = useState<string | null>(null);

  const handleGetAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const announcementData = await getAnnouncements();
      setAnnouncements(announcementData);

      for (const record of announcementData) {
        if (record.image_url) {
          const cleanUrl = record.image_url.replace(/\\\//g, "/");
          record.image_url = cleanUrl;
        } else {
          record.image_url = null; // or provide a fallback placeholder
        }

        console.log("Cleaned Image URL:", record.image_url);
      }


    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch announcements"
      );
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (announcementType === "chatbot") {
        if (!chatbotMessage || chatbotMessage.trim() === "") {
          setError("Chatbot message is required.");
          setLoading(false);
          return;
        }
        await createChatbotAnnouncement(chatbotMessage, chatbotAttachment ?? undefined);
        setChatbotMessage(""); // clear form
        setChatbotAttachment(null);
        setChatbotAttachmentPreview(null);
        await handleGetChatbotAnnouncements();
      } else {
        if (!title || !content) {
          setError("Title and Content are required.");
          setLoading(false);
          return;
        }
        await createAnnouncement(title, content, imageFile ?? undefined, expires_at ?? undefined);
        
        // Clear form
        setTitle("");
        setContent("");
        setImageFile(null);
        setImagePreview(null);
        setExpiresAt(null);
        setRedirectUrl(null);
      }

      // Refresh the announcements list after creation
      await handleGetAnnouncements();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create announcement"
      );
      console.error("Error creating announcement:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateAnnouncementStatus = async(id:number) => {
    // To be implemented
    try {
      setLoading(true);
      setError(null);
      await updateAnnouncement(id);
      await handleGetAnnouncements();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update announcement"
      );
      console.error("Error updating announcement:", err);
    } finally {
      setLoading(false);
      await handleGetAnnouncements();
    }
  }

  const handleGetChatbotAnnouncements = async () => {
    try {
      setChatbotListLoading(true);
      const data = await getChatbotAnnouncements();
      setChatbotAnnouncements(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch chatbot announcements"
      );
      console.error("Error fetching chatbot announcements:", err);
    } finally {
      setChatbotListLoading(false);
    }
  };

  const handleToggleChatbotAnnouncementStatus = async (id: number) => {
    try {
      setChatbotListLoading(true);
      await toggleChatbotAnnouncementStatus(id);
      await handleGetChatbotAnnouncements();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update chatbot announcement"
      );
      console.error("Error updating chatbot announcement:", err);
    } finally {
      setChatbotListLoading(false);
    }
  };


  const formIsValid = announcementType === "chatbot" 
    ? chatbotMessage.trim() !== ""
    : (title !== null && title.trim() !== "" && 
       content !== null && content.trim() !== "" &&
       imageFile !== null && imageFile !== undefined &&
       expires_at !== null && expires_at !== undefined);


  // ✅ Run once after mount
  useEffect(() => {
    handleGetAnnouncements();
    handleGetChatbotAnnouncements();
  }, []);

  return (
    <div>
      <Breadcrumbs className="mb-4" radius="full" variant="solid">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/web-app">Web App</BreadcrumbItem>
        <BreadcrumbItem>Announcements</BreadcrumbItem>
      </Breadcrumbs>

      <div className="my-4">
       <h3 className="text-lg text-center font-medium my-8">
            Create New Announcement:
        </h3>
        <Card className="p-6">
            <div className="mb-6 flex justify-center">
              <RadioGroup
                orientation="horizontal"
                value={announcementType}
                onValueChange={(val) => setAnnouncementType(val as "web" | "chatbot")}
              >
                <Radio value="web">Web App Announcement</Radio>
                <Radio value="chatbot">Ollie Chatbot Announcement</Radio>
              </RadioGroup>
            </div>
            <form className="space-y-4">
            {announcementType === "web" ? (
              <>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Title:</label>
                <Input
                placeholder="Enter announcement title"
                variant="bordered"
                value={title || ""}
                onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Content:</label>
                  <SimpleRichEditor
                    content={content}
                    onChange={(value) => setContent(value)}
                    placeholder="Enter announcement content..."
                  />
                <div>
                  <div className="mt-2 text-xs text-gray-500">
                    HTML tags are supported: &lt;b&gt;bold&lt;/b&gt;, &lt;i&gt;italic&lt;/i&gt;, &lt;p&gt;paragraph&lt;/p&gt;, etc.
                  </div>
                </div>
            </div>
            
            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              variant="bordered"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file)); // 👈 create preview URL
                }
              }}
            />

            <Input type="text" placeholder="Redirect URL (optional)" variant="bordered" value={redirect_url || ""} onChange={(e) => setRedirectUrl(e.target.value)} />

            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Expiration Date:</label>
                <Input
                type="datetime-local"
                variant="bordered"
                value={expires_at || ""}
                onChange={(e) => setExpiresAt(e.target.value)}  
                />
            </div>
            </>
            ) : (
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Chatbot Message:</label>
                <Textarea
                  placeholder="Enter the message Ollie should announce... Use @user to insert the recipient's name."
                  variant="bordered"
                  value={chatbotMessage}
                  onChange={(e) => setChatbotMessage(e.target.value)}
                  onPaste={(e) => {
                    const items = e.clipboardData?.items;
                    if (items) {
                      for (let i = 0; i < items.length; i++) {
                        if (items[i].type.indexOf("image") !== -1) {
                          const file = items[i].getAsFile();
                          if (file) {
                            setChatbotAttachment(file);
                            setChatbotAttachmentPreview(URL.createObjectURL(file));
                            break;
                          }
                        }
                      }
                    }
                  }}
                  minRows={4}
                />
                <div className="mt-2 text-xs text-gray-500">
                  Tip: include <code>@user</code> in the message and it will be replaced with each recipient&apos;s name.
                </div>

                {chatbotAttachmentPreview && (
                  <div className="mt-3">
                    <img
                      src={chatbotAttachmentPreview}
                      alt="Attachment Preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}

                <label className="block mt-4 mb-2 text-sm font-medium">Attachment (optional):</label>
                <Input
                  type="file"
                  variant="bordered"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setChatbotAttachment(file);
                    if (file && file.type.startsWith("image/")) {
                      setChatbotAttachmentPreview(URL.createObjectURL(file));
                    } else {
                      setChatbotAttachmentPreview(null);
                    }
                  }}
                />
              </div>
            )}

            <Divider className="my-4" />

            <Button color="primary" type="submit" isDisabled={!formIsValid} onClick={handleCreateAnnouncement}>
                Create {announcementType === "web" ? "Web" : "Chatbot"} Announcement
            </Button>
            </form>
        </Card>
      </div>

      <div>
        {loading && <p>Loading announcements...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {announcementType === "web" && announcements.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg text-center font-medium my-8">
              Announcements on DB:
            </h3>

            <Table aria-label="Announcements table">
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Title</TableColumn>
                <TableColumn>Content</TableColumn>
                <TableColumn>Image</TableColumn>
                <TableColumn>Expires at</TableColumn>
                <TableColumn>Created at</TableColumn>
                <TableColumn>Action</TableColumn>
              </TableHeader>
              <TableBody>
                {announcements.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.id}</TableCell>
                    <TableCell>
                        <Chip color={
                            record.is_active === 1 ? "success" : "danger"
                        }>
                        {record.is_active ===1 ? "Active" : "Inactive"}
                        </Chip>

                        </TableCell>
                    <TableCell>{record.title}</TableCell>
                    <TableCell>
                      <div dangerouslySetInnerHTML={{ __html: record.content }} />
                      </TableCell>
                    <TableCell>
                      {record.image_url ? (
                        <img
                          src={record.image_url}
                          alt="Announcement Image"
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>{record.expires_at ?? "N/A"}</TableCell>
                    <TableCell>{record.created_at}</TableCell>
                    <TableCell><Button color={record.is_active === 1 ? "danger" : "success"} onClick={() => handleUpdateAnnouncementStatus(record.id)}  >
                        {record.is_active === 1 ? "Deactivate" : "Activate"}
                        </Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {announcementType === "chatbot" && chatbotListLoading && <p>Loading chatbot announcements...</p>}

        {announcementType === "chatbot" && chatbotAnnouncements.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg text-center font-medium my-8">
              Chatbot Announcements on DB:
            </h3>

            <Table aria-label="Chatbot announcements table">
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Message</TableColumn>
                <TableColumn>Attachment</TableColumn>
                <TableColumn>Created at</TableColumn>
                <TableColumn>Action</TableColumn>
              </TableHeader>
              <TableBody>
                {chatbotAnnouncements.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.id}</TableCell>
                    <TableCell>
                      <Chip color={record.is_active ? "success" : "danger"}>
                        {record.is_active ? "Active" : "Inactive"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="whitespace-pre-wrap">{record.message}</div>
                    </TableCell>
                    <TableCell>
                      {record.attachment_url ? (
                        <a href={record.attachment_url} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>{record.created_at}</TableCell>
                    <TableCell>
                      <Button
                        color={record.is_active ? "danger" : "success"}
                        onClick={() => handleToggleChatbotAnnouncementStatus(record.id)}
                      >
                        {record.is_active ? "Deactivate" : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
