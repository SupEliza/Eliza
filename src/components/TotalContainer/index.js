import styled from "styled-components"
import CircleLoad from "../CircleLoad"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--total-background);
  border-radius: 1rem;
  color: white;
  height: 100%;
  width: 4rem;
`

function TotalContainer({loading, total}){
    return (
        <Container>
            {loading ? <CircleLoad color='white'/> : total}
        </Container>
    )
}

export default TotalContainer