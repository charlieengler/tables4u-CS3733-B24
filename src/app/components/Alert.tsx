"use client";

import './styles/Alert.css';

export default function Alert(props: any) {
    return (
        <div className='alert-background' onClick={props.callback}>
            <div className='alert-container'>
                <div className='alert-header'>{props.children}</div>
                <div className='alert-body'>{props.message}</div>
                <div className='alert-hint'>(Click anywhere to close)</div>
            </div>
        </div>
    );
}