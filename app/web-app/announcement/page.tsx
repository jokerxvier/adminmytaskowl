"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { getAnnouncements } from "@/app/api/announcement-service";
import { Chip } from "@heroui/chip";
import { Card } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Divider } from "@heroui/divider";

export default function AnnouncementPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const[title,setTitle] = useState<string | null>(null);
  const[content,setContent] = useState<string | null>(null);
  const[imageURL,setImageURL] = useState<string | null>(null);

  const handleGetAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const announcementData = await getAnnouncements();
      setAnnouncements(announcementData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch announcements"
      );
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  };



  // ✅ Run once after mount
  useEffect(() => {
    handleGetAnnouncements();
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
            <form className="space-y-4">
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Title:</label>
                <Input
                placeholder="Enter announcement title"
                variant="bordered"
                />
            </div>
            
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Content:</label>
                <Textarea
                placeholder="Enter announcement content"
                variant="bordered"
                minRows={3}
                />
            </div>
            
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Image:</label>
                <Input
                type="file"
                accept="image/*"
                variant="bordered"

                />
            </div>
            
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Expiration Date:</label>
                <Input
                type="datetime-local"
                variant="bordered"
                />
            </div>

            <Divider className="my-4" />
            
            <Button color="primary" type="submit" >
                Create Announcement
            </Button>
            </form>
        </Card>
      </div>

      <div>
        {loading && <p>Loading announcements...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {announcements.length > 0 && (
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
                    <TableCell>{record.content}</TableCell>
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
                    <TableCell><Button color={record.is_active === 1 ? "danger" : "success"}>
                        {record.is_active === 1 ? "Deactivate" : "Activate"}
                        </Button></TableCell>
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
