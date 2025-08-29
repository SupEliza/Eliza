import styled from "styled-components"
import CircleLoad from "../CircleLoad"

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: var(--total-background);
  border-radius: .5rem;
  color: white;
  height: 100%;
  padding: 0 .8rem;
`

function TotalContainer({loading, total}){
    return (
        <Container>
            {loading ? <CircleLoad color='white'/> : `Total: ${total}`}
        </Container>
    )
}

export default TotalContainer