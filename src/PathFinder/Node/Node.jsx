import React, { Component } from 'react';
import './Node.css';

export default class Node extends Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    render() {
        const {isFinish, isStart, row, col, isWall, onMouseDown, onMouseEnter, onMouseUp,} = this.props;
        const addClassName = isFinish ? 'node-finish' : isStart ? 'node-start' : isWall ? 'node-wall' : 'node-clear';
        return <div id={`node-${row}-${col}`} className={`node ${addClassName}`} onMouseDown={() => onMouseDown(row, col)} onMouseEnter={() => onMouseEnter(row, col)} onMouseUp={() => onMouseUp()}></div>;
    }
}

// export const DEFAULT_NODE = {
//     row: 0,
//     col: 0,
// };
