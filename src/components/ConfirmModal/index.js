import styled from "styled-components"
import CircleLoad from '../CircleLoad/index'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease-in-out;
  z-index: ${(props) => (props.isOpen ? 1000 : -1)};

  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  pointer-events: ${(props) => (props.isOpen ? "auto" : "none")};
`

const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    width: 70%;
    height: 25%;
    padding: 5%;
    border-radius: 1rem;
    background-color: var(--secondary-color);
    font-family: "Nunito Sans", sans-serif;
    transform: ${(props) => (props.isOpen ? "scale(1)" : "scale(0.9)")};
    opacity: ${(props) => (props.isOpen ? "1" : "0")};

    @media screen and (min-width: 450px){
        max-width: 20%;
        height: unset;
        padding: 3rem;
    }
`

const ModalConfirmation = styled.p`
    font-size: 1.2rem;
    text-align: center;
    color: var(--text-color);
`

const ModalOptions = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    width: 100%;
`;

const Button = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    color: black;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    &:hover{
        transform: scale(1.1);
    }
`;

function ConfirmModal({isOpen, setIsOpen, text, action, modalLoading}){
    return(
        <Container isOpen={isOpen}>
            <ModalContainer isOpen={isOpen}>
                <ModalConfirmation>{text}</ModalConfirmation>

                {modalLoading ? <CircleLoad/> : 
                    <ModalOptions>
                        <Button onClick={() => setIsOpen(false)}>Cancelar</Button>
                        <Button onClick={() => action()} style={{background: "var(--background)", color: "var(--secondary-color)"}}>Confirmar</Button>
                    </ModalOptions>
                }

            </ModalContainer>
        </Container>
    )
}

export default ConfirmModal