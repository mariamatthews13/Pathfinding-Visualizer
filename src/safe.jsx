import React, { Component } from 'react';
import Node from './Node/Node';
import './PathFinder.css';
import { dijkstraAlgo, shortestPath } from '../dijkstra';

var START_NODE_ROW = 10; //10
var START_NODE_COL = 10; // 10
var END_NODE_ROW = 10; //10
var END_NODE_COL = 50; //55
var START_NODE_CLICKED = false;
var END_NODE_CLICKED = false;

export default class PathFinder extends Component {
    constructor(){ 
        super();
        this.state = {
            nodes: [],
            mouseIsPressed: false,
            start_row: START_NODE_ROW,
            start_col: START_NODE_COL,
            end_row: END_NODE_ROW,
            end_col: END_NODE_COL,
            isAnimating: false,
            isClearing: false,
            
        }; 
    }

    componentDidMount() {
        const nodes = []; //nodes is grid
        for(let row = 0; row < 20; row++) //20 rows
        {
            const currRow = [];
            for(let col = 0; col < 60; col++) //60 columns 
            {   
                const currNode = {
                    row: row, 
                    col: col,
                    isStart: row === START_NODE_ROW && col === START_NODE_COL,
                    isFinish: row === END_NODE_ROW && col === END_NODE_COL,
                    distance: Infinity,
                    isVisited: false, 
                    isWall: false,
                    parent: null,
                };
                currRow.push(currNode);
            }
            nodes.push(currRow);
        }
        this.setState({nodes});
        //this.setState({start: nodes[START_NODE_ROW][START_NODE_COL], end: nodes[END_NODE_ROW][END_NODE_COL]});
    }

    //When mouse is pressed down
    mouseDownHandler(row, col)
    {
        if(!this.state.isAnimating && !this.state.isClearing)
        {
            if(row == this.state.start_row && col == this.state.start_col) //Start node has been clicked
            {
                if(!START_NODE_CLICKED) //Old start node has been clicked 
                {
                    console.log("test")
                    START_NODE_CLICKED = true;
                    //Set isStart property of this node to false
                    this.state.nodes[row][col].isStart = false;
                    //this.setState({start_row: 0, start_col: 0});
                } 
            }
            else if(START_NODE_CLICKED) //New start node has been clicked 
            {
                this.state.nodes[row][col].isStart = true;
                //START_NODE_ROW = row;
                //START_NODE_COL = col;
                //this.setState({start_row: START_NODE_ROW, start_col: START_NODE_COL, end_row: END_NODE_ROW, end_col: END_NODE_COL});
                //Set flag to false
                START_NODE_CLICKED = false;
                this.setState({start_row: row, start_col: col});
            }
            else if(row == this.state.end_row && col == this.state.end_col)
            {
                if(!END_NODE_CLICKED) //Old end node has been clicked 
                {
                    END_NODE_CLICKED = true;
                    //Set isFinish property of this node to false
                    this.state.nodes[row][col].isFinish = false;
                }

            }
            else if(END_NODE_CLICKED) //New end node has been clicked 
            {
                this.state.nodes[row][col].isFinish = true;
                //END_NODE_ROW = row;
                //END_NODE_COL = col;
                //Set flag to false
                END_NODE_CLICKED = false;
                this.setState({end_row: row, end_col: col});
                //this.setState({start_row: START_NODE_ROW, start_col: START_NODE_COL, end_row: END_NODE_ROW, end_col: END_NODE_COL});
            }
            else
            {
                const newNodes = newGridWithWall(this.state.nodes, row, col);
                //this.setState({nodes: newNodes, mouseIsPressed: true});
                this.setState({nodes: newNodes, mouseIsPressed: true});
            }
        }
        else{
            return;
        }
        //this.setState({mouseIsPressed: true});
        
    }

    //When mouse is within the grid and mouse is pressed
    mouseEnterHandler(row, col)
    {
        if(!this.state.isAnimating && !this.state.isClearing)
        {
            if(this.state.mouseIsPressed)
            {
                const newNodes = newGridWithWall(this.state.nodes, row, col);
                this.setState({nodes: newNodes}); //also add mouseIsPressed??
            }
            else
            {
                return;
            }
        }
        else
        {
            return;
        }
    }

    mouseUpHandler(row, col)
    {
        this.setState({mouseIsPressed: false}); //Update state
    }


    visualizeDijkstra()
    {
        this.setState({isAnimating: true})
        const {nodes} = this.state;  
        // const start = nodes[START_NODE_ROW][START_NODE_COL];
        // const end = nodes[END_NODE_ROW][END_NODE_COL];
        const start = nodes[this.state.start_row][this.state.start_col];
        const end = nodes[this.state.end_row][this.state.end_col];
        const visitedNodes = dijkstraAlgo(nodes, start, end);
        const shortestPathNodes = shortestPath(start, end);
        
        //Animate
        for(let i = 0; i <= visitedNodes.length; i++)
        {
            if(i != visitedNodes.length)
            {
                setTimeout(() => {  
                    const node = visitedNodes[i];
                    document.getElementById(`node-${node.row}-${node.col}`).className='node node-visited';}, 10 * i); 
            } 
            else
            { 
                setTimeout(() => { 
                    this.visualizeShortestPath(shortestPathNodes);
                }, 12*i);
            }
            
        }
        
        
    }

    visualizeShortestPath(nodes)
    {
        //console.log(nodes.length);
        for(let i = 0; i < nodes.length; i++) 
        {
            setTimeout(() => {
                const node = nodes[i];
                document.getElementById(`node-${node.row}-${node.col}`).className='node node-shortest-path';}, 15 * i); 
        }
        this.setState({isAnimating: false})
    }

