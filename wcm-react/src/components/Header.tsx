import { Button, Card } from "react-bootstrap";

type HeaderProps = {
    title: string;
    buttonText: string;
    buttonFunction: () => void;
    isReport?: boolean;
};

const Header: React.FC<HeaderProps> = ({
    title,
    buttonText,
    buttonFunction,
    isReport,
}) => {
    return (
        <Card className="mt-2 p-2" bg="light">
            <div className="d-flex justify-content-between align-items-center">
                <div className="h3 my-auto">{title}</div>
                <div>
                    <Button
                        variant="dark"
                        className="d-flex gap-1"
                        onClick={buttonFunction}
                    >
                        <box-icon
                            name={isReport ? "down-arrow-circle" : "plus"}
                            color="white"
                        ></box-icon>
                        <div>{buttonText}</div>
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default Header;
