import { useEffect } from "react";

export default function useClickInside (elemRef, handleClickInside) {

    useEffect( () => {

        const handleClickInItem = (e) => {
            if (!elemRef.current) return;

            if( (e.key === "Escape")  || (elemRef.current && elemRef.current.contains(e.target)) ) handleClickInside();

        }

        document.addEventListener("click", handleClickInItem, true);
        document.addEventListener("keydown", handleClickInItem, true);

        return () => {
            document.removeEventListener("click", handleClickInItem, true);
            document.removeEventListener("keydown", handleClickInItem, true);
        }

    }, [elemRef, handleClickInside]);

}