    clearGrid() //something buggy with this function :(
    {
        //this.setState({isClearing: true})
        
        if(!this.state.isAnimating)
        {
            const nodesToClear = [];
            const newNodes = this.state.nodes.slice();
            let i = 0
            for(const row of newNodes) //20 rows
            {
                for(const node of row)//60 columns  
                {   
                    i++;
                    //let nodeClass = document.getElementById(`node-${node.row}-${node.col}`,).className;
                    if(!node.isStart && !node.isFinish && !node.isWall)
                    {
                        //document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-clear';
                        setTimeout(() => {
                            document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-clear';
                        }, 2*i)
                        node.isVisited = false;
                        node.distance = Infinity;
                        node.parent = null;
                    }
                    if(node.isFinish)
                    {
                        node.isVisited = false;
                        node.distance = Infinity;
                        node.parent = null;
                        node.isFinish = true;
                        setTimeout(() => {
                            document.getElementById(`node-${node.row}-${node.col}`).className='node node-finish';}, 2*i);
                    }
                    if(node.isStart)
                    {
                        node.isVisited = false;
                        node.distance = Infinity;
                        node.isStart = true;
                        node.isWall = false;
                        node.parent = null;
                        setTimeout(() => {
                                document.getElementById(`node-${node.row}-${node.col}`).className='node node-start';}, 2*i);
                    }
                    if(node.isWall)
                    {
                        setTimeout(() => {
                            document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-clear';
                        }, 2*i)
                        
                        node.isWall = false;
                    }
                    // if(this.state.nodes[row][col].isVisited)
                    // {
                    //         //nodesToClear.push(this.state.nodes[row][col]);
                    //         //this.state.nodes[row][col].isVisited = false;
                    //         if(this.state.nodes[row][col].isStart)
                    //         {
                    //             //this.state.nodes[row][col].isStart = true;
                    //             setTimeout(() => {
                    //                 document.getElementById(`node-${row}-${col}`).className='node node-start';}, 15);
                    //             // this.setState({start_row: row, start_col: col});
                    //         }
                    //         else if(this.state.nodes[row][col].isFinish)
                    //         {
                    //             //this.state.nodes[row][col].isFinish = true;
                    //             setTimeout(() => {
                    //                 document.getElementById(`node-${row}-${col}`).className='node node-finish';}, 15);
                    //             // this.setState({end_row: row, end_col: col});
                    //         }
                    //         else {
                    //             nodesToClear.push(this.state.nodes[row][col]);
                    //             //this.state.nodes[row][col].isVisited = false;
                    //             // setTimeout(() => {
                    //             //                     const node = this.state.nodes[row][col];
                    //             //                     document.getElementById(`node-${node.row}-${node.col}`).className='node node-clear';}, 2*col);
                    //         }
                    //         this.state.nodes[row][col].isVisited = false;
                    //         this.state.nodes[row][col].distance = Infinity;
                    //         this.state.nodes[row][col].parent = null;
                    
                    // }
                    // if(this.state.nodes[row][col].isWall)
                    // {
                    //     nodesToClear.push(this.state.nodes[row][col]);
                    //     this.state.nodes[row][col].isWall = false;
                    //     this.state.nodes[row][col].isVisited = false;
                    //     this.state.nodes[row][col].distance = Infinity;
                    //     this.state.nodes[row][col].parent = null;

                    //     //this.state.nodes[row][col].isVisited = false;
                    //     // setTimeout(() => {
                    //     //     const node = this.state.nodes[row][col];
                    //     //     document.getElementById(`node-${node.row}-${node.col}`).className='node node-clear';}, 2*col);
                    // }

                    
                }
            
            }

            for(let i = 0; i < nodesToClear.length; i++)
            {
                // if(!nodesToClear[i].isStart)
                // {
                //     if(!nodesToClear[i].isFinish)
                //     {
                        setTimeout(() => {
                            const node = nodesToClear[i];
                            document.getElementById(`node-${node.row}-${node.col}`).className='node node-clear';}, 2*i);
                //     } 
                // }
                //this.setState({nodes: this.state.nodes});
                
            }
        
            // setTimeout(() => {
            //     this.setState({isClearing: false})
            //     }, 1000);  
            // if(this.state.isAnimating)
            // {
            //     console.log("animating true");
            // }
        
        }   
    } 

    render() {
        const {nodes, mouseIsPressed} = this.state;
        //console.log(nodes)
        return (
        <>
            <button onClick={() => this.visualizeDijkstra()}> Visualize Dijkstra </button>
            <button onClick={() => this.clearGrid()}> Clear Grid</button> 
            <div className='nodes'>
                {nodes.map((row, rowIdx) => { //Iterate through every row and column and create a node
                    return ( <div key={rowIdx}>
                        {row.map((node, nodeIdx) => 
                        {
                            const {row, col, isStart, isFinish, isWall} = node;
                            
                            return (
                                <Node
                                    key={nodeIdx} 
                                    row={row}
                                    col={col}
                                    isStart ={isStart}
                                    isFinish={isFinish}
                                    isWall={isWall}
                                    mouseIsPressed={mouseIsPressed}
                                    onMouseDown={(row, col) => this.mouseDownHandler(row, col)}
                                    onMouseEnter={(row, col) => this.mouseEnterHandler(row, col)}
                                    onMouseUp={() => this.mouseUpHandler()}></Node>
                            );
                        })}
                     </div>
                    );
                })}
            </div>
        </>
        );
    }
}

const newGridWithWall = (nodes, row, col) => {
    const node = nodes[row][col];
    node.isWall = !node.isWall; //Toggled value
    return nodes; 
}

/*
// const newGridWithStart = (row, col, oldStart, nodes) => {
//     oldStart.isStart = false;
//     const node =  nodes[row][col];
//     node.isStart = true;
//     return nodes;
// }
*/

/*
    doubleClickHandler(row, col) //Allow user to move start/end node
    {
        if(this.state.nodes[row][col].isStart) //if user clicked on start node, allow it to be moved
        {
            //wait for another double click --> change start node to this row, col
            console.log("bye");
            const {nodes} = this.state;
            const oldStart = nodes[row][col];
            document.addEventListener("dblclick", (row, col) => {this.newGridWithStart(row, col, oldStart);});
            

            
        }
        else if(this.state.nodes[row][col].isFinish) //user clicked on finish node, allow it to be moved
        {
            //wait for another double click --> change finish node to this row, col
            console.log("bye");
        }
        else
        {
            return;
        }
    } 

    newGridWithStart(row, col, oldStart){
        const newGrid = this.state.nodes.slice();
        const node = newGrid[row][col];
        const newNode = {
            ...node,
            isStart: true,
        };
        newGrid[row][col] = newNode;
        this.setState({nodes: newGrid});
        // oldStart.isStart = false;
        // const {nodes} = this.state;
        // const node =  nodes[row][col];
        // node.isStart = true;
        // this.setState({nodes: nodes});
    }*/
    
//------------------------- new with maze generation
import React, { Component } from 'react';
import Node from './Node/Node';
import './PathFinder.css';
import { dijkstraAlgo, shortestPath } from '../dijkstra';

var START_NODE_ROW = 10; //10
var START_NODE_COL = 10; // 10
var END_NODE_ROW = 10; //10
var END_NODE_COL = 50; //55
var START_NODE_CLICKED = false;
var END_NODE_CLICKED = false;

