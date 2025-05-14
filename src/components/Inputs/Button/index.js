import styled from "styled-components"

const AccButton = styled.button`
    width: 82%;
    height: 3.5rem;
    border-radius: 0.5rem;
    opacity: ${props => props.disable ? 0.5 : 0.8};
    border: none;
    background: var(--background);
    color: var(--secondary-color);
    font-family: "Nunito Sans";
    font-size: 1.25rem;
    font-weight: 700;   
    transition: all .7s;
    pointer-events: ${props => props.disable ? 'none' : 'auto'};
    cursor: ${props => props.disable ? 'not-allowed' : 'pointer'};

    &:hover{
        opacity: 1;
    }
`

function FormButton({type, content, action, disable}){
    return(
        <AccButton disable={disable} type={type} onClick={action}>{content}</AccButton>
    )
}

export default FormButton