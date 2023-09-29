import { useEffect } from "react";

export default function useListenToKeyStrokeInElement (elemRef, keyToListenTo, callbackFunction) {

    useEffect( () => {

        const handleClick = (e) => {
            if (!elemRef.current) return;

            if (e.key !== keyToListenTo) return;

            callbackFunction();
        }

        document.addEventListener("keydown", handleClick, true);

        return () => {
            document.removeEventListener("keydown", handleClick, true);
        }

    }, [elemRef, keyToListenTo, callbackFunction]);

}