export default class PathFinder extends Component {
    constructor(){ 
        super();
        this.state = {
            nodes: [],
            mouseIsPressed: false,
            start_row: START_NODE_ROW,
            start_col: START_NODE_COL,
            end_row: END_NODE_ROW,
            end_col: END_NODE_COL,
            isAnimating: false,
            isClearing: false,
            
        }; 
    }

    componentDidMount() {
        const nodes = []; //nodes is grid
        for(let row = 0; row < 21; row++) //20 rows
        {
            const currRow = [];
            for(let col = 0; col < 61; col++) //60 columns 
            {   
                const currNode = {
                    row: row, 
                    col: col,
                    isStart: row === START_NODE_ROW && col === START_NODE_COL,
                    isFinish: row === END_NODE_ROW && col === END_NODE_COL,
                    distance: Infinity,
                    isVisited: false, 
                    isVisitedInMaze: false,
                    isWall: false,
                    parent: null,
                };
                currRow.push(currNode);
            }
            nodes.push(currRow);
        }
        this.setState({nodes});
        //this.setState({start: nodes[START_NODE_ROW][START_NODE_COL], end: nodes[END_NODE_ROW][END_NODE_COL]});
    }

    //When mouse is pressed down
    mouseDownHandler(row, col)
    {
        if(!this.state.isAnimating && !this.state.isClearing)
        {
            if(row == this.state.start_row && col == this.state.start_col) //Start node has been clicked
            {
                if(!START_NODE_CLICKED) //Old start node has been clicked 
                {
                    console.log("test")
                    START_NODE_CLICKED = true;
                    //Set isStart property of this node to false
                    this.state.nodes[row][col].isStart = false;
                    //this.setState({start_row: 0, start_col: 0});
                } 
            }
            else if(START_NODE_CLICKED) //New start node has been clicked 
            {
                this.state.nodes[row][col].isStart = true;
                //START_NODE_ROW = row;
                //START_NODE_COL = col;
                //this.setState({start_row: START_NODE_ROW, start_col: START_NODE_COL, end_row: END_NODE_ROW, end_col: END_NODE_COL});
                //Set flag to false
                START_NODE_CLICKED = false;
                this.setState({start_row: row, start_col: col});
            }
            else if(row == this.state.end_row && col == this.state.end_col)
            {
                if(!END_NODE_CLICKED) //Old end node has been clicked 
                {
                    END_NODE_CLICKED = true;
                    //Set isFinish property of this node to false
                    this.state.nodes[row][col].isFinish = false;
                }

            }
            else if(END_NODE_CLICKED) //New end node has been clicked 
            {
                this.state.nodes[row][col].isFinish = true;
                //END_NODE_ROW = row;
                //END_NODE_COL = col;
                //Set flag to false
                END_NODE_CLICKED = false;
                this.setState({end_row: row, end_col: col});
                //this.setState({start_row: START_NODE_ROW, start_col: START_NODE_COL, end_row: END_NODE_ROW, end_col: END_NODE_COL});
            }
            else
            {
                const newNodes = newGridWithWall(this.state.nodes, row, col);
                //this.setState({nodes: newNodes, mouseIsPressed: true});
                this.setState({nodes: newNodes, mouseIsPressed: true});
            }
        }
        else{
            return;
        }
        //this.setState({mouseIsPressed: true});
        
    }

    //When mouse is within the grid and mouse is pressed
    mouseEnterHandler(row, col)
    {
        if(!this.state.isAnimating && !this.state.isClearing)
        {
            if(this.state.mouseIsPressed)
            {
                const newNodes = newGridWithWall(this.state.nodes, row, col);
                this.setState({nodes: newNodes}); //also add mouseIsPressed??
            }
            else
            {
                return;
            }
        }
        else
        {
            return;
        }
    }

    mouseUpHandler(row, col)
    {
        this.setState({mouseIsPressed: false}); //Update state
    }

