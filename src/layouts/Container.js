import React from "react";

/**
 * A container component that wraps children elements inside a div.
 *
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The child elements to be wrapped by the container.
 * @returns {JSX.Element} A div wrapping the children with a "container" class.
 */
function Container({ children }) {
  return (
    // Wrapper div with a "container" class for styling
    <div className="container">
      {children}
    </div>
  );
}

export default Container;
