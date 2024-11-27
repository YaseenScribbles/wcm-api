import { Button, Card, Form } from "react-bootstrap";

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
    setSearchTerm
}) => {
    return (
        <Card className="mt-2 p-2 title" bg="light">
            <div className="d-flex justify-content-between align-items-center">
                <div className="h3 my-auto">{title}</div>
                <div className="d-flex gap-1 align-items-center">
                    {
                        isSearchable && (<>
                            <Form.Control id="searchTerm" placeholder="Search" value={searchTerm || ""} onChange={(e) => setSearchTerm?.(e.target.value) } />
                        </>)
                    }
                    {buttonText && (
                        <Button
                            variant="dark"
                            className="d-flex gap-1 w-75"
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
