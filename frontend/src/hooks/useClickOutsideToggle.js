import { useEffect, useRef, useState } from 'react'

const useClickOutsideToggle = () => {
    //   Automatically close the burger menu when user clicks on nav Link
    //   First we need to know if the burger menu is expanded or not 
    //   Secondly, we need to know if the user has clicked outside the burger menu or not
    //   To track the burger menu clicks we'll need to reference teh DOM using the useRef hook and we'll 
    //   also need to add and remove the mouseUp event from the HTML document in the useEffect hook to watch 
    //   for when the user lets go of their mouse click

    // Keep track of whether the user has clicked on the burger menu to expand it. Destructure two variables, expanded and setExpanded
    // in an array that is return by the useState hook. The initial value will be false, meaning that the menu will initially be collapsed.
    // Then set react boostrap Navbar expanded prop to the expanded value that is coming from teh useState hook
    // Then add the onClick attribute to the Navbar.Toggle element and set it to an arrow function that calls setExpanded with the opposite of the current value of the expanded variable
    const [expanded, setExpanded] = useState(false)

    // Handle functionality so that burger menu collapses when we choose one of it's options
    // Then pass the Navbar.Toggle element the ref prop
    const ref = useRef(null)
    // Because we called the useRef hook, the Navbar.Toggle is saved in the ref variable's current attribute. 
    useEffect(() => {
        const handleClickOutside = (event) => {
            // We'll first check the element has been assigned to it. We need this because its initial value is set to null. and then we'll check if the user has clicked away from the referenced button
            // If they have, we'll call setExpanded with false, which will close our dropdown menu.
            if (ref.current && !ref.current.contains(event.target)){
                setExpanded(false)
            }
        }

        document.addEventListener('mouseup', handleClickOutside)
        // It's good practice to remove event listeners in case it's used on an element that could unmount
        return () => {
            document.removeEventListener('mouseup', handleClickOutside)
        }
    }, [ref])

    // Return an object that contains everything that the NavBar component needs. To access these values we'll use and import the useClickOutsideToggle hook in NavBar.js
    return { expanded, setExpanded, ref };
}

export default useClickOutsideToggle