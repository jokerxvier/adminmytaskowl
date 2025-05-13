'use client';
import { verifyPassword } from "@/app/api/auth-service";
import { Input } from "@heroui/input";
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Modal } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { useState } from "react";
  
  interface PasswordVerifyModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onVerified: () => void;
    title?: string;
    description?: string;
  }
  
  export const PasswordVerifyModal = ({
    isOpen,
    onOpenChange,
    onVerified,
    title = "Verify Your Identity",
    description = "Please enter your password to continue",
  }: PasswordVerifyModalProps) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSubmit = async () => {
      if (!password) {
        setError("Please enter your password");
        return;
      }
  
      setIsLoading(true);
      setError("");
  
      try {
        const { success } = await verifyPassword(password);
        if (success) {
          onVerified();
          onOpenChange(false);
          setPassword('');
        } else {
          setError("Incorrect password. Please try again.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Verification failed");
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {title}
              </ModalHeader>
              <ModalBody>
                <p>{description}</p>
                
                {error && (
                  <div className="text-red-500 text-sm mt-2">
                    {error}
                  </div>
                )}
  
                <Input
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  disabled={isLoading}
                  endContent={isLoading ? <Spinner size="sm" /> : null}
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };