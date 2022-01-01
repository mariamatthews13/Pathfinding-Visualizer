export function dijkstraAlgo(grid, start, end)
{
    const visitedNodes = []; //In order
    start.distance = 0;
    const unVisitedNodes = [];

    // for(let i = 0;  i < grid.length; i++) //Gets all nodes which are unvisited at this point
    // {
    //     for(let j = 0;  j < grid[i].length; j++)
    //     {
    //         unVisitedNodes.push(grid[i][j]);
    //     }
    // }
    for (const row of grid) {
        for (const node of row) {
          unVisitedNodes.push(node);
        }
      }
    
    //   unVisitedNodes.sort((a, b) => a.distance - b.distance);
    //     console.log(unVisitedNodes[0].row);
    //     console.log(unVisitedNodes[0].col);
    //     const nearestNode = unVisitedNodes.shift();
    //     console.log(nearestNode.row);
    //     console.log(nearestNode.col);

    while(unVisitedNodes.length !== 0)
    {
        //Sort unvisited nodes by distance
        unVisitedNodes.sort((a, b) => a.distance - b.distance);
        // console.log(unVisitedNodes[0].row);
        // console.log(unVisitedNodes[0].col);
        //const nearestNode = alert(unVisitedNodes[0]); //Get first element which is the closest node
        
        //unVisitedNodes.splice(0,1); //Removes the first element
        const nearestNode = unVisitedNodes.shift(); //first nearest node is start node
        //If node is a wall, skip
        if(nearestNode.isWall)
        {
            continue;
        }

        //If nearest node's distance is infinity
        if(nearestNode.distance === Infinity)
        {
            return visitedNodes;
        }

        nearestNode.isVisited = true;
        visitedNodes.push(nearestNode);
        if(nearestNode === end)
        {
            return visitedNodes;
        }

        //Get neighbors
        const neighbors = getNeighbors(nearestNode, grid)
        const unvisitedNeighbors = neighbors.filter(node => !node.isVisited); //Only get unvisited nodes

        //Update unvisited neighbors' distances
        for(const neighbor of unvisitedNeighbors)
        {
            neighbor.distance = nearestNode.distance + 1;
            neighbor.parent = nearestNode;
        }

        //If nearest node's distance is infinity
        // if(nearestNode.distance === Infinity)
        // {
        //     return visitedNodes;
        // }
    } // end while

}

function getNeighbors(node, grid)
{
    const neighbors = [];
    const nodeCol = node.col;
    const nodeRow = node.row;
    //UP, DOWN, LEFT, RIGHT
    if(nodeRow > 0) //If node is not in the very first row, then add the node above this node as a neighbor
    {
        neighbors.push(grid[nodeRow-1][nodeCol]);
    }
    if(nodeRow < grid.length - 1) //If node is not in the bottom row, then add the node below this node as a neighbor
    {
        neighbors.push(grid[nodeRow+1][nodeCol]);
    }
    if(nodeCol > 0)
    {
        neighbors.push(grid[nodeRow][nodeCol-1]);
    }
    if(nodeCol < grid[0].length - 1)
    {
        neighbors.push(grid[nodeRow][nodeCol+1]);
    }
    return neighbors;
}

export function shortestPath(start, end)
{
    const nodesInReverseOrder = [];
    let curr = end;
    while(curr !== start.parent)
    {
        nodesInReverseOrder.push(curr);
        curr = curr.parent;
    }
    //Reverse the array so that the nodes are in the correct order
    const nodesInOrder = nodesInReverseOrder.reverse();
    return nodesInOrder;
}