    genMaze()
    {
        // let width = 61;
        // let height = 21;
        // width -= width % 2; width++;
        // height -= height % 2; height++;
        // console.log("width:", width);
        // console.log("height: ", height);
        
        //Let the whole grid be walls initially
        for(const row of this.state.nodes)
        {
            for(const node of row)
            {
                if(node.isStart || node.isFinish) //If node is either start or finish node, skip this iteration
                {
                    continue;
                }
                else
                {
                    //Set node as wall
                    node.isWall = true;
                    setTimeout(() => {  
                        document.getElementById(`node-${node.row}-${node.col}`).className='node node-wall';});
                }
                
            }
        }
        // this.state.nodes[1][1].isWall = false;
        // setTimeout(() => {  
        //     document.getElementById(`node-${this.state.nodes[1][1].row}-${this.state.nodes[1][1].col}`).className='node node-clear';}, 10);
        // var start =[]
        // do {
        //     start[0] = Math.floor(Math.random() * height);
        // }while(start[0] % 2 == 0);
        // do{
        //     start[1] = Math.floor(Math.random() * width)
        // }while(start[1] % 2 == 0);

        //Let start node for passage be a random cell
        let random_row = getRandInt(0, 9); 
        random_row = random_row * 2 + 1; //Gets odd row number
        let random_col = getRandInt(0, 29);
        random_col = random_col * 2 + 1; //Gets odd column number

        //Set start node as a clear, non-wall node
        const startNode = this.state.nodes[random_row][random_col]; 
        startNode.isWall = false;
        setTimeout(() => {  
            document.getElementById(`node-${startNode.row}-${startNode.col}`).className='node node-clear';}, 10);
        
        var openPath = []; //The nodes that are part of the passage
        openPath.push(startNode);
        
        let i = 0; //For animation timing

        while(openPath.length != 0)
        {
            var index = getRandInt(0, openPath.length-1);
            //var index = Math.floor(Math.random() * openPath.length);
            var node = openPath[index];
            var neighbors = this.getNeighbors(node);
           
            while(neighbors.length == 0)
            {
                openPath.splice(index, 1);
                if(openPath.length == 0) 
                {
                    break;
                }

                //index = Math.floor(Math.random() * openPath.length);
                index = getRandInt(0, openPath.length-1);
                node = openPath[index];
                neighbors = this.getNeighbors(node);
            }
            if(openPath.length == 0)
            {
                break;
            }

            //const randNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
            const randNeighbor = neighbors[getRandInt(0, neighbors.length-1)];
            openPath.push(randNeighbor);

            if(neighbors.length == 1)
            {
                openPath.splice(index, 1);
            }
            randNeighbor.isWall = false;
            setTimeout(() => { 
            document.getElementById(`node-${randNeighbor.row}-${randNeighbor.col}`).className='node node-clear';}, i*10);
            
            const connectingNode = this.state.nodes[Math.floor((randNeighbor.row + node.row)/2)][Math.floor((randNeighbor.col + node.col) /2)];
            //console.log(this.state.nodes[(randNeighbor.row + node.row)/2][(randNeighbor.col + node.col) /2].row);
            // this.state.nodes[(randNeighbor.row + node.row)/2][(randNeighbor.col + node.col) /2].isWall = false;
            connectingNode.isWall = false;
            setTimeout(() => {  
                document.getElementById(`node-${connectingNode.row}-${connectingNode.col}`).className='node node-clear';}, i*10);
 
            i++; 
        }
        // let random_row = getRandInt(1, 18); 
        // let random_col = getRandInt(1, 58);
        // const path = [];
        // const startNode = this.state.nodes[random_row][random_col]; 
        // path.push(startNode);
        // let i =0;
        // while(path.length != 0)
        // {
        //     let rand = Math.random();
        //     let index = Math.floor(rand * path.length);
        //     var node = path[index];
        //     // var neighbors = this.getNeighbors(node);

        //     // while(neighbors.length == 0)
        //     // {
        //     //     path.splice(index, 1);
        //     //     if(path.length == 0) { break; }
                
        //     //     index = Math.floor(Math.random() * path.length);
        //     //     node = path[index];
        //     //     neighbors = this.getNeighbors(node);
        //     // }
        //     // if(path.length == 0) { break; }
        //     // console.log("testt");

        //     // var randNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        //     // path.push(randNeighbor);

        //     // if(neighbors.length == 1)
        //     // {
        //     //     path.splice(randNeighbor);
        //     // }
        //     // setTimeout(() => {  
        //     //     document.getElementById(`node-${randNeighbor.row}-${randNeighbor.col}`).className='node node-wall';}, 10 * i); //clear?
            
        //     console.log("testt");
        //     console.log(path.length);
        //     path.splice(index,1);
            
            
        //     console.log(node.row);
        //     node.isVisitedInMaze = true;
        //     node.isWall = true;
        //     setTimeout(() => {  
        //         document.getElementById(`node-${node.row}-${node.col}`).className='node node-wall';}, 10 * i); 
        //     const neighbors = this.getNeighbors(node);
        //     console.log("size of neighbors: ");
        //     console.log(neighbors.length);
        //     const unVisitedNeighbors = [];
        //     const visitedNeighbors = [];
        //     for(const neighbor of neighbors)
        //     {
        //         if(!neighbor.isVisitedInMaze)
        //         {
        //             unVisitedNeighbors.push(neighbor); 
        //         }
                

        //     }
        //     rand = Math.random();
        //     index = Math.floor(rand * visitedNeighbors.length);
        //     const randNeighbor = visitedNeighbors[index];
        //     randNeighbor.isVisitedInMaze = true;
        //     randNeighbor.isWall = true;
        //     setTimeout(() => {  
        //             document.getElementById(`node-${node.row}-${node.col}`).className='node node-wall';}, 10 * i); 
        //     neighbors.splice(index, 1);
        //     console.log("size of unvisoted neighbors: ");
        //     console.log(unVisitedNeighbors.length);
        //     if(unVisitedNeighbors.length !== 0)
        //     {
        //         let rand = Math.random();
        //         let index = Math.floor(rand * unVisitedNeighbors.length);
        //         const randNeighbor = unVisitedNeighbors[index];
        //         randNeighbor.isVisitedInMaze = true;
        //         randNeighbor.isWall = true;
        //         setTimeout(() => {  
        //             document.getElementById(`node-${node.row}-${node.col}`).className='node node-wall';}, 10 * i); 
        //         unVisitedNeighbors.splice(index, 1);
        //         for(const n of unVisitedNeighbors)
        //         {
        //             path.push(n);
        //         }
                
        //     }
            
            
    
    
    }

    getNeighbors(node)
    {
        const neighbors = [];
        const nodeCol = node.col;
        const nodeRow = node.row;
        //UP, DOWN, LEFT, RIGHT
        // if(nodeRow > 0) //If node is not in the very first row, then add the node above this node as a neighbor
        // {
        //     neighbors.push(this.state.nodes[nodeRow-2][nodeCol]);
        // }
        // if(nodeRow < this.state.nodes.length-2) //If node is not in the bottom row, then add the node below this node as a neighbor
        // {
        //     neighbors.push(this.state.nodes[nodeRow+2][nodeCol]);
        // }
        // if(nodeCol > 0)
        // {
        //     neighbors.push(this.state.nodes[nodeRow][nodeCol-2]);
        // }
        // if(nodeCol < this.state.nodes[0].length - 2)
        // {
        //     neighbors.push(this.state.nodes[nodeRow][nodeCol+2]);
        // }

        for(let i = 0; i < 4; i++)
        {
            var n = [nodeRow, nodeCol];
            n[i%2] += ((Math.floor(i/2)*2) || -2);
            if(n[0] < this.state.nodes.length && n[1] < this.state.nodes[0].length && n[0] > 0 && n[1] > 0)
            {
                if(this.state.nodes[n[0]][n[1]].isWall)
                {
                    neighbors.push(this.state.nodes[n[0]][n[1]]);
                }
            }
        }
        return neighbors;
    }


    visualizeDijkstra()
    {
        this.setState({isAnimating: true})
        const {nodes} = this.state;  
        // const start = nodes[START_NODE_ROW][START_NODE_COL];
        // const end = nodes[END_NODE_ROW][END_NODE_COL];
        const start = nodes[this.state.start_row][this.state.start_col];
        const end = nodes[this.state.end_row][this.state.end_col];
        const visitedNodes = dijkstraAlgo(nodes, start, end);
        const shortestPathNodes = shortestPath(start, end);
        
        //Animate
        for(let i = 0; i <= visitedNodes.length; i++)
        {
            if(i != visitedNodes.length)
            {
                setTimeout(() => {  
                    const node = visitedNodes[i];
                    document.getElementById(`node-${node.row}-${node.col}`).className='node node-visited';}, 10 * i); 
            } 
            else
            { 
                setTimeout(() => { 
                    this.visualizeShortestPath(shortestPathNodes);
                }, 12*i);
            }
            
        }
        
        
    }

