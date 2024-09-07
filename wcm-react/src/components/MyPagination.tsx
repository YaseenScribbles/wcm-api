import { Pagination } from "react-bootstrap";

type MyPaginationProps = {
    currentPage: number;
    lastPage: number;
    setCurrentPage: (pageNo: number) => void;
};

const MyPagination: React.FC<MyPaginationProps> = ({
    currentPage,
    lastPage,
    setCurrentPage,
}) => {
    return (
        <Pagination size="sm">
            <Pagination.First
                onClick={() => {
                    setCurrentPage(1);
                }}
            />
            <Pagination.Prev
                onClick={() => {
                    if (currentPage - 1 >= 1) {
                        setCurrentPage(currentPage - 1);
                    }
                }}
            />
            <Pagination.Item onClick={() => setCurrentPage(1)}>
                {1}
            </Pagination.Item>
            <Pagination.Ellipsis />

            {currentPage - 2 > 1 && (
                <Pagination.Item
                    onClick={() => setCurrentPage(currentPage - 2)}
                >
                    {currentPage - 2}
                </Pagination.Item>
            )}
            {currentPage - 1 > 1 && (
                <Pagination.Item
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    {currentPage - 1}
                </Pagination.Item>
            )}
            <Pagination.Item active>{currentPage}</Pagination.Item>
            {currentPage + 1 < lastPage && (
                <Pagination.Item
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    {currentPage + 1}
                </Pagination.Item>
            )}
            {currentPage + 2 < lastPage && (
                <Pagination.Item
                    onClick={() => setCurrentPage(currentPage + 2)}
                >
                    {currentPage + 2}
                </Pagination.Item>
            )}

            <Pagination.Ellipsis />
            <Pagination.Item onClick={() => setCurrentPage(lastPage)}>
                {lastPage}
            </Pagination.Item>
            <Pagination.Next
                onClick={() => {
                    if (currentPage + 1 <= lastPage)
                        setCurrentPage(currentPage + 1);
                }}
            />
            <Pagination.Last onClick={() => setCurrentPage(lastPage)} />
        </Pagination>
    );
};

export default MyPagination;
