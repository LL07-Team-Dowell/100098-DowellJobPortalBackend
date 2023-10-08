import { useEffect } from "react";

export default function useListenToKeyStrokeInElement (elemRef, keyToListenTo, callbackFunction, isContentEditableComp=false) {

    useEffect( () => {

        const handleClick = (e) => {
            if (isContentEditableComp) {
                if (!elemRef?.current?.el?.current) return

                if ((e.key !== keyToListenTo) || (!elemRef?.current?.el?.current?.contains(e.target))) return;

                callbackFunction(e);

                return
            }

            if (!elemRef.current) return;

            if ((e.key !== keyToListenTo) || (!elemRef.current.contains(e.target))) return;

            callbackFunction(e);
        }

        document.addEventListener("keydown", handleClick, true);

        return () => {
            document.removeEventListener("keydown", handleClick, true);
        }

    }, [elemRef, keyToListenTo, callbackFunction, isContentEditableComp]);

}
