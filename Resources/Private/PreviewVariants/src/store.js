/**
 * Preview variant choices are UI state, not content. They live in the host
 * window's sessionStorage only: they survive a reload of the guest frame
 * (e.g. after "Apply") but never reach the content repository.
 */
export const AUTO = 'auto';

const PREFIX = 'Kuno.Neos.PreviewVariants:';

const storage = () => {
    try {
        return window.sessionStorage;
    } catch (e) {
        return null;
    }
};

export const getVariant = contextPath => {
    const s = storage();
    return (s && s.getItem(PREFIX + contextPath)) || AUTO;
};

export const setVariant = (contextPath, variant) => {
    const s = storage();
    if (!s) {
        return;
    }
    if (!variant || variant === AUTO) {
        s.removeItem(PREFIX + contextPath);
    } else {
        s.setItem(PREFIX + contextPath, variant);
    }
};

export const getAllVariants = () => {
    const s = storage();
    const result = {};
    if (!s) {
        return result;
    }
    for (let i = 0; i < s.length; i++) {
        const key = s.key(i);
        if (key && key.indexOf(PREFIX) === 0) {
            result[key.substring(PREFIX.length)] = s.getItem(key);
        }
    }
    return result;
};
