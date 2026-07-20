const Pagination = ({
    currentPage,
    totalPages,
    totalEntries,
    startEntry,
    endEntry,
    onPageChange,
}) => {

    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex items-center justify-between mt-8">

            <p
                className="
                    text-sm
                    text-muted-foreground
                "
            >
                Showing {startEntry} to {endEntry} of {totalEntries} entries
            </p>

            <div className="flex items-center gap-2">

                {/* Previous */}
                <button
                    onClick={() =>
                        onPageChange(currentPage - 1)
                    }
                    disabled={currentPage === 1}
                    className={`
                        w-9
                        h-9
                        rounded-md
                        flex
                        items-center
                        justify-center
                        transition-all

                        ${
                            currentPage === 1
                                ? "opacity-40 cursor-not-allowed card"
                                : "card hover:border-primary"
                        }
                    `}
                >
                    ←
                </button>

                {/* Page Numbers */}
                {pageNumbers.map((page) => (
                    <button
                        key={page}
                        onClick={() =>
                            onPageChange(page)
                        }
                        className={`
                            w-9
                            h-9
                            rounded-md
                            text-sm
                            transition-all

                            ${
                                currentPage === page
                                    ? "bg-primary text-black font-semibold"
                                    : "card hover:border-primary"
                            }
                        `}
                    >
                        {page}
                    </button>
                ))}

                {/* Next */}
                <button
                    onClick={() =>
                        onPageChange(currentPage + 1)
                    }
                    disabled={
                        currentPage === totalPages
                    }
                    className={`
                        w-9
                        h-9
                        rounded-md
                        flex
                        items-center
                        justify-center
                        transition-all

                        ${
                            currentPage === totalPages
                                ? "opacity-40 cursor-not-allowed card"
                                : "card hover:border-primary"
                        }
                    `}
                >
                    →
                </button>

            </div>

        </div>
    );
};

export default Pagination;