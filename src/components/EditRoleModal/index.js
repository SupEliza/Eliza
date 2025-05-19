import { useEffect, useState } from "react"
import { getPermissions, editRole } from "../../services/roles";
import styled from "styled-components"
import FormButton from "../Inputs/Button";
import APIResponse from "../ApiResponse";
import CircleLoad from "../CircleLoad";

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

const RoleNameContainer = styled.div`
    display: flex;
    width: 100%;
    gap: 1rem;
    flex-direction: column;
`

const RoleName = styled.div`
    width: 100%;
    box-sizing: border-box;
    border-radius: .5rem;
    border: 1px solid #D8D8D8;
    color: var(--login-text-color);
    font-family: "Nunito Sans";
    font-size: 1.125rem;
    padding: 1rem;
    background: #F1F4F9;
`

const PermissionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    border-radius: .5rem;
    border: 1px solid #D8D8D8;
    color: var(--login-text-color);
    padding: 1rem;
    background: #F1F4F9;
`

const Permissions = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .5rem;
    font-weight: 600;
`

const CheckboxContainer = styled.div`
    position: relative;
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;

    &:hover .check {
        stroke-dashoffset: 0;
    }

    & .background {
        fill: #ccc;
        transition: ease all 0.6s;
        -webkit-transition: ease all 0.6s;
    }

    & .stroke {
        fill: none;
        stroke: #fff;
        stroke-miterlimit: 10;
        stroke-width: 2px;
        stroke-dashoffset: 100;
        stroke-dasharray: 100;
        transition: ease all 0.6s;
        -webkit-transition: ease all 0.6s;
    }

    & .check {
        fill: none;
        stroke: #fff;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2px;
        stroke-dashoffset: 22;
        stroke-dasharray: 22;
        transition: ease all 0.6s;
        -webkit-transition: ease all 0.6s;
    }

    & input[type=checkbox] {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        margin: 0;
        opacity: 0;
        -appearance: none;
    }

    & input[type=checkbox]:hover {
        cursor: pointer;
    }

    & input[type=checkbox]:checked + svg .background {
        fill: var(--background);
    }

    & input[type=checkbox]:checked + svg .stroke {
        stroke-dashoffset: 0;
    }

    & input[type=checkbox]:checked + svg .check {
        stroke-dashoffset: 0;
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


function EditRoleModal({isOpen, setIsOpen, title, subtitle, selectedRole, selectedPerms, setSelectedPerms, fetchRoles, addNotification}){
    const [apiResponse, setApiResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [apiResponseColor, setApiResponseColor] = useState("");
    const [buttonDisable, setButtonDisable] = useState(false);
    const [permissions, setPermissions] = useState([]);

    async function fetchPermissions() {
        try {
            const response = await getPermissions();

            if (response.success === true) {
                setPermissions(response.permissions);
            }

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchPermissions();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setButtonDisable(true);

        if (selectedPerms.length === 0 || !selectedRole) {
            setApiResponseColor("red");
            setApiResponse("Por favor, preencha todos os campos.");
            setButtonDisable(false);
            setLoading(false);
            return;
        }

        try {
            const response = await editRole(selectedRole, selectedPerms);

            if(response.success === true){
                addNotification(response.message);
                fetchRoles();
                handleCancel();
            } else {
                setApiResponseColor("red");
                setApiResponse(response.message);
            }
        } catch (error) {
            setApiResponseColor("red");
            setApiResponse(error.message || "Ocorreu um erro ao editar o cargo.");
        }

        setButtonDisable(false);
        setLoading(false);
    }

    const handleCancel = () => {
        setSelectedPerms([]);
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
                            <RoleNameContainer>
                                <p>Cargo</p>

                                <RoleName>
                                    <p>{selectedRole}</p>
                                </RoleName>
                            </RoleNameContainer>
                        </InputLabel>
                    </InputContent>

                    <InputContent>
                        <InputLabel>
                            <p>Permissões</p>
                        </InputLabel>
                        <PermissionsContainer>
                            {permissions.map((permission) => {
                                const isChecked = selectedPerms.includes(permission.name);

                                const handleCheckboxChange = (e) => {
                                    if (e.target.checked) {
                                        setSelectedPerms((prev) => [...prev, permission.name]);
                                    } else {
                                        setSelectedPerms((prev) => prev.filter((perm) => perm !== permission.name));
                                    }
                                    };

                                return (
                                <Permissions key={permission.name}>
                                    <CheckboxContainer>
                                    <input 
                                        type="checkbox" 
                                        checked={isChecked}
                                        onChange={handleCheckboxChange}
                                    />
                                    <svg viewBox="0 0 35.6 35.6">
                                        <circle className="background" cx="17.8" cy="17.8" r="17.8"></circle>
                                        <circle className="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                                        <polyline className="check" points="11.78 18.12 15.55 22.23 25.17 12.87"></polyline>
                                    </svg>
                                    </CheckboxContainer>
                                    <p>{permission.name}</p>
                                </Permissions>
                                );
                            })}
                        </PermissionsContainer>
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

export default EditRoleModal