import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';
import {ButtonGroup, Button} from '@neos-project/react-ui-components';

import {AUTO, getVariant, setVariant} from './store';
import {applyVariant} from './guestFrame';

/**
 * Inspector view (not an editor): a button group that switches which display
 * variant of the focused node is shown in the guest frame. Nothing is committed
 * to the node, the choice is browser session state only.
 *
 * NodeType configuration:
 *
 *   ui:
 *     inspector:
 *       views:
 *         previewVariants:
 *           group: someGroup
 *           label: 'Vorschau'
 *           view: 'Kuno.Neos/Inspector/Views/PreviewVariants'
 *           viewOptions:
 *             autoLabel: 'Wie auf der Website'   # optional
 *             variants:
 *               before: 'Countdown'
 *               after: 'Nach Ablauf'
 */
class PreviewVariantsView extends PureComponent {
    static propTypes = {
        options: PropTypes.shape({
            variants: PropTypes.object,
            autoLabel: PropTypes.string
        }),
        focusedNodeContextPath: PropTypes.string,
        i18nRegistry: PropTypes.object.isRequired
    };

    state = {
        variant: AUTO
    };

    componentDidMount() {
        this.syncFromStore();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.focusedNodeContextPath !== this.props.focusedNodeContextPath) {
            this.syncFromStore();
        }
    }

    syncFromStore() {
        const {focusedNodeContextPath} = this.props;
        this.setState({variant: focusedNodeContextPath ? getVariant(focusedNodeContextPath) : AUTO});
    }

    handleSelect = variant => {
        const {focusedNodeContextPath} = this.props;
        if (!focusedNodeContextPath) {
            return;
        }
        setVariant(focusedNodeContextPath, variant);
        applyVariant(focusedNodeContextPath, variant);
        this.setState({variant});
    };

    translate(label) {
        return this.props.i18nRegistry.translate(label, label);
    }

    render() {
        const {options} = this.props;
        const variants = (options && options.variants) || {};
        const autoLabel = (options && options.autoLabel) || 'Kuno.Neos.PreviewVariants:Main:auto';

        return (
            <ButtonGroup value={this.state.variant} onSelect={this.handleSelect}>
                <Button id={AUTO} style="lighter" size="small">{this.translate(autoLabel)}</Button>
                {Object.keys(variants).map(key => (
                    <Button key={key} id={key} style="lighter" size="small">{this.translate(variants[key])}</Button>
                ))}
            </ButtonGroup>
        );
    }
}

export default neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))(connect(state => ({
    focusedNodeContextPath: selectors.CR.Nodes.focusedNodePathSelector(state)
}))(PreviewVariantsView));
