import { useEffect, useState } from "react"
import { register } from "../../services/users";
import { getRoles } from "../../services/roles";
import styled from "styled-components"
import FormButton from "../Inputs/Button";
import APIResponse from "../ApiResponse";
import TextInput from "../Inputs/TextInput";
import CircleLoad from "../CircleLoad";
import InputPass from "../Inputs/PasswordInput";
import { useNotify } from "../../hooks/Notify/notifyContext";


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
    border-radius: 1rem;
    overflow: hidden;
    height: 65vh;
    width: 75vw;
    padding: 2rem;
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

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    height: 100%;
    width: 100%;
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

const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: .5rem;
    width: 100%;
    overflow-y: auto;

    &::-webkit-scrollbar {
        display: none;
    }

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

const SelectInput = styled.select`
    width: 100%;
    box-sizing: border-box;
    border-radius: .5rem;
    border: 1px solid #D8D8D8;
    color: var(--login-text-color);
    font-family: "Nunito Sans";
    font-size: 1.125rem;
    padding: 1rem;
    background: #F1F4F9;
    appearance: none;
    cursor: pointer;

    &:focus-visible{
        outline: none;
    }
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
    height: 2.8rem;
    align-items: center;
    width: 82%;
    box-sizing: border-box;
    border-radius: .5rem;
    color: black;
    opacity: ${props => props.disable ? 0.5 : 0.8};
    font-size: 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    pointer-events: ${props => props.disable ? 'none' : 'auto'};
    cursor: ${props => props.disable ? 'not-allowed' : 'pointer'};
    transition: all 0.3s ease-in-out;

    @media screen and (min-width: 768px) {
        height: 3.5rem;
        font-size: 1.25rem;
    }
`;



function AddUserModal({isOpen, setIsOpen, title, selectedRole, setSelectedRole, fetchUsers}){
    const [apiResponse, setApiResponse] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiResponseColor, setApiResponseColor] = useState("");
    const [buttonDisable, setButtonDisable] = useState(false);
    const [roles, setRoles] = useState([]);
    const { addNotification } = useNotify();

    async function fetchRoles() {
        try {
            const response = await getRoles();

            if (response.success === true) {
                setRoles(response.roles);
            }

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedRole || !username || !password) {
            setApiResponseColor("red");
            setApiResponse("Por favor, preencha todos os campos.");
            return;
        }

        try {
            setLoading(true);
            setButtonDisable(true);

            const response = await register({ username, password, role: selectedRole });

            if (response.success === true) {
                addNotification(response.message);
                handleCancel();
                fetchUsers();
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
        setUsername("");
        setPassword("");
        setShowPass(false);
        setSelectedRole("");
        setApiResponseColor("");
        setApiResponse("");
        setIsOpen(false);
    };    

    return(
        <Container isOpen={isOpen}>

            <ModalContainer isOpen={isOpen}>
                <ModalContent>
                    <Texts>
                        <Title>{title}</Title>
                    </Texts>

                    <FormContainer onSubmit={handleSubmit}>
                        <InputContent>
                            <InputLabel>
                                <EditUsername>
                                    <p>Usuário</p>

                                    <TextInput inputValue={username} setValue={setUsername} type={"text"} placeholder={"Digite o nome do usuário"}/>
                                    <InputPass showPass={showPass} setShowPass={setShowPass} placeholder={"Digite a senha do usuário"} password={password} setPassword={setPassword}/>
                                </EditUsername>
                            </InputLabel>
                        </InputContent>

                        <InputContent>
                            <InputLabel>
                                <p>Cargo</p>
                            </InputLabel>

                            <SelectInput value={selectedRole} onChange={(e) => {setSelectedRole(e.target.value)}}>
                                <option value={""}>Selecione</option>

                                {roles.map((role) => (
                                    <option key={role.name} value={role.name}>{role.name}</option>
                                ))}
                            </SelectInput>
                        </InputContent>

                        <ButtonsContainer>
                            <FormButton disable={buttonDisable} type={"submit"} content={"Continuar"}/>
                            <Button disable={buttonDisable} onClick={handleCancel}>Cancelar</Button>
                        </ButtonsContainer>

                        {loading ? <CircleLoad/> :
                            <APIResponse apiResponse={apiResponse} apiResponseColor={apiResponseColor}/>
                        }
                    </FormContainer>
                </ModalContent>
            </ModalContainer>
        </Container>
    )
}

export default AddUserModal