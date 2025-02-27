import React, { Component } from 'react';
import Modal from '@splunk/react-ui/Modal';
import Message from '@splunk/react-ui/Message';
import styled from 'styled-components';
import update from 'immutability-helper';
import { _ } from '@splunk/ui-utils/i18n';

import { generateToast } from '../../util/util';
import { deleteRequest, generateEndPointUrl } from '../../util/api';
import TableContext from '../../context/TableContext';
import { parseErrorMsg, getFormattedMessage } from '../../util/messageUtil';
import { PAGE_INPUT } from '../../constants/pages';
import { StandardPages } from '../../types/components/shareableTypes';
import { UCCButton } from '../UCCButton/UCCButton';

const ModalWrapper = styled(Modal)`
    width: 800px;
`;

interface DeleteModalProps {
    page: StandardPages;
    handleRequestClose: () => void;
    serviceName: string;
    stanzaName: string;
    open?: boolean;
}

interface DeleteModalState {
    isDeleting: boolean;
    ErrorMsg: string;
}

class DeleteModal extends Component<DeleteModalProps, DeleteModalState> {
    static contextType = TableContext;

    constructor(props: DeleteModalProps) {
        super(props);
        this.state = { isDeleting: false, ErrorMsg: '' };
    }

    handleRequestClose = () => {
        // set ErrorMsg to empty string on close or cancel
        // so that on again open of modal it does not show the same ErrorMsg
        this.setState((prevState) => ({ ...prevState, ErrorMsg: '' }));

        this.props.handleRequestClose();
    };

    handleDelete = () => {
        this.setState(
            (prevState) => ({ ...prevState, isDeleting: true, ErrorMsg: '' }),
            () => {
                deleteRequest({
                    endpointUrl: generateEndPointUrl(
                        `${encodeURIComponent(this.props.serviceName)}/${encodeURIComponent(
                            this.props.stanzaName
                        )}`
                    ),
                    handleError: false,
                })
                    .then(() => {
                        this.context?.setRowData(
                            update(this.context.rowData, {
                                [this.props.serviceName]: { $unset: [this.props.stanzaName] },
                            })
                        );
                        this.setState({ isDeleting: false });
                        this.handleRequestClose();
                        generateToast(`Deleted "${this.props.stanzaName}"`, 'success');
                    })
                    .catch((err) => {
                        const errorSubmitMsg = parseErrorMsg(err);
                        this.setState({ ErrorMsg: errorSubmitMsg, isDeleting: false });
                    });
            }
        );
    };

    // Display error message
    generateErrorMessage = () => {
        if (this.state.ErrorMsg) {
            return (
                <div>
                    <Message appearance="fill" type="error">
                        {this.state.ErrorMsg}
                    </Message>
                </div>
            );
        }
        return null;
    };

    render() {
        let deleteMsg;
        if (this.props.page === PAGE_INPUT) {
            deleteMsg = getFormattedMessage(103, [this.props.stanzaName]);
        } else {
            deleteMsg = getFormattedMessage(102, [this.props.stanzaName]);
        }
        return (
            <ModalWrapper open={this.props.open}>
                <Modal.Header
                    title={getFormattedMessage(101)}
                    onRequestClose={this.handleRequestClose}
                />
                <Modal.Body className="deletePrompt">
                    {this.generateErrorMessage()}
                    <p>{deleteMsg}</p>
                </Modal.Body>
                <Modal.Footer>
                    <UCCButton
                        appearance="secondary"
                        onClick={this.handleRequestClose}
                        label={_('Cancel')}
                        disabled={this.state.isDeleting}
                    />
                    <UCCButton
                        label={_('Delete')}
                        onClick={this.handleDelete}
                        loading={this.state.isDeleting}
                    />
                </Modal.Footer>
            </ModalWrapper>
        );
    }
}

export default DeleteModal;
