import React, { Component } from 'react';
import Text from '@splunk/react-ui/Text';
import styled from 'styled-components';

const TextWrapper = styled(Text)`
    width: 320px !important;
`;

interface TextComponentProps {
    // Number is expected if provided number in globalConfig.json instead of a string.
    value: string | number;
    handleChange: (field: string, value: string | number) => void;
    field: string;
    error?: boolean;
    encrypted?: boolean;
    disabled?: boolean;
    id?: string;
}

class TextComponent extends Component<TextComponentProps> {
    handleChange = (e: unknown, { value }: { value: string | number }) => {
        this.props.handleChange(this.props.field, value);
    };

    render() {
        return (
            <TextWrapper
                inputId={this.props.id}
                inline
                error={this.props.error}
                className={this.props.field}
                disabled={this.props.disabled && 'dimmed'}
                value={
                    this.props.value === null || typeof this.props.value === 'undefined'
                        ? ''
                        : this.props.value.toString()
                }
                onChange={this.handleChange}
                type={this.props.encrypted ? 'password' : 'text'}
            />
        );
    }
}

export default TextComponent;
