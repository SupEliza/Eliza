import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/users";
import { AuthContext } from "../../hooks/Authentication/authContext";
import { ReactComponent as Arrow} from "../../assets/svg/loginArrow.svg";
import styled from "styled-components";
import logo from "../../assets/images/eliza2.jpeg";
import Background from "../../components/AccBackground/background";
import APIResponse from "../../components/ApiResponse";
import CircleLoad from "../../components/CircleLoad";

// ... (mantém todos os styled components)

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [apiResponse, setApiResponse] = useState("");
    const [apiResponseColor, setApiResponseColor] = useState("");
    const [buttonDisable, setButtonDisable] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const modalRef = useRef(null);

    const { user, setUser } = useContext(AuthContext);

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
            { root: null, threshold: 0.1 }
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

                // 🔹 Salva token e uuid no localStorage
                localStorage.setItem("token", response.accessToken);
                localStorage.setItem("user_uuid", response.uuid);

                // 🔹 Atualiza o contexto
                setUser({
                    username: response.username,
                    user_role: response.user_role,
                    uuid: response.uuid,
                });

                navigate("/dashboard");
            } else {
                setApiResponseColor("red");
                setApiResponse(response.message || "Ocorreu um erro ao fazer login.");
            }

        } catch (error) {
            setApiResponseColor("red");
            setApiResponse(error.message || "Ocorreu um erro ao fazer login.");
        } finally {
            setButtonDisable(false);
            setLoading(false);
        }
    };

    return (
        <LoginContainer>
            <Background/>
            <LoginModal ref={modalRef}>
                <ModalTitle>
                    <Logo src={logo} alt="Logo Eliza"/>
                    <p>Preencha suas credenciais para continuar.</p>
                </ModalTitle>

                <LoginForm onSubmit={handleSubmit}>
                    <Inputs>
                        <InputContainer>
                            <p>Usuário</p>
                            <LoginInput
                                type="text"
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Digite seu usuário"
                            />
                        </InputContainer>

                        <InputContainer>
                            <p>Senha</p>
                            <LoginInput
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Digite sua senha"
                            />
                        </InputContainer>
                    </Inputs>

                    <BottomContainer>
                        <SubmitButton disable={buttonDisable} type="submit">
                            <p>Entrar</p>
                            <Arrow className="arrow-icon"/>
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