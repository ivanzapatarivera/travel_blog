const PARAGRAPH_TYPES = {
    HEADING_1: {
        "type": "h1",
        "className": "content-item-heading"
    },
    HEADING_2: {
        "type": "h2",
        "className": "content-item-heading"
    },
    HEADING_3: {
        "type": "h3",
        "className": "content-item-heading"
    },
    NORMAL_TEXT: {
        "type": "p",
        "className": "content-item-p"
    },
    TITLE: {
        "type": "h1",
        "className": "content-item-heading"
    }
}

function getParagraphStyle(paragraph) {
    return paragraph?.paragraphStyle?.namedStyleType;
}

function getTextContent(paragraph) {
    const text = paragraph?.elements?.map(el => el?.textRun?.content)
        .filter(content => content && content.trim() !== "")
        .join("")
    const paragraphConfig = PARAGRAPH_TYPES[getParagraphStyle(paragraph)];
    return {
        type: paragraphConfig?.type || "p",
        text: text,
        className: paragraphConfig?.className || "content-item-p"
    }
}

function getContent(paragraph, data) {
    for (const el of paragraph?.elements || []) {
        if (el?.inlineObjectElement?.inlineObjectId) {
            const objectId = el?.inlineObjectElement?.inlineObjectId;
            const description = data?.inlineObjects?.[objectId]?.inlineObjectProperties?.embeddedObject?.description;
            const [alt, url] = description?.split("\n") || ["", ""];
            return {
                type: "image",
                inlineObjectId: objectId,
                alt: alt,
                caption: alt,
                url: url
            }
        }
    }
    return getTextContent(paragraph);
}

function renderImage(content) {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const caption = document.createElement('figcaption');
    img.src = content?.url;
    img.alt = content?.alt;
    img.className = `content-item-${content?.type}`;
    caption.textContent = content?.caption;
    figure.appendChild(img);
    figure.appendChild(caption)
    return figure;
}

function renderText(content) {
    const text = document.createElement(content.type);
    text.textContent = content.text;
    text.className = content.className;
    return text;
}

function loadContent(data) {
    try {
        if (!data) return;
        const contentElement = document.getElementById('content');
        const contentFragment = document.createDocumentFragment();
        for (const item of data?.body?.content || []) {
            const paragraph = item?.paragraph;
            if (!paragraph) continue;
            const content = getContent(paragraph, data) || {};

            if (!content?.type) continue;
            const element = content.type === "image" ? renderImage(content) : renderText(content);
            contentFragment.appendChild(element);
        }
        contentElement.appendChild(contentFragment);
    }
    catch (error) {
        console.error(`Error loading data: ${error.message}`);
    }
}

async function loadData(URI) {
    try {
        const response = await fetch(URI);
        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error(`Error loading data: ${error.message}`);
    }
}

async function init() {
    const URI = '/api/get-doc-url'
    const CONTENT = await loadData(URI);
    loadContent(CONTENT);
}

document.addEventListener('DOMContentLoaded', init);