import { useState } from "react"
import styled from "styled-components"
import { getProducts } from "../../services/products"
import CircleLoad from "../CircleLoad"

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
    max-height: 70vh;
    width: 75vw;
    padding: 2rem;
    background-color: var(--secondary-color);
    font-family: "Nunito Sans", sans-serif;
    transform: ${(props) => (props.isOpen ? "scale(1)" : "scale(0.9)")};
    opacity: ${(props) => (props.isOpen ? "1" : "0")};
    transition: all 0.5s ease-in-out;

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


function NewPlateModal({isOpen, setIsOpen, title}){
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSearch(e) {
        setLoading(true);
        e.preventDefault();
        
        try {
            const response = await getProducts(search);

            if(response.success === true){
                setProducts(response.products);
            }else{
                setProducts([]);
            }
        } catch (error) {
            console.log(error);
        }

        setLoading(false);
    }

    const handleCancel = () => {
        setIsOpen(false);
    };    

    return(
        <Container isOpen={isOpen}>
            <ModalContainer isOpen={isOpen}>
                <ModalContent>
                    <Texts>
                        <Title>{title}</Title>
                    </Texts>

                    <form onSubmit={(e) => handleSearch(e)}>
                        <input 
                            type="search" 
                            placeholder="Descrição ou código" 
                            onChange={(e) => setSearch(e.target.value)} 
                        />
                        <button type="submit">Buscar</button>
                    </form>



                    {loading ? (
                        <CircleLoad />
                    ) : products && products.length > 0 ? (
                        <div>
                            {products.map((product) => (
                                <div>
                                    <p>{product.description}</p>
                                    <p>{product.ean}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Nenhum produto encontrado</p>
                    )}

                    <ButtonsContainer>
                        <Button disable={loading} onClick={handleCancel}>Cancelar</Button>
                    </ButtonsContainer>
                </ModalContent>
            </ModalContainer>
        </Container>
    )
}

export default NewPlateModal