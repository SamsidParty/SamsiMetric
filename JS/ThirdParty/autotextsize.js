
/**
 * Ensures that `func` is not called more than once per animation frame.
 *
 * Using requestAnimationFrame in this way ensures that we render as often as
 * possible without excessively blocking the UI.
 */
function throttleAnimationFrame(func) {
    let wait = false;
    return () => {
        if (!wait) {
            wait = true;
            requestAnimationFrame(() => {
                func();
                wait = false;
            });
        }
    };
}
/**
 * Ensure no overflow. Underflow is preferred since it doesn't look visually
 * broken like overflow does.
 *
 * Some browsers (eg. Safari) are not good with sub-pixel font sizing, making it so
 * that visual overflow can occur unless we adjust for it.
 */
const antiOverflowAlgo = ({ fontSizePx, minFontSizePx, fontSizePrecisionPx, updateFontSizePx, breakPredicate: breakPred, }) => {
    const maxIterCount = Math.ceil(1 / fontSizePrecisionPx); // 1 px should always be enough.
    let iterCount = 0;
    while (fontSizePx > minFontSizePx && iterCount < maxIterCount) {
        if (breakPred())
            break;
        fontSizePx = updateFontSizePx(fontSizePx - fontSizePrecisionPx);
        iterCount++;
    }
};
const getContentWidth = (element) => {
    const computedStyle = getComputedStyle(element);
    return (element.clientWidth -
        parseFloat(computedStyle.paddingLeft) -
        parseFloat(computedStyle.paddingRight));
};
const getContentHeight = (element) => {
    const computedStyle = getComputedStyle(element);
    return (element.clientHeight -
        parseFloat(computedStyle.paddingTop) -
        parseFloat(computedStyle.paddingBottom));
};
const multilineAlgo = (opts) => {
    opts.innerEl.style.whiteSpace = "nowrap";
    onelineAlgo(opts);
    if (opts.innerEl.scrollWidth > getContentWidth(opts.containerEl)) {
        opts.innerEl.style.whiteSpace = "normal";
    }
};
const onelineAlgo = ({ innerEl, containerEl, fontSizePx, minFontSizePx, maxFontSizePx, fontSizePrecisionPx, updateFontSizePx, }) => {
    const maxIterCount = 10; // Safety fallback to avoid infinite loop
    let iterCount = 0;
    let prevOverflowFactor = 1;
    while (iterCount < maxIterCount) {
        const w0 = innerEl.scrollWidth;
        const w1 = getContentWidth(containerEl);
        const canGrow = fontSizePx < maxFontSizePx && w0 < w1;
        const canShrink = fontSizePx > minFontSizePx && w0 > w1;
        const overflowFactor = w0 / w1;
        // The browser cannot render a difference based on the previous font size update
        if (prevOverflowFactor === overflowFactor) {
            break;
        }
        if (!(canGrow || canShrink)) {
            break;
        }
        const updatePx = fontSizePx / overflowFactor - fontSizePx;
        const prevFontSizePx = fontSizePx;
        fontSizePx = updateFontSizePx(fontSizePx + updatePx);
        // Stop iterating when converging
        if (Math.abs(fontSizePx - prevFontSizePx) <= fontSizePrecisionPx) {
            break;
        }
        prevOverflowFactor = overflowFactor;
        iterCount++;
    }
    antiOverflowAlgo({
        fontSizePx,
        minFontSizePx,
        updateFontSizePx,
        fontSizePrecisionPx,
        breakPredicate: () => innerEl.scrollWidth <= getContentWidth(containerEl),
    });
};
/**
 * Binary search for the best font size in the range [minFontSizePx, maxFontSizePx].
 */
const boxAlgo = ({ innerEl, containerEl, fontSizePx, minFontSizePx, maxFontSizePx, fontSizePrecisionPx, updateFontSizePx, }) => {
    const maxIterCount = 100; // Safety fallback to avoid infinite loop
    // Start the binary search in the middle.
    fontSizePx = updateFontSizePx((maxFontSizePx - minFontSizePx) * 0.5);
    // Each subsequent update will halve the search space.
    let updatePx = (maxFontSizePx - minFontSizePx) * 0.25;
    let iterCount = 0;
    while (updatePx > fontSizePrecisionPx && iterCount < maxIterCount) {
        const w0 = innerEl.scrollWidth;
        const w1 = getContentWidth(containerEl);
        const h0 = innerEl.scrollHeight;
        const h1 = getContentHeight(containerEl);
        if (w0 === w1 && h0 === h1)
            break;
        /**
         * Use `<=` rather than `<` since equality is possible even though there is
         * room for resizing in the other dimension.
         */
        if (fontSizePx < maxFontSizePx && w0 <= w1 && h0 <= h1) {
            fontSizePx = updateFontSizePx(fontSizePx + updatePx);
        }
        else if (fontSizePx > minFontSizePx && (w0 > w1 || h0 > h1)) {
            fontSizePx = updateFontSizePx(fontSizePx - updatePx);
        }
        updatePx *= 0.5; // Binary search. Don't change this number.
        iterCount++;
    }
    antiOverflowAlgo({
        fontSizePx,
        minFontSizePx,
        updateFontSizePx,
        fontSizePrecisionPx,
        breakPredicate: () => innerEl.scrollWidth <= getContentWidth(containerEl) &&
            innerEl.scrollHeight <= getContentHeight(containerEl),
    });
};
/**
 * Make text fit container, prevent overflow and underflow.
 *
 * Adjusts the font size of `innerEl` so that it precisely fills `containerEl`.
 */
