import React from 'react'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(21,27,38,.15);

  padding: 16px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? 'skyblue': 'white')};

  display: flex;
  justify-content: center;
  align-items: center;
`

export default class Task extends React.Component {
  render() {
    return (    
      <Draggable draggableId={this.props.task.id} index={this.props.index}>

        {(provided, snapshot) => (

          <Container {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} isDragging={snapshot.isDragging}>

            {this.props.task.content}

          </Container>
        )}
      </Draggable>
    )
  }
}
