import { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import logo from "../assets/images/eliza2.jpeg";
import { ReactComponent as Arrow} from "../assets/svg/loginArrow.svg";
import Background from "../components/AccBackground/background";
import { login } from "../services/users";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../hooks/Authentication/authContext";
import APIResponse from "../components/ApiResponse";
import CircleLoad from "../components/CircleLoad";

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
`;

const LoginModal = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: var(--secondary-color);
    padding: .5rem;
    gap: 2rem;
    border-radius: 1rem;
    height: 36rem;
    width: 18rem;
    opacity: 0;
    transform: scale(0.9);
    transition: all 1s ease-in-out;

    &::-webkit-scrollbar{
        display: none;
    }

    &.active{
      opacity: 1;
      transform: scale(1);
    }

    @media only screen and (max-height: 635px) {
        height: 30rem;
        width: 18rem;
    }

    @media only screen and (min-width: 380px) {
        width: 22rem;
    }

    @media only screen and (min-width: 635px) {
        width: 30rem;
    }

    @media only screen and (max-height: 635px) and (min-width: 1000px) {
        width: 28rem;
    }

    @media only screen and (min-width: 1000px) and (min-height: 720px) {
        height: 42rem;
        width: 35rem;
    }
`;

const ModalTitle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    box-sizing: border-box;
    width: 100%;
    gap: 1.5rem;
`;

const ModalTexts = styled.p`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 80%;
    text-align: ${({ align }) => align || "left"};
`;

const Logo = styled.img`
    display: none;
    width: 6rem;
    border-radius: 50%;

    @media only screen and (min-height: 635px) {
        display: flex;
    }

    @media only screen and (min-height: 750px) and (min-width: 500px) {
        width: 8rem;
    }
`;

const LoginForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    justify-content: center;
    gap: 3rem;
`;

const Inputs = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    justify-content: center;
    gap: 1.5rem;
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 1rem;
    width: 80%;
`;

const LoginInput = styled.input`
    display: flex;
    width: 100%;
    box-sizing: border-box;
    padding: 1rem;
    border-radius: 12px;
    border: 1px solid #5C73DB;

    ::placeholder{
        color: var(--gray-400, #9FA6B2);
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }

    &:focus {
        outline: none;
    }
`;

const BottomContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    justify-content: center;
    gap: 1.5rem;
`;

const SubmitButton = styled.button`
    display: flex;
    font-family: Inter;
    font-size: 1.1rem;
    width: 80%;
    height: 3rem;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    border: none;
    border-radius: 0.75rem;
    background: var(--primary-color);
    color: var(--secondary-color);
    transition: all 0.3s ease-in-out;
    opacity: ${props => props.disable ? 0.5 : 1};
    pointer-events: ${props => props.disable ? 'none' : 'auto'};
    cursor: ${props => props.disable ? 'not-allowed' : 'pointer'};

    &:hover {
        background: var(--background);
        cursor: pointer;
    }

    &:hover .arrow-icon{
        animation: arrowAnimation 1s ease-in-out infinite;

        @keyframes arrowAnimation {
            0% {
                transform: translateX(0);
            }
            50% {
                transform: translateX(5px);
            }
            100% {
                transform: translateX(0);
            }
        }
    }
`;

const ArrowIcon = styled(Arrow)`
    fill: var(--secondary-color);
    transition: all 0.3s ease-in-out;
`;

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [apiResponse, setApiResponse] = useState("");
    const [apiResponseColor, setApiResponseColor] = useState("");
    const [buttonDisable, setButtonDisable] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const modalRef = useRef(null);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    useEffect(() => {
        document.title = "Eliza | Login";
      }, []);

    useEffect(() => {
        const element = modalRef.current;
      
        if (element) {
          const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                element.classList.add("active");
              } else {
                element.classList.remove("active");
              }
            },
            {
              root: null,
              threshold: 0.1,
            }
          );
      
          observer.observe(element);
      
          return () => observer.disconnect();
        }
      }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setApiResponseColor("red");
            setApiResponse("Por favor, preencha todos os campos.");
            return;
        }

        try {
            setLoading(true);
            setButtonDisable(true);
            const response = await login({ username, password });

            if (response.success === true) {
                setApiResponseColor("var(--primary-color)");
                setApiResponse(response.message);
                localStorage.setItem("user_uuid", response.uuid);

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else{
                setApiResponseColor("red");
                setApiResponse(response.message);
            }

            setTimeout(() => {
                setButtonDisable(false);
                setLoading(false);
            }, 2500);
        } catch (error) {
            setApiResponseColor("red");
            setApiResponse(error.message);
        }
    };

    return (
        <LoginContainer>
            <Background/>
            <LoginModal ref={modalRef}>
                <ModalTitle>
                    <Logo src={logo} alt="Logo Eliza"></Logo>
                    <ModalTexts align="center">Preencha suas credenciais para continuar.</ModalTexts>
                </ModalTitle>

                <LoginForm onSubmit={handleSubmit}>
                    <Inputs>
                        <InputContainer>
                            <ModalTexts>Usuário</ModalTexts>
                            <LoginInput type="text" onChange={(e) => setUsername(e.target.value)} placeholder="Digite seu usuário" />
                        </InputContainer>

                        <InputContainer>
                            <ModalTexts>Senha</ModalTexts>
                            <LoginInput type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Digite sua senha" />
                        </InputContainer>
                    </Inputs>

                    <BottomContainer>
                        <SubmitButton disable={buttonDisable} type="submit">
                            <p>Entrar</p>
                            <ArrowIcon className="arrow-icon"/>
                        </SubmitButton>

                        {loading ? <CircleLoad/> :
                            <APIResponse apiResponse={apiResponse} apiResponseColor={apiResponseColor}/>
                        }
                    </BottomContainer>

                </LoginForm>
            </LoginModal>
        </LoginContainer>
    );
}

export default Login;