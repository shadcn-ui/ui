// ======================================= Day 1 =======================================
// How to set up the project environment
// What Dependencies used
// Read the folder tree
// Read the project structure
// How to implement Theme
// How to implement Reusable components
// Advanced code

// Read the project structure
    // For larger pages, use container
    // Use controlled components under the container
    // The main logic is in the container
// How to implement Theme
    // Using Atom instead of Redux
    // Use a third-party library to directly call the theme
    // const [config] = useConfig() dynamically read the current config
    // ThemeWrapper, by changing the class prefix, operates the mode
// How to implement Reusable components
    // For example, the Preview module
    // const Preview = React.useMemo(() => { designed this way to avoid performance issues

// Advanced code
    // const Codes = React.Children.toArray(children)
    // React.Children.toArray(children) is a utility function provided by React to work with children in a more manageable way. 
    // The children prop in React can be a variety of types: a single child, multiple children, an array, or even null or undefined. 
    // This utility helps standardize these into an array, making it easier to iterate over or manipulate.

// {/* <Suspense> lets you display a fallback until its children have finished loading. */}

// ======================================= Day 2 =======================================