    visualizeShortestPath(nodes)
    {
        //console.log(nodes.length);
        for(let i = 0; i < nodes.length; i++) 
        {
            setTimeout(() => {
                const node = nodes[i];
                document.getElementById(`node-${node.row}-${node.col}`).className='node node-shortest-path';}, 15 * i); 
        }
        this.setState({isAnimating: false})
    }

    clearGrid() //something buggy with this function :(
    {
        //this.setState({isClearing: true})
        
        if(!this.state.isAnimating)
        {
            const nodesToClear = [];
            const newNodes = this.state.nodes.slice();
            let i = 0
            for(const row of newNodes) //20 rows
            {
                for(const node of row)//60 columns  
                {   
                    i++;
                    //let nodeClass = document.getElementById(`node-${node.row}-${node.col}`,).className;
                    if(!node.isStart && !node.isFinish && !node.isWall)
                    {
                        //document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-clear';
                        setTimeout(() => {
                            document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-clear';
                        }, 2*i)
                        node.isVisited = false;
                        node.distance = Infinity;
                        node.parent = null;
                    }
                    if(node.isFinish)
                    {
                        node.isVisited = false;
                        node.distance = Infinity;
                        node.parent = null;
                        node.isFinish = true;
                        setTimeout(() => {
                            document.getElementById(`node-${node.row}-${node.col}`).className='node node-finish';}, 2*i);
                    }
                    if(node.isStart)
                    {
                        node.isVisited = false;
                        node.distance = Infinity;
                        node.isStart = true;
                        node.isWall = false;
                        node.parent = null;
                        setTimeout(() => {
                                document.getElementById(`node-${node.row}-${node.col}`).className='node node-start';}, 2*i);
                    }
                    if(node.isWall)
                    {
                        setTimeout(() => {
                            document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-clear';
                        }, 2*i)
                        
                        node.isWall = false;
                    }
                    // if(this.state.nodes[row][col].isVisited)
                    // {
                    //         //nodesToClear.push(this.state.nodes[row][col]);
                    //         //this.state.nodes[row][col].isVisited = false;
                    //         if(this.state.nodes[row][col].isStart)
                    //         {
                    //             //this.state.nodes[row][col].isStart = true;
                    //             setTimeout(() => {
                    //                 document.getElementById(`node-${row}-${col}`).className='node node-start';}, 15);
                    //             // this.setState({start_row: row, start_col: col});
                    //         }
                    //         else if(this.state.nodes[row][col].isFinish)
                    //         {
                    //             //this.state.nodes[row][col].isFinish = true;
                    //             setTimeout(() => {
                    //                 document.getElementById(`node-${row}-${col}`).className='node node-finish';}, 15);
                    //             // this.setState({end_row: row, end_col: col});
                    //         }
                    //         else {
                    //             nodesToClear.push(this.state.nodes[row][col]);
                    //             //this.state.nodes[row][col].isVisited = false;
                    //             // setTimeout(() => {
                    //             //                     const node = this.state.nodes[row][col];
                    //             //                     document.getElementById(`node-${node.row}-${node.col}`).className='node node-clear';}, 2*col);
                    //         }
                    //         this.state.nodes[row][col].isVisited = false;
                    //         this.state.nodes[row][col].distance = Infinity;
                    //         this.state.nodes[row][col].parent = null;
                    
                    // }
                    // if(this.state.nodes[row][col].isWall)
                    // {
                    //     nodesToClear.push(this.state.nodes[row][col]);
                    //     this.state.nodes[row][col].isWall = false;
                    //     this.state.nodes[row][col].isVisited = false;
                    //     this.state.nodes[row][col].distance = Infinity;
                    //     this.state.nodes[row][col].parent = null;

                    //     //this.state.nodes[row][col].isVisited = false;
                    //     // setTimeout(() => {
                    //     //     const node = this.state.nodes[row][col];
                    //     //     document.getElementById(`node-${node.row}-${node.col}`).className='node node-clear';}, 2*col);
                    // }

                    
                }
            
            }

            for(let i = 0; i < nodesToClear.length; i++)
            {
                // if(!nodesToClear[i].isStart)
                // {
                //     if(!nodesToClear[i].isFinish)
                //     {
                        setTimeout(() => {
                            const node = nodesToClear[i];
                            document.getElementById(`node-${node.row}-${node.col}`).className='node node-clear';}, 2*i);
                //     } 
                // }
                //this.setState({nodes: this.state.nodes});
                
            } 
        
            // setTimeout(() => {
            //     this.setState({isClearing: false})
            //     }, 1000);  
            // if(this.state.isAnimating)
            // {
            //     console.log("animating true");
            // }
        
        }   
    } 

    render() {
        const {nodes, mouseIsPressed} = this.state;
        //console.log(nodes)
        return (
        <>
            <button onClick={() => this.visualizeDijkstra()}> Visualize Dijkstra </button>
            <button onClick={() => this.clearGrid()}> Clear Grid</button> 
            <button onClick={() => this.genMaze()}> Gen Maze</button>
            <div className='nodes'>
                {nodes.map((row, rowIdx) => { //Iterate through every row and column and create a node
                    return ( <div key={rowIdx}>
                        {row.map((node, nodeIdx) => 
                        {
                            const {row, col, isStart, isFinish, isWall} = node;
                            
                            return (
                                <Node
                                    key={nodeIdx}  
                                    row={row}
                                    col={col}
                                    isStart ={isStart}
                                    isFinish={isFinish}
                                    isWall={isWall}
                                    mouseIsPressed={mouseIsPressed}
                                    onMouseDown={(row, col) => this.mouseDownHandler(row, col)}
                                    onMouseEnter={(row, col) => this.mouseEnterHandler(row, col)}
                                    onMouseUp={() => this.mouseUpHandler()}></Node>
                            );
                        })}
                     </div>
                    );
                })}
            </div>
        </>
        );
    }
}

const newGridWithWall = (nodes, row, col) => {
    const node = nodes[row][col];
    node.isWall = !node.isWall; //Toggled value
    return nodes; 
}
function getRandInt(min, max)
{
    return Math.floor(Math.random() * (max - min)) + min;
}

/*
// const newGridWithStart = (row, col, oldStart, nodes) => {
//     oldStart.isStart = false;
//     const node =  nodes[row][col];
//     node.isStart = true;
//     return nodes;
// }
*/

