import { useEffect, useState } from "react";

const useDebounce = (text: string, duration: number = 500) => {
    const [debouncedText, setDebouncedText] = useState("");

    useEffect(() => {
        const timeOutId = setTimeout(() => {
            setDebouncedText(text);
        }, duration);

        return () => {
            clearTimeout(timeOutId);
        };
    }, [text, duration]);

    return debouncedText;
};

export default useDebounce;
