import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import { format } from "date-fns";

type Duration = {
    fromDate: string;
    toDate: string;
};

type HeaderProps = {
    title: string;
    buttonText?: string;
    buttonFunction?: () => void;
    isReport?: boolean;
    secondButtonFunction?: () => void;
    secondButtonText?: string;
    searchTerm?: string;
    setSearchTerm?: React.Dispatch<React.SetStateAction<string>>;
    isSearchable?: boolean;
    duration?: Duration;
    setDuration?: React.Dispatch<React.SetStateAction<Duration>>;
};

const Header: React.FC<HeaderProps> = ({
    title,
    buttonText,
    buttonFunction,
    isReport,
    secondButtonFunction,
    secondButtonText,
    isSearchable,
    searchTerm,
    setSearchTerm,
    duration,
    setDuration,
}) => {
    return (
        <Card className="mt-2 p-2 title" bg="light">
            <div className="d-flex justify-content-between align-items-center">
                <div className="h3 my-auto">{title}</div>
                <div className="d-flex gap-2 align-items-center">
                    {isSearchable && (
                        <>
                            <Form.Control
                                id="searchTerm"
                                placeholder="Search"
                                value={searchTerm || ""}
                                onChange={(e) =>
                                    setSearchTerm?.(e.target.value)
                                }
                            />
                            <Form.Control
                                id="fromDate"
                                type="date"
                                value={duration?.fromDate}
                                onChange={(e) =>
                                    setDuration &&
                                    setDuration((p) => ({
                                        ...p,
                                        fromDate: format(
                                            e.target.value,
                                            "yyyy-MM-dd"
                                        ),
                                    }))
                                }
                            />
                            <Form.Control
                                id="toDate"
                                type="date"
                                value={duration?.toDate}
                                onChange={(e) =>
                                    setDuration &&
                                    setDuration((p) => ({
                                        ...p,
                                        toDate: format(
                                            e.target.value,
                                            "yyyy-MM-dd"
                                        ),
                                    }))
                                }
                            />
                        </>
                    )}
                    {buttonText && (
                        <Button
                            variant="dark"
                            className={`d-flex gap-1 ${
                                isSearchable ? "w-100" : ""
                            }`}
                            onClick={buttonFunction}
                        >
                            <box-icon
                                name={isReport ? "down-arrow-circle" : "plus"}
                                color="white"
                            ></box-icon>
                            <div>{buttonText}</div>
                        </Button>
                    )}
                    {isReport && (
                        <Button
                            variant="dark"
                            className="d-flex gap-1"
                            onClick={secondButtonFunction}
                        >
                            <box-icon
                                name={"down-arrow-circle"}
                                color="white"
                            ></box-icon>
                            <div>{secondButtonText}</div>
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default Header;
