import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';
import {ButtonGroup, Button} from '@neos-project/react-ui-components';

import {AUTO, getVariant, setVariant} from './store';
import {applyVariant, getLiveVariant} from './guestFrame';

/**
 * Inspector view (not an editor): a button group that switches which display
 * variant of the focused node is shown in the guest frame. The variant the
 * server rendered as visible (what the website shows right now) is preselected;
 * selecting it again restores the server-rendered state. Nothing is committed
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
 *             variants:
 *               before: 'Countdown'
 *               after: 'Nach Ablauf'
 */
class PreviewVariantsView extends PureComponent {
    static propTypes = {
        options: PropTypes.shape({
            variants: PropTypes.object
        }),
        focusedNodeContextPath: PropTypes.string,
        i18nRegistry: PropTypes.object.isRequired
    };

    state = {
        variant: null,
        liveVariant: null
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
        if (!focusedNodeContextPath) {
            this.setState({variant: null, liveVariant: null});
            return;
        }
        const liveVariant = getLiveVariant(focusedNodeContextPath);
        const stored = getVariant(focusedNodeContextPath);
        this.setState({liveVariant, variant: stored === AUTO ? liveVariant : stored});
    }

    handleSelect = variant => {
        const {focusedNodeContextPath} = this.props;
        const {liveVariant} = this.state;
        if (!focusedNodeContextPath) {
            return;
        }
        // Choosing the live variant means "as on the website": restore and forget.
        const effective = variant === liveVariant ? AUTO : variant;
        setVariant(focusedNodeContextPath, effective);
        applyVariant(focusedNodeContextPath, effective);
        this.setState({variant});
    };

    translate(label) {
        return this.props.i18nRegistry.translate(label, label);
    }

    render() {
        const {options} = this.props;
        const variants = (options && options.variants) || {};

        // ButtonGroup iterates `children` as a flat array and reads `child.props.id`,
        // so the buttons are built as one flat list instead of nested JSX children.
        const buttons = Object.keys(variants).map(key => (
            <Button key={key} id={key} style="lighter" size="small">{this.translate(variants[key])}</Button>
        ));

        return (
            <ButtonGroup value={this.state.variant} onSelect={this.handleSelect}>
                {buttons}
            </ButtonGroup>
        );
    }
}

export default neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))(connect(state => ({
    focusedNodeContextPath: selectors.CR.Nodes.focusedNodePathSelector(state)
}))(PreviewVariantsView));
