import {findAllOccurrencesOfNodeInGuestFrame} from '@neos-project/neos-ui-guest-frame';

import {AUTO} from './store';

/**
 * Markup contract: inside the node's element, every variant container carries
 * `data-preview-variant="<key>"`. The server renders the real state (hidden or
 * not) and this module only overrides the `hidden` attribute of those containers.
 * The original state is remembered on first touch so "auto" can restore it.
 */
const ORIGINAL = 'previewVariantOriginalHidden';
const ACTIVE = 'data-preview-variant-active';

const variantContainers = nodeElement =>
    Array.prototype.slice.call(nodeElement.querySelectorAll('[data-preview-variant]'));

const rememberOriginal = container => {
    if (container.dataset[ORIGINAL] === undefined) {
        container.dataset[ORIGINAL] = container.hidden ? '1' : '0';
    }
};

const applyToElement = (nodeElement, variant) => {
    const containers = variantContainers(nodeElement);
    if (variant === AUTO) {
        containers.forEach(container => {
            if (container.dataset[ORIGINAL] !== undefined) {
                container.hidden = container.dataset[ORIGINAL] === '1';
                delete container.dataset[ORIGINAL];
            }
        });
        nodeElement.removeAttribute(ACTIVE);
        return;
    }
    containers.forEach(container => {
        rememberOriginal(container);
        container.hidden = container.dataset.previewVariant !== variant;
    });
    nodeElement.setAttribute(ACTIVE, variant);
};

/**
 * The variant the server rendered as visible, i.e. what the website shows right now.
 * Uses the remembered original state when the node has already been switched.
 */
export const getLiveVariant = contextPath => {
    let elements = [];
    try {
        elements = findAllOccurrencesOfNodeInGuestFrame(contextPath) || [];
    } catch (e) {
        return null;
    }
    for (let i = 0; i < elements.length; i++) {
        const live = variantContainers(elements[i]).find(container =>
            container.dataset[ORIGINAL] !== undefined ? container.dataset[ORIGINAL] === '0' : !container.hidden
        );
        if (live) {
            return live.dataset.previewVariant;
        }
    }
    return null;
};

export const applyVariant = (contextPath, variant) => {
    let elements = [];
    try {
        elements = findAllOccurrencesOfNodeInGuestFrame(contextPath) || [];
    } catch (e) {
        return 0;
    }
    elements.forEach(element => applyToElement(element, variant));
    return elements.length;
};
