import React from "react";

const SearchIcon: React.FC = () => {
    return (
        <>
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute top-4 left-3"
            >
                <circle cx="11" cy="11" r="6" stroke="#222222" />
                <path d="M20 20L17 17" stroke="#222222" strokeLinecap="round" />
            </svg>
        </>
    );
};

export default SearchIcon;
