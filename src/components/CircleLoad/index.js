import styled from "styled-components";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
`

const Load = styled.svg`
    box-sizing: border-box;
    height: 1.5rem;
    width: 1.5rem;
    transform-origin: center;
    animation: rotate4 2s linear infinite;

    & circle {
        fill: none;
        stroke: ${props => props.color || 'hsl(214, 97%, 59%)'}};
        stroke-width: 2;
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
        stroke-linecap: round;
        animation: dash4 1.5s ease-in-out infinite;

        @keyframes dash4 {
            0% {
                stroke-dasharray: 1, 200;
                stroke-dashoffset: 0;
            }
        
            50% {
                stroke-dasharray: 90, 200;
                stroke-dashoffset: -35px;
            }
        
            100% {
                stroke-dashoffset: -125px;
            }
        }
    }

    @keyframes rotate4 {
        100% {
            transform: rotate(360deg);
        }
    }
   

`

function CircleLoad({color}) {
    return (
        <Container>
            <Load color={color} viewBox="25 25 50 50">
            <circle r="20" cy="50" cx="50"></circle>
            </Load>
        </Container>
    );    
}

export default CircleLoad