import {takeLatest, delay} from 'redux-saga/effects';
import {actionTypes} from '@neos-project/neos-ui-redux-store';

import {getAllVariants} from './store';
import {applyVariant} from './guestFrame';

/**
 * The guest frame is re-rendered on every reload (e.g. after "Apply"). The
 * choices live in the host, so they are re-applied once the new document is in.
 */
export function* reapplyOnFrameLoad() {
    yield takeLatest(actionTypes.UI.ContentCanvas.STOP_LOADING, function* () {
        // The core guest frame initialisation runs on the same action; give it a tick.
        yield delay(50);
        const variants = getAllVariants();
        Object.keys(variants).forEach(contextPath => applyVariant(contextPath, variants[contextPath]));
    });
}
