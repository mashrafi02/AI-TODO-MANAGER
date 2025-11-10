
import { useEffect } from "react";

const clickOutside = (ref, fun) => {
    useEffect(() => {
        const clicked = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                fun()
            };
        }
    
        document.addEventListener('mousedown', clicked);
        document.addEventListener('touchstart', clicked);
    
        return () => {
            document.removeEventListener('mousedown', clicked);
            document.removeEventListener('touchstart', clicked);
        }
    }, [ref, fun])
}


export default clickOutside