import styled from "styled-components"
import CircleLoad from "../CircleLoad"

const TotalContainer = styled.div`
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
        <TotalContainer>
            {loading ? <CircleLoad color='white'/> : total}
        </TotalContainer>
    )
}

export default TotalContainer