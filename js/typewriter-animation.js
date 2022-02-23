TypewriterAnimation = (options) => {
    const DEFAULT_OPTIONS = {
        mount: null,
        texts: [],
        color: null,
        timeoutBetweenChars: 80,
        timeoutAfterWrite: 1500,
        timeoutAfterDelete: 500,
        output: {
            appendSpace: true,
        }
    };

    options = {...DEFAULT_OPTIONS, ...options};

    if(options.color === null || options.color === undefined) {
        if(window.getComputedStyle !== undefined) {
            options.color = window.getComputedStyle(options.mount).color;
        } else {
            options.color = "#000";
        }
    }

    const addCss = () => {
        const style = document.createElement("style");

        style.innerHTML =  `@keyframes blink {`;
        style.innerHTML += `from, to { border-color: transparent; }`;
        style.innerHTML += `50% { border-color: ${options.color}; }`;
        style.innerHTML += `}`;

        document.head.appendChild(style)
    };

    const addText = (node) => {
        const textNode = document.createElement("span");
        node.appendChild(textNode);
        return textNode;
    };

    const addCaret = (node) => {
        const caretNode = document.createElement("span");

        caretNode.innerHTML = "&nbsp;";
        caretNode.style["animation"] = `blink 1s step-end infinite`;
        caretNode.style["border-left"] = `2px solid ${options.color}`;

        node.appendChild(caretNode);
        return caretNode;
    };

    const writeText = (textNode, texts) => {
        let text = texts.next().value;
        let i = 0;

        if(options.output.appendSpace === true) {
            text += " ";
        }

        const printNextChar = () => {
            textNode.innerHTML += text[i];
            i += 1;

            if(text.length <= i) {
                setTimeout(() => deleteText(textNode, texts), options.timeoutAfterWrite);
                return;
            }

            setTimeout(printNextChar, options.timeoutBetweenChars);
        };

        setTimeout(printNextChar, options.timeoutBetweenChars);
    };

    const deleteText = (textNode, texts) => {
        let i = textNode.innerHTML.length;

        const deleteNextChar = () => {
            const text = textNode.innerHTML;
            textNode.innerHTML = text.substring(0, text.length - 1);
            i -= 1;

            if(i <= 0) {
                setTimeout(() => writeText(textNode, texts), options.timeoutAfterDelete);
                return;
            }

            setTimeout(deleteNextChar, options.timeoutBetweenChars)
        };

        setTimeout(deleteNextChar, options.timeoutBetweenChars)
    };

    function* createCycle(texts) {
        while(true) {
            for(const text of texts) {
                yield text;
            }
        }
    };

    addCss();
    const textNode = addText(options.mount);
    addCaret(options.mount);

    const textCycle = createCycle(options.texts);
    writeText(textNode, textCycle);
};
