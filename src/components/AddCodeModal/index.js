import styled from "styled-components"
import { useState } from "react"
import FormButton from "../Inputs/Button";
import APIResponse from "../ApiResponse";
import TextInput from "../Inputs/TextInput";
import CircleLoad from "../CircleLoad";
import { addCode } from "../../services/codes";

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
    border-radius: 1rem;
    overflow: hidden;
    height: 80vh;
    width: 70vw;
    padding: 3rem;
    background-color: var(--secondary-color);
    font-family: "Nunito Sans", sans-serif;
    transform: ${(props) => (props.isOpen ? "scale(1)" : "scale(0.9)")};
    opacity: ${(props) => (props.isOpen ? "1" : "0")};

    @media screen and (min-width: 625px){
        width: 60vw;
    }

    @media screen and (min-width: 1000px){
        width: 35vw;
    }

    @media screen and (min-width: 1000px) and (min-height: 925px){
        width: 30vw;
        height: 60vh;
    }
`

const Texts = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
`

const Title = styled.h1`
    color: var(--login-text-color);
    font-family: "Nunito Sans";
    font-size: 2rem;
    font-weight: 700;
`

const Subtitle = styled.p`
    color: var(--login-text-color);
    font-family: "Nunito Sans";
    text-align: center;
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -0.064px;
`

const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: .5rem;
    width: 100%;

    @media screen and (min-height: 580px){
        gap: 1rem;
    }

    @media screen and (min-height: 750px){
        gap: 2rem;
    }
`;

const InputContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 1rem;
`

const InputLabel = styled.label`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    color: var(--login-text-color);
    font-family: "Nunito Sans";
    font-size: 1.125rem;
`

const EditUsername = styled.div`
    display: flex;
    width: 100%;
    gap: 1rem;
    flex-direction: column;
`

const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
`

const Button = styled.div`
    display: flex;
    justify-content: center;
    height: 3.5rem;
    align-items: center;
    width: 82%;
    box-sizing: border-box;
    border-radius: .5rem;
    color: black;
    opacity: ${props => props.disable ? 0.5 : 0.8};
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    pointer-events: ${props => props.disable ? 'none' : 'auto'};
    cursor: ${props => props.disable ? 'not-allowed' : 'pointer'};
    transition: all 0.3s ease-in-out;
`;


function AddCodeModal({isOpen, setIsOpen, title, subtitle, addNotification, fetchCodes}){
    const [apiResponse, setApiResponse] = useState("");
    const [ean, setEan] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [apiResponseColor, setApiResponseColor] = useState("");
    const [buttonDisable, setButtonDisable] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!ean || !quantity) {
            setApiResponseColor("red");
            setApiResponse("Por favor, preencha todos os campos.");
            return;
        }

        try {
            setLoading(true);
            setButtonDisable(true);

            const response = await addCode({ ean, quantity });

            if (response.success === true) {
                addNotification(response.message);
                fetchCodes();
                handleCancel();
            } else {
                setApiResponseColor("red");
                setApiResponse(response.message);
            }

            setButtonDisable(false);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const handleCancel = () => {
        setEan("");
        setQuantity(1);
        setApiResponseColor("");
        setApiResponse("");
        setIsOpen(false);
    };    

    return(
        <Container isOpen={isOpen}>

            <ModalContainer isOpen={isOpen}>

                <Texts>
                    <Title>{title}</Title>
                    <Subtitle>{subtitle}</Subtitle>
                </Texts>

                <FormContainer onSubmit={handleSubmit}>
                    <InputContent>
                        <InputLabel>
                            <EditUsername>
                                <p>EAN</p>

                                <TextInput inputValue={ean} setValue={setEan} type={"text"} placeholder={"Digite o EAN que deseja adicionar"}/>
                            </EditUsername>
                        </InputLabel>
                    </InputContent>

                    <InputContent>
                        <InputLabel>
                            <p>Quantidade</p>
                        </InputLabel>

                        <TextInput inputValue={quantity} setValue={setQuantity} type={"number"} placeholder={"Digite a quantidade que deseja adicionar"}/>

                    </InputContent>

                    <ButtonsContainer>
                        <FormButton disable={buttonDisable} type={"submit"} content={"Continuar"}/>
                        <Button disable={buttonDisable} onClick={handleCancel}>Cancelar</Button>
                    </ButtonsContainer>

                    {loading ? <CircleLoad/> :
                        <APIResponse apiResponse={apiResponse} apiResponseColor={apiResponseColor}/>
                    }
                </FormContainer>
            </ModalContainer>
        </Container>
    )
}

export default AddCodeModal