import manifest from '@neos-project/neos-ui-extensibility';

import PreviewVariantsView from './PreviewVariantsView';
import {reapplyOnFrameLoad} from './saga';

manifest('Kuno.Neos.PreviewVariants', {}, globalRegistry => {
    const viewsRegistry = globalRegistry.get('inspector').get('views');
    viewsRegistry.set('Kuno.Neos/Inspector/Views/PreviewVariants', {
        component: PreviewVariantsView
    });

    const sagasRegistry = globalRegistry.get('sagas');
    sagasRegistry.set('Kuno.Neos.PreviewVariants/reapplyOnFrameLoad', {
        saga: reapplyOnFrameLoad
    });
});
