const ApplyLeaveButton = ({
    onClick,
}) => {
    return (
        <button
            onClick={onClick}
            className="
                btn-primary
                px-5
                py-3
                flex
                items-center
                gap-2
                font-bold
                hover:bg-[#c59c14]
            "
        >
            <span className="text-lg leading-none">
                +
            </span>

            <span>
                Apply For Leave
            </span>
        </button>
    );
};

export default ApplyLeaveButton;