/*
    doubleClickHandler(row, col) //Allow user to move start/end node
    {
        if(this.state.nodes[row][col].isStart) //if user clicked on start node, allow it to be moved
        {
            //wait for another double click --> change start node to this row, col
            console.log("bye");
            const {nodes} = this.state;
            const oldStart = nodes[row][col];
            document.addEventListener("dblclick", (row, col) => {this.newGridWithStart(row, col, oldStart);});
            

            
        }
        else if(this.state.nodes[row][col].isFinish) //user clicked on finish node, allow it to be moved
        {
            //wait for another double click --> change finish node to this row, col
            console.log("bye");
        }
        else
        {
            return;
        }
    } 

    newGridWithStart(row, col, oldStart){
        const newGrid = this.state.nodes.slice();
        const node = newGrid[row][col];
        const newNode = {
            ...node,
            isStart: true,
        };
        newGrid[row][col] = newNode;
        this.setState({nodes: newGrid});
        // oldStart.isStart = false;
        // const {nodes} = this.state;
        // const node =  nodes[row][col];
        // node.isStart = true;
        // this.setState({nodes: nodes});
    }*/
    

/////----------
import React, { Component } from 'react';
import Node from './Node/Node';
import './PathFinder.css';
import { dijkstraAlgo, shortestPath } from '../dijkstra';
import '../styling.css';

var START_NODE_ROW = 10; //10
var START_NODE_COL = 10; // 10
var END_NODE_ROW = 10; //10
var END_NODE_COL = 50; //55
var START_NODE_CLICKED = false;
var END_NODE_CLICKED = false;

export default class PathFinder extends Component {
    constructor(){ 
        super();
        this.state = {
            nodes: [],
            mouseIsPressed: false,
            start_row: START_NODE_ROW,
            start_col: START_NODE_COL,
            end_row: END_NODE_ROW,
            end_col: END_NODE_COL,
            isAnimating: false,
            isClearing: false,
            isCreatingMaze: false,
        }; 
    }

    componentDidMount() {
        const nodes = []; //nodes is grid
        for(let row = 0; row < 21; row++) //20 rows
        {
            const currRow = [];
            for(let col = 0; col < 61; col++) //60 columns 
            {   
                const currNode = {
                    row: row, 
                    col: col,
                    isStart: row === START_NODE_ROW && col === START_NODE_COL,
                    isFinish: row === END_NODE_ROW && col === END_NODE_COL,
                    distance: Infinity,
                    isVisited: false, 
                    isWall: false,
                    parent: null,
                    f: 0, //For calculating path using A star
                    h: 0,
                    g: 0,
                };
                currRow.push(currNode);
            }
            nodes.push(currRow);
        }
        this.setState({nodes});
        //this.setState({start: nodes[START_NODE_ROW][START_NODE_COL], end: nodes[END_NODE_ROW][END_NODE_COL]});
    }

    //When mouse is pressed down
    mouseDownHandler(row, col)
    {
        if(!this.state.isAnimating && !this.state.isClearing)
        {
            if(row === this.state.start_row && col === this.state.start_col) //Start node has been clicked
            {
                if(!START_NODE_CLICKED) //Old start node has been clicked 
                {
                    console.log("test")
                    START_NODE_CLICKED = true;
                    //Set isStart property of this node to false
                    this.state.nodes[row][col].isStart = false;
                    //this.setState({start_row: 0, start_col: 0});
                } 
            }
            else if(START_NODE_CLICKED) //New start node has been clicked 
            {
                this.state.nodes[row][col].isStart = true;
                //START_NODE_ROW = row;
                //START_NODE_COL = col;
                //this.setState({start_row: START_NODE_ROW, start_col: START_NODE_COL, end_row: END_NODE_ROW, end_col: END_NODE_COL});
                //Set flag to false
                START_NODE_CLICKED = false;
                this.setState({start_row: row, start_col: col});
            }
            else if(row === this.state.end_row && col === this.state.end_col)
            {
                if(!END_NODE_CLICKED) //Old end node has been clicked 
                {
                    END_NODE_CLICKED = true;
                    //Set isFinish property of this node to false
                    this.state.nodes[row][col].isFinish = false;
                }

            }
            else if(END_NODE_CLICKED) //New end node has been clicked 
            {
                this.state.nodes[row][col].isFinish = true;
                //END_NODE_ROW = row;
                //END_NODE_COL = col;
                //Set flag to false
                END_NODE_CLICKED = false;
                this.setState({end_row: row, end_col: col});
                //this.setState({start_row: START_NODE_ROW, start_col: START_NODE_COL, end_row: END_NODE_ROW, end_col: END_NODE_COL});
            }
            else
            {
                const newNodes = newGridWithWall(this.state.nodes, row, col);
                //this.setState({nodes: newNodes, mouseIsPressed: true});
                this.setState({nodes: newNodes, mouseIsPressed: true});
            }
        }
        else{
            return;
        }
        //this.setState({mouseIsPressed: true});
        
    }

    //When mouse is within the grid and mouse is pressed
    mouseEnterHandler(row, col)
    {
        if(!this.state.isAnimating && !this.state.isClearing)
        {
            if(this.state.mouseIsPressed)
            {
                const newNodes = newGridWithWall(this.state.nodes, row, col);
                this.setState({nodes: newNodes}); //also add mouseIsPressed??
            }
            else
            {
                return;
            }
        }
        else
        {
            return;
        }
    }

    mouseUpHandler(row, col)
    {
        this.setState({mouseIsPressed: false}); //Update state
    }

