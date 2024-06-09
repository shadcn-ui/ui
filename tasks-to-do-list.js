// ======================================= Day 1 =======================================
// How to set up the project environment
// What Dependencies used
// Read the folder tree
// Read the project structure
// How to implement Theme
// How to implement Reusable components
// Advanced code

const { expect } = require("vitest");

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
// How to do SEO? How is it done in the project?
// Optimize performance a bit
// Implement useCallback

// How to do SEO? How is it done in the project?
    // Structured data, Google has its own schema, and we need to match the data to it. This makes it easier for Google to crawl the data. For specific requirements, Google has development documentation.
    // Title, meta, and a tags need to follow standards
    // Content must be relevant
// Implement useCallback
    // 调用第三方接口，很多都是异步的，需要调用callback。一是节省资源，二是有可能调用不成功，或者缓慢。
    // 也是副作用的原理。如果用其他方式还真不行。
// useRef
    // 比较灵活, 可以ref instance
    // 可以获取DOM，最直接 
    // 只在生命周期内部
    // 甚至可以父组件调用子组件
    // 不会重复渲染页面
    // 内存泄漏
// Optimize performance a bit
    // 如何评估表现，First Contentful Paint， Largest Contentful Paint
    // 主要使用哪些手段优化
    // 常见面试问题
    // 如何减少React应用的初始加载时间？
    // 如何优化React应用中的图片加载？
    // 如何优化React应用中的图片加载？
    // 如何优化React应用中的列表渲染？


// ======================================= Day 3 =======================================
// accessibility 操作
// How does system design relate to this project?
// Deploy this project
// Design complex test cases with Jest
// Webpack


// ======================================= Day 4 =======================================
// useContext
// CV 中操作一下
// 断掉调试，渲染了几次？
// 为什么不行？
// 高级工程师包，录入到主图中，


// test("render learn react link", ()=>{
//     render <app/>
//     const link element = screen.getByText(/Lean react/i);
//     expect(linek element).toBeIntheDocument
// })


// test("call the mock function on button click", ()=>{
    // render(<Mycomponent onClick={MockFunction}></>)
    // FileWatcherEventKind.click(srceen.getByRole("button")
//     expect(mockFunction).toHaveBeenCalledTimes(1);
// )
    // 
// })