"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { registerUserBeta } from "@/app/api/beta-service";
import { addToast } from "@heroui/toast";

const RegisterBeta: React.FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [userLimit, setUserLimit] = useState(0);
    const [emailTouched, setEmailTouched] = useState(false);
    const [userLimitTouched, setUserLimitTouched] = useState(false);
    const [nameTouched, setNameTouched] = useState(false);


    const isValidEmail = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const isEmailInvalid = emailTouched && !isValidEmail(email);
    const isUserLimitInvalid = userLimitTouched && (userLimit < 1 || userLimit > 50);
    const isNameInvalid = nameTouched && name.trim() === "";

    const handleRegister = async () => {
        if (!isValidEmail(email)) {
            setEmailTouched(true);
        }

        if (name.trim() === "") {
            setNameTouched(true);
        }

        if (userLimit < 1 || userLimit > 50) {
            setUserLimitTouched(true);
        }

        if (!isValidEmail(email) || userLimit < 1 || userLimit > 50) {
            addToast({
                title: "Please fix the errors before submitting.",
                timeout: 3000,
                color: "danger",
            }); 
            return;
        }

        try {
            const response = await registerUserBeta(name, email, userLimit);

            addToast({
                title: response.message || response.status,
                timeout: 3000,
                shouldShowTimeoutProgress: true,
                color: response.status === "success" ? "success" : "danger",
            });
        } catch (error: any) {
            addToast({
                title: "Something went wrong.",
                timeout: 3000,
                color: "danger",
            });
            console.error(error);
        }
    };

    return (
        <div>
            <Card className="max-w-[1200px]">
                <CardHeader className="flex gap-3">
                    <p className="text-md">Register and approve an account here</p>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Input
                        label="Full Name"
                        labelPlacement="inside"
                        placeholder="Enter respondent's full name"
                        type="text"
                        isRequired
                        value={name}
                        onChange={(e) => {
                        setName(e.target.value);
                        setNameTouched(true);
                        }}
                        color={isNameInvalid ? "danger" : undefined}
                        errorMessage={isNameInvalid ? "Name is required" : ""}
                        className="mb-2"
                    />

                    <Input
                        label="Email"
                        labelPlacement="inside"
                        placeholder="Enter respondent's email"
                        type="email"
                        isRequired
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setEmailTouched(true)}
                        color={isEmailInvalid ? "danger" : undefined}
                        errorMessage={isEmailInvalid ? "Please enter a valid email" : ""}
                    />

                    <Input
                        isRequired
                        className="mt-2"
                        label="Number of users"
                        placeholder="Enter the amount"
                        type="number"
                        min="1"
                        max="50"
                        value={userLimit === 0 ? "" : String(userLimit)}
                        onChange={(e) => setUserLimit(Number(e.target.value))}
                        onBlur={() => setUserLimitTouched(true)}
                        color={isUserLimitInvalid ? "danger" : undefined}
                        errorMessage={isUserLimitInvalid ? "Value must be between 1 and 50" : ""}
                />
                </CardBody>

                <Divider />
                <CardFooter>
                    <Button color="primary" onClick={handleRegister}>
                        Register
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default RegisterBeta;
