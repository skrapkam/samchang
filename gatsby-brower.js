import "@fastly/performance-observer-polyfill/polyfill";

// PerformanceObserver is now available globally!
const observer = new PerformanceObserver(list => {});
observer.observe({ entryTypes: ["resource"] });