function updateTextSize({ innerEl, containerEl, mode = "multiline", minFontSizePx = 8, maxFontSizePx = 160, fontSizePrecisionPx = 0.1, }) {
    const t0 = performance.now();
    if (!isFinite(minFontSizePx)) {
        throw new Error(`Invalid minFontSizePx (${minFontSizePx})`);
    }
    if (!isFinite(minFontSizePx)) {
        throw new Error(`Invalid maxFontSizePx (${maxFontSizePx})`);
    }
    if (!isFinite(fontSizePrecisionPx) || fontSizePrecisionPx === 0) {
        throw new Error(`Invalid fontSizePrecisionPx (${fontSizePrecisionPx})`);
    }
    if (containerEl.children.length > 1) {
        console.warn(`AutoTextSize has ${containerEl.children.length - 1} siblings. This may interfere with the algorithm.`);
    }
    const containerStyles = {
        // Necessary to correctly compute the dimensions `innerEl`.
        display: "flex",
        alignItems: "start",
    };
    const innerStyles = {
        display: "block", // Necessary to compute dimensions.
    };
    if (mode === "oneline") {
        innerStyles.whiteSpace = "nowrap";
    }
    else if (mode === "multiline") {
        innerStyles.wordBreak = "break-word";
        // white-space is controlled dynamically in multiline mode
    }
    else if (mode === "box") {
        innerStyles.whiteSpace = "pre-wrap";
        innerStyles.wordBreak = "break-word";
    }
    Object.assign(containerEl.style, containerStyles);
    Object.assign(innerEl.style, innerStyles);
    const fontSizeStr = window
        .getComputedStyle(innerEl, null)
        .getPropertyValue("font-size");
    let fontSizePx = parseFloat(fontSizeStr);
    let iterations = 0;
    const updateFontSizePx = (px) => {
        px = Math.min(Math.max(px, minFontSizePx), maxFontSizePx);
        // console.debug(
        //   `setFontSizePx ${px > fontSizePx ? "up" : "down"} (abs: ${
        //     px / fontSizePx
        //   }, rel: ${(px - fontSizePx) / fontSizePx}) ${px}`
        // );
        fontSizePx = px;
        innerEl.style.fontSize = `${fontSizePx}px`;
        iterations++;
        return fontSizePx;
    };
    if (fontSizePx > maxFontSizePx || fontSizePx < minFontSizePx) {
        updateFontSizePx(fontSizePx);
    }
    const algoOpts = {
        innerEl,
        containerEl,
        fontSizePx,
        minFontSizePx,
        maxFontSizePx,
        fontSizePrecisionPx,
        updateFontSizePx,
    };
    if (mode === "oneline") {
        onelineAlgo(algoOpts);
    }
    else if (mode === "multiline") {
        multilineAlgo(algoOpts);
    }
    else if (mode === "box") {
        boxAlgo(algoOpts);
    }
}

/**
 * Make text fit container, prevent overflow and underflow.
 *
 * Adjusts the font size of `innerEl` so that it precisely fills `containerEl`.
 *
 * Throttles all invocations to next animation frame (through
 * `requestAnimationFrame`).
 *
 * Sets up a `ResizeObserver` to automatically run `autoTextSize` when
 * `containerEl` resizes. Call `disconnect()` when done to disconnect the resize
 * observer to prevent memory leaks.
 */
function autoTextSize({ innerEl, containerEl, mode, minFontSizePx, maxFontSizePx, fontSizePrecisionPx, }) {
    // Initialize as `undefined` to always run directly when instantiating.
    let containerDimensions = undefined;
    // Use type `any` so that we can add the `.disconnect` property later on.
    const throttledUpdateTextSize = throttleAnimationFrame(() => {
        updateTextSize({
            innerEl,
            containerEl,
            mode,
            maxFontSizePx,
            minFontSizePx,
            fontSizePrecisionPx,
        });
        containerDimensions = [
            getContentWidth(containerEl),
            getContentHeight(containerEl),
        ];
    });
    const resizeObserver = new ResizeObserver(() => {
        const prevContainerDimensions = containerDimensions;
        containerDimensions = [
            getContentWidth(containerEl),
            getContentHeight(containerEl),
        ];
        if (prevContainerDimensions?.[0] !== containerDimensions[0] ||
            prevContainerDimensions?.[1] !== containerDimensions[1]) {
            throttledUpdateTextSize();
        }
    });
    // It calls the callback directly.
    resizeObserver.observe(containerEl);
    // The native code `resizeObserver.disconnect` needs the correct context.
    // Retain the context by wrapping in arrow function. Read more about this:
    // https://stackoverflow.com/a/9678166/19306180
    throttledUpdateTextSize.disconnect = () => resizeObserver.disconnect();
    return throttledUpdateTextSize;
}



var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};


const react_1 = React;

/**
 * Make text fit container, prevent overflow and underflow.
 */
function AutoTextSize({ mode, minFontSizePx, maxFontSizePx, fontSizePrecisionPx, as: Comp = "div", // TODO: The `...rest` props are not typed to reflect another `as`.
children, ...rest }) {
    const updateTextSizeRef = (0, react_1.useRef)();
    (0, react_1.useEffect)(() => updateTextSizeRef.current?.(), [children]);
    const refCallback = (0, react_1.useCallback)((innerEl) => {
        updateTextSizeRef.current?.disconnect();
        const containerEl = innerEl?.parentElement;
        if (!innerEl || !containerEl)
            return;
        updateTextSizeRef.current = (0, autoTextSize)({
            innerEl,
            containerEl,
            mode,
            minFontSizePx,
            maxFontSizePx,
            fontSizePrecisionPx,
        });
    }, [mode, minFontSizePx, maxFontSizePx, fontSizePrecisionPx]);
    return (react_1.createElement(Comp, { ref: refCallback, ...rest }, children));
}

//# sourceMappingURL=auto-text-size-react.js.map