    //Generates maze using randomized Prim's algorithm
    genMaze()
    {
        this.setState({isCreatingMaze: true});
        //Let the whole grid be walls initially
        for(const row of this.state.nodes)
        {
            for(const node of row)
            {
                if(node.isStart || node.isFinish) //If node is either start or finish node, skip this iteration
                {
                    continue;
                }
                else
                {
                    //Set node as wall
                    node.isWall = true;
                    setTimeout(() => {  
                        document.getElementById(`node-${node.row}-${node.col}`).className='node node-wall';});
                }
                
            }
        }

        //Let start node for passage be a random cell
        let random_row = getRandInt(0, 9); 
        random_row = random_row * 2 + 1; //Gets odd row number
        let random_col = getRandInt(0, 29);
        random_col = random_col * 2 + 1; //Gets odd column number

        //Set start node as a clear, non-wall node
        const startNode = this.state.nodes[random_row][random_col]; 
        startNode.isWall = false;
        setTimeout(() => {  
            document.getElementById(`node-${startNode.row}-${startNode.col}`).className='node node-clear';}, 10);
        
        var openPath = []; //The nodes that are part of the passage
        openPath.push(startNode);
        
        let i = 0; //For animation timing

        while(openPath.length !== 0)
        {
            var index = getRandInt(0, openPath.length-1);
            var node = openPath[index];
            var neighbors = this.getNeighbors(node);
           
            while(neighbors.length === 0)
            {
                openPath.splice(index, 1);  //If no neighbors, remove node from path nodes
                if(openPath.length === 0) 
                {
                    break;
                }

                index = getRandInt(0, openPath.length-1); 
                node = openPath[index]; //Get another node from path nodes
                neighbors = this.getNeighbors(node); //Get this node's neighbors
            }
            if(openPath.length === 0) //Exit loop is all passage nodes' neighbors have been explored
            {
                break;
            }

            const randNeighbor = neighbors[getRandInt(0, neighbors.length-1)]; //Get a random neighbor
            openPath.push(randNeighbor); //Add to passage set

            if(neighbors.length === 1) //If this neighbor is the last available one of this node, remove node from set
            {
                openPath.splice(index, 1);
            }

            //Set node to be a clear, non-wall node
            randNeighbor.isWall = false;
            setTimeout(() => { 
            document.getElementById(`node-${randNeighbor.row}-${randNeighbor.col}`).className='node node-clear';}, i*10);
            
            //Get the node between the random neighbor and the node from set (this is the connecting node) and set to be a clear node
            const connectingNode = this.state.nodes[Math.floor((randNeighbor.row + node.row)/2)][Math.floor((randNeighbor.col + node.col) /2)];
            connectingNode.isWall = false; //Set connecting node to be clear node so that is creates a passage between the node and its neighbor
            setTimeout(() => {  
                document.getElementById(`node-${connectingNode.row}-${connectingNode.col}`).className='node node-clear';}, i*10);
 
            i++; 
        }

        //Check is start or finish nodes have been changed to be clear or a wall, set them as start and finish nodes
        for(const row of this.state.nodes)
        {
            for(const node of row)
            {
                if(node.isStart) //If node is either start or finish node, skip this iteration
                {
                    node.isWall = false;
                    setTimeout(() => {  
                        document.getElementById(`node-${node.row}-${node.col}`).className='node node-start';}, i*10);
                }  
                if(node.isFinish) //If node is either start or finish node, skip this iteration
                {
                    node.isWall = false;
                    setTimeout(() => {  
                        document.getElementById(`node-${node.row}-${node.col}`).className='node node-finish';}, i*10);
                }                
            }
        }
        this.setState({isCreatingMaze: false});
    }

    getNeighbors(node)
    {
        const neighbors = [];
        const nodeCol = node.col;
        const nodeRow = node.row;
        //UP, DOWN, LEFT, RIGHT
        if(nodeRow > 1) //If node is not in the very first row, then add the node above this node as a neighbor
        {
                if(this.state.nodes[nodeRow-2][nodeCol].isWall)
                {
                    neighbors.push(this.state.nodes[nodeRow-2][nodeCol]);
                }
        }
        if(nodeRow < this.state.nodes.length-2) //If node is not in the bottom row, then add the node below this node as a neighbor
        {
                if(this.state.nodes[nodeRow+2][nodeCol].isWall)
                {
                    neighbors.push(this.state.nodes[nodeRow+2][nodeCol]);
                }
        }
        if(nodeCol > 1)
        { 
                if(this.state.nodes[nodeRow][nodeCol-2].isWall)
                {
                    neighbors.push(this.state.nodes[nodeRow][nodeCol-2]);
                }
        }
        if(nodeCol < this.state.nodes[0].length - 2)
        {
            if(this.state.nodes[nodeRow][nodeCol+2].isWall)
            {
                neighbors.push(this.state.nodes[nodeRow][nodeCol+2]);
            }
        } 
        return neighbors;
    }


    visualizeDijkstra()
    {
        this.setState({isAnimating: true})
        const {nodes} = this.state;  
        // const start = nodes[START_NODE_ROW][START_NODE_COL];
        // const end = nodes[END_NODE_ROW][END_NODE_COL];
        const start = nodes[this.state.start_row][this.state.start_col];
        const end = nodes[this.state.end_row][this.state.end_col];
        const visitedNodes = dijkstraAlgo(nodes, start, end);
        const shortestPathNodes = shortestPath(start, end);
        
        //Animate
        for(let i = 0; i <= visitedNodes.length; i++)
        {
            if(i !== visitedNodes.length)
            {
                setTimeout(() => {  
                    const node = visitedNodes[i];
                    document.getElementById(`node-${node.row}-${node.col}`).className='node node-visited';}, 10 * i); 
            } 
            else
            { 
                setTimeout(() => { 
                    this.visualizeShortestPath(shortestPathNodes);
                }, 12*i);
            }
            
        }
        
        
    }

    visualizeShortestPath(nodes)
    {
        //console.log(nodes.length);
        for(let i = 0; i < nodes.length; i++) 
        {
            setTimeout(() => {
                const node = nodes[i];
                document.getElementById(`node-${node.row}-${node.col}`).className='node node-shortest-path';}, 15 * i); 
        }
        this.setState({isAnimating: false})
    }

    clearGrid() //something buggy with this function :(
    {
        this.setState({isClearing: true})
        
        if(!this.state.isAnimating)
        {
            const newNodes = this.state.nodes.slice();
            let i = 0
            for(const row of newNodes) //20 rows
            {
                for(const node of row)//60 columns  
                {   
                    i++;
                    //let nodeClass = document.getElementById(`node-${node.row}-${node.col}`,).className;
                    if(!node.isStart && !node.isFinish && !node.isWall)
                    {
                        //document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-clear';
                        setTimeout(() => {
                            document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-clear';
                        }, 1);
                        node.isVisited = false;
                        node.distance = Infinity;
                        node.parent = null;
                    }
                    if(node.isFinish)
                    {
                        node.isVisited = false;
                        node.distance = Infinity;
                        node.parent = null;
                        node.isFinish = true;
                        setTimeout(() => {
                            document.getElementById(`node-${node.row}-${node.col}`).className='node node-finish';}, 1);
                    }
                    if(node.isStart)
                    {
                        node.isVisited = false;
                        node.distance = Infinity;
                        node.isStart = true;
                        node.isWall = false;
                        node.parent = null;
                        setTimeout(() => {
                                document.getElementById(`node-${node.row}-${node.col}`).className='node node-start';}, 1);
                    }
                    if(node.isWall)
                    {
                        setTimeout(() => {
                            document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-clear';
                        }, 1);
                        
                        node.isWall = false;
                    }
                    // if(this.state.nodes[row][col].isVisited)
                    // {
                    //         //nodesToClear.push(this.state.nodes[row][col]);
                    //         //this.state.nodes[row][col].isVisited = false;
                    //         if(this.state.nodes[row][col].isStart)
                    //         {
                    //             //this.state.nodes[row][col].isStart = true;
                    //             setTimeout(() => {
                    //                 document.getElementById(`node-${row}-${col}`).className='node node-start';}, 15);
                    //             // this.setState({start_row: row, start_col: col});
                    //         }
                    //         else if(this.state.nodes[row][col].isFinish)
                    //         {
                    //             //this.state.nodes[row][col].isFinish = true;
                    //             setTimeout(() => {
                    //                 document.getElementById(`node-${row}-${col}`).className='node node-finish';}, 15);
                    //             // this.setState({end_row: row, end_col: col});
                    //         }
                    //         else {
                    //             nodesToClear.push(this.state.nodes[row][col]);
                    //             //this.state.nodes[row][col].isVisited = false;
                    //             // setTimeout(() => {
                    //             //                     const node = this.state.nodes[row][col];
                    //             //                     document.getElementById(`node-${node.row}-${node.col}`).className='node node-clear';}, 2*col);
                    //         }
                    //         this.state.nodes[row][col].isVisited = false;
                    //         this.state.nodes[row][col].distance = Infinity;
                    //         this.state.nodes[row][col].parent = null;
                    
                    // }
                    // if(this.state.nodes[row][col].isWall)
                    // {
                    //     nodesToClear.push(this.state.nodes[row][col]);
                    //     this.state.nodes[row][col].isWall = false;
                    //     this.state.nodes[row][col].isVisited = false;
                    //     this.state.nodes[row][col].distance = Infinity;
                    //     this.state.nodes[row][col].parent = null;

                    //     //this.state.nodes[row][col].isVisited = false;
                    //     // setTimeout(() => {
                    //     //     const node = this.state.nodes[row][col];
                    //     //     document.getElementById(`node-${node.row}-${node.col}`).className='node node-clear';}, 2*col);
                    // }

                    
                }
            
            }
            
            // for(i = 0; i < nodesToClear.length; i++)
            // {
            //     // if(!nodesToClear[i].isStart)
            //     // {
            //     //     if(!nodesToClear[i].isFinish)
            //     //     {
            //             setTimeout(() => {
            //                 const node = nodesToClear[i];
            //                 document.getElementById(`node-${node.row}-${node.col}`).className='node node-clear';}, 2*i);
            //     //     } 
            //     // }
            //     //this.setState({nodes: this.state.nodes});
                
            // } 
        
            setTimeout(() => {
                this.setState({isClearing: false})
                }, i*2);  
            // if(this.state.isAnimating)
            // {
            //     console.log("animating true");
            // }
        
        }   
    }
    isValid(state1, state2){
        return state1 || state2;
    } 

    render() {
        const {nodes, mouseIsPressed} = this.state;
        //console.log(nodes)
        return (
        <> 
            <div className='navBar'>
            <button className='button-brand' onClick={() => window.location.reload()}> Pathfinding Visualizer </button>
            <button disabled={this.isValid(this.state.isClearing, this.state.isCreatingMaze)} className="button" onClick={() => this.visualizeDijkstra()}> Visualize Dijkstra </button>
            <button disabled={this.isValid(this.state.isClearing, this.state.isAnimating)} className="button" onClick={() => this.genMaze()}> Generate Maze</button>
            <button disabled={this.isValid(this.state.isCreatingMaze, this.state.isAnimating)} className="button" onClick={() => this.clearGrid()}> Clear Grid</button> 
            
            </div>

            <div className='inline'>
                <div className='icons'>
                    <div className='node node-start'></div>      
                </div>
            </div>
            <div className='inline'>  
                <div className='infoBar'>
                    <p className="infoText">Start Node</p>
                </div>
            </div> 
            <div className='inline'>
            <div className='icons'>
                    <div className='node node-finish'></div>      
                </div>  
            </div>
            <div className='inline'>  
                <div className='infoBar'>
                    <p className="infoText">Destination Node</p>
                </div>
            </div> 
            <div className='inline'>
                <div className='icons'>
                    <div className='node node-clear'></div>      
                </div>
            </div>
            <div className='inline'>  
                <div className='infoBar'>
                    <p className="infoText">Unvisited Node</p>
                </div>
            </div> 
            <div className='inline'>
                <div className='icons'>
                    <div className='node node-visited'></div>      
                </div>
            </div>
            <div className='inline'>  
                <div className='infoBar'>
                    <p className="infoText">Visited Node</p>
                </div>
            </div> 
            <div className='inline'>
                <div className='icons'>
                    <div className='node node-shortest-path'></div>      
                </div>
            </div>
            <div className='inline'>  
                <div className='infoBar'>
                    <p className="infoText">Shortest Path Node</p>
                </div>
            </div> 
            <div className='inline'>
                <div className='icons'>
                    <div className='node node-wall'></div>      
                </div>
            </div>
            <div className='inline'>  
                <div className='infoBar'>
                    <p className="infoText">Wall Node</p>
                </div>
            </div> 

            

           
            <div className='nodes'>
                {nodes.map((row, rowIdx) => { //Iterate through every row and column and create a node
                    return ( <div key={rowIdx}>
                        {row.map((node, nodeIdx) => 
                        {
                            const {row, col, isStart, isFinish, isWall} = node;
                            
                            return ( 
                                <Node
                                    key={nodeIdx}  
                                    row={row}
                                    col={col}
                                    isStart ={isStart}
                                    isFinish={isFinish}
                                    isWall={isWall}
                                    mouseIsPressed={mouseIsPressed}
                                    onMouseDown={(row, col) => this.mouseDownHandler(row, col)}
                                    onMouseEnter={(row, col) => this.mouseEnterHandler(row, col)}
                                    onMouseUp={() => this.mouseUpHandler()}></Node>
                            );
                        })}
                     </div>
                    );
                })}
            </div>
        </>
        );
    }
}

const newGridWithWall = (nodes, row, col) => {
    const node = nodes[row][col];
    node.isWall = !node.isWall; //Toggled value
    return nodes; 
}
function getRandInt(min, max)
{
    return Math.floor(Math.random() * (max - min)) + min;
}


