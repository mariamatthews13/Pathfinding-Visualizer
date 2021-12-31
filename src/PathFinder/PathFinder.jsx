import React, { Component } from 'react';
import Node from './Node/Node';
import './PathFinder.css';
import { dijkstraAlgo, shortestPath } from '../dijkstra';
import '../styling.css';

var START_NODE_ROW = 10; 
var START_NODE_COL = 10; 
var END_NODE_ROW = 10;
var END_NODE_COL = 50; 
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
        for(let row = 0; row < 21; row++) //21 rows
        {
            const currRow = [];
            for(let col = 0; col < 61; col++) //61 columns 
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
        document.getElementById('info').textContent = "To move a node, click on it and then click on the node where you'd like to place it. To create walls, click or click and drag the nodes you'd like to change into walls.";
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
                    
                    START_NODE_CLICKED = true;
                    //Set isStart property of this node to false
                    const node = this.state.nodes[row][col];
                    node.isStart = false;
                    //this.state.nodes[row][col].isStart = false;
                    
                } 
            }
            else if(START_NODE_CLICKED) //New start node has been clicked 
            {
                const node = this.state.nodes[row][col];
                node.isStart = true;
                //this.state.nodes[row][col].isStart = true;
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
                    const node = this.state.nodes[row][col];
                    node.isFinish = false;
                    //this.state.nodes[row][col].isFinish = false;
                }

            }
            else if(END_NODE_CLICKED) //New end node has been clicked 
            {
                const node = this.state.nodes[row][col];
                node.isFinish = true;
                //this.state.nodes[row][col].isFinish = true;
        
                //Set flag to false
                END_NODE_CLICKED = false;
                this.setState({end_row: row, end_col: col});
                
            }
            else
            {
                const newNodes = newGridWithWall(this.state.nodes, row, col);
                this.setState({nodes: newNodes, mouseIsPressed: true});
            }
        }
        else{
            return;
        }
        
    }

    //When mouse is within the grid and mouse is pressed
    mouseEnterHandler(row, col)
    {
        if(!this.state.isAnimating && !this.state.isClearing)
        {
            if(this.state.mouseIsPressed)
            {
                const newNodes = newGridWithWall(this.state.nodes, row, col);
                this.setState({nodes: newNodes}); 
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
        //document.getElementById('info').innerHTML = "A randomized version of Prim's algorithm is used to generate the maze. It is a perfect algorithm, meaning that there is always a unique path between any two nodes!";
        //this.setState({isCreatingMaze: true});
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

        var start = []
        do{
            start[0] = Math.floor(Math.random() *21);
        }while(start[0] % 2 === 0);
        do{
            start[1] = Math.floor(Math.random() * 61);
        }while(start[1] % 2 === 0);

        const startNode = this.state.nodes[start[0]][start[1]];
        
        //Let start node for passage be a random cell
        // let random_row = getRandInt(0, 9); 
        // random_row = random_row * 2 + 1; //Gets odd row number
        // let random_col = getRandInt(0, 29);
        // random_col = random_col * 2 + 1; //Gets odd column number

        //Set start node as a clear, non-wall node
        //const startNode = this.state.nodes[random_row][random_col]; 
        startNode.isWall = false;
        startNode.isVisited = false;
        startNode.distance = Infinity;
        startNode.parent = null;
        setTimeout(() => {  
            document.getElementById(`node-${startNode.row}-${startNode.col}`).className='node node-clear';}, 10);
        
        var openPath = []; //The nodes that are part of the passage
        openPath.push(startNode);
        
        let i = 0; //For animation timing

        while(openPath.length !== 0)
        {
            //var index = getRandInt(0, openPath.length-1);
            var index = Math.floor(Math.random() * openPath.length);
            var node = openPath[index];
            var neighbors = this.getNeighbors(node);
           
            while(neighbors.length === 0)
            {
                openPath.splice(index, 1);  //If no neighbors, remove node from path nodes
                if(openPath.length === 0) 
                {
                    break;
                }

                //index = getRandInt(0, openPath.length-1); 
                index = Math.floor(Math.random() * openPath.length);
                node = openPath[index]; //Get another node from path nodes
                neighbors = this.getNeighbors(node); //Get this node's neighbors
            }
            if(openPath.length === 0) //Exit loop is all passage nodes' neighbors have been explored
            {
                break;
            }
            const randNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)]; //Get a random neighbor
            //const randNeighbor = neighbors[getRandInt(0, neighbors.length-1)]; //Get a random neighbor
            openPath.push(randNeighbor); //Add to passage set

            if(neighbors.length === 1) //If this neighbor is the last available one of this node, remove node from set
            {
                openPath.splice(index, 1);
            }

            //Set node to be a clear, non-wall node
            randNeighbor.isWall = false;
            randNeighbor.isVisited = false;
            randNeighbor.distance = Infinity;
            randNeighbor.parent = null;
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
                if(node.isStart) 
                {
                    node.isWall = false;
                    setTimeout(() => {  
                        document.getElementById(`node-${node.row}-${node.col}`).className='node node-start';}, i*10);
                }  
                if(node.isFinish) 
                {
                    node.isWall = false;
                    setTimeout(() => {  
                        document.getElementById(`node-${node.row}-${node.col}`).className='node node-finish';}, i*10);
                }                
            }
        }
        //this.setState({isCreatingMaze: false});
    }

    //Get neighbors for maze algorithm
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
        //document.getElementById('info').innerHTML = "Dijkstra's algorithm is used which guarantees the shortest path!";
        //this.setState({isAnimating: true})
        const {nodes} = this.state;  
        const start = nodes[this.state.start_row][this.state.start_col];
        const end = nodes[this.state.end_row][this.state.end_col];
        const visitedNodes = dijkstraAlgo(nodes, start, end);
        const shortestPathNodes = shortestPath(start, end);
        
        //Animate
        var flag = false; 
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
                if(shortestPathNodes.length > 1)
                {
                    flag = true;
                    setTimeout(() => { 
                        this.visualizeShortestPath(shortestPathNodes);
                    }, 12*i);
                }
                
            }
            
        }

        if(flag === false)
        {
            setTimeout(() => { 
                this.setState({isAnimating: false})
            }, 10);
        }
        
        
        
    }

    visualizeShortestPath(nodes)
    {
        
        for(let i = 0; i < nodes.length; i++) 
        {
            setTimeout(() => {
                const node = nodes[i];
                document.getElementById(`node-${node.row}-${node.col}`).className='node node-shortest-path';}, 15 * i); 
        }
        //this.setState({isAnimating: false})
    }

    clearGrid() 
    {
        //document.getElementById('info').textContent = "To move a node, click on it and then click on the node where you'd like to place it. To create walls, click or click and drag the nodes you'd like to change into walls.";
        //this.setState({isClearing: true})
        
        if(!this.state.isAnimating)
        {
            const newNodes = this.state.nodes.slice();
            let i = 0;
            for(const row of newNodes) //20 rows
            {
                for(const node of row)//60 columns  
                {   
                    if(!node.isStart && !node.isFinish && !node.isWall)
                    {
                        setTimeout(() => {
                            document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-clear';
                        }, i*20);
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
                            document.getElementById(`node-${node.row}-${node.col}`).className='node node-finish';}, i*20);
                    }
                    if(node.isStart)
                    {
                        node.isVisited = false;
                        node.distance = Infinity;
                        node.isStart = true;
                        node.isWall = false;
                        node.parent = null;
                        setTimeout(() => {
                                document.getElementById(`node-${node.row}-${node.col}`).className='node node-start';}, i*20);
                    }
                    if(node.isWall)
                    {
                        setTimeout(() => {
                            document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-clear';
                        }, i*20);
                        
                        node.isWall = false;
                    }
                    
                }
            
            }
            
            // setTimeout(() => {
            //     //this.setState({isClearing: false})
            //     }, 1);  
        }   
    }

    //Gets boolean value for disabling button
    isValid(state1, state2){
        return state1 || state2;
    } 

    render() {
        const {nodes, mouseIsPressed} = this.state;
        return ( 
        <> 
            
            <div className='navBar'>
            <button className='button-brand' onClick={() => window.location.reload()}> Pathfinding Visualizer </button>
            <button disabled={this.isValid(this.state.isClearing, this.state.isCreatingMaze)} className="button" onClick={() => this.visualizeDijkstra()}> Find Shortest Path </button>
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

            
            <div id='info' className='moreInfo'></div>
            
            
           
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
