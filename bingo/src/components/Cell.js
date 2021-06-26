function Cell(props) {
    const { happy } = props;
    const cellStyle = {
        backgroundImage: `url(/images/${props.brand}.png)`,
    }
    return (
        <div className={`Main-board-cell ${props.status ? 'selected' : ''} ${happy ? 'happy' : ''}`}
         style={{ width: props.size, height: props.size }}
            onClick={() => props.cellClick(props.index)} >
            <div className='Main-board-cell-container' style={cellStyle}>


            </div>
        </div>
    )
}

export default Cell;