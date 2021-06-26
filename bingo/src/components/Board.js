import Cell from './Cell';
const Board = (props) => {
    const {diffArray,fullSize} = props;
    const cells = [];
    for (let index = 0; index < 25; index++) {
        let happy = false;
        if(diffArray && diffArray.length){
            happy = diffArray.includes(index);
        }
        cells.push(<Cell key={index} index={index} size={props.size} brand={props.brandsList[index]}
            cellClick={props.cellClick} status={props.checkedList[index]}
            happy={happy} />);
    }
    return (
        <div className='Main-board' style={{ width: fullSize+10 }}>
            {cells}
        </div>
    );
}

export default